import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { Config } from '../config'
import { Project } from '../models'
import { ProcessChildRunner } from '../models'
import { LogType, onLog } from '../server'

interface ICurrentProcess {
    logFile: string
    name: string
    branch: string
    publishing: boolean
}

const resolveBranchNames = (str: string): string[] => {
    const result: string[] = []
    const branches = str.split(' ').map(p => (p || '').replace(/(\n)|(\t)/, ' '))
    branches.forEach(p => {
        p.split(' ').filter(x => x.includes('ref'))
            .forEach(x => result.push(x.trim()))
    })
    return result.map(p => p.replace(/(refs[/](heads|(remotes[/]origin))[/])/g, ''))
        .filter((v, i, arr) => v && v !== 'HEAD' && arr.indexOf(v) === i)
}

export class ProjectService {

    private static currentProcess: ICurrentProcess

    getAll(): Project[] {
        return JSON.parse(readFileSync(Config.projectsJsonPath, 'utf-8')) || []
    }

    get(name: string): Project {
        return this.getAll().find(p => p.name === name)
    }

    save(proj: Project) {
        const projects = this.getAll().filter(p => p.name.toLowerCase() !== proj.name.toLowerCase())
        proj.branches = []
        projects.push(proj)
        writeFileSync(Config.projectsJsonPath, JSON.stringify(projects), 'utf-8')
        this.updateBranches(proj.name)
    }

    remove(name: string) {
        const projects = this.getAll().filter(p => p.name.toLowerCase() !== name.toLowerCase())
        writeFileSync(Config.projectsJsonPath, JSON.stringify(projects), 'utf-8')
    }

    updateBranches(name: string) {
        return new Promise(resolve => {

            const projects = this.getAll()
            const proj = projects.find(p => p.name.toLowerCase() === name.toLowerCase())
            const child = ProcessChildRunner.runLoadBranches(proj.path)
            let branches = ''
            child.stdout.on('data', data => {
                const str = data.toString()
                if (str.includes('refs'))
                    branches += str
            })
            child.stdout.on('close', () => {
                proj.branches = resolveBranchNames(branches)
                if (proj.selectedBranch && proj.branches.includes(proj.selectedBranch))
                    proj.selectedBranch = proj.selectedBranch
                else
                    proj.selectedBranch = proj.branches[0]
                writeFileSync(Config.projectsJsonPath, JSON.stringify(projects), 'utf-8')
                resolve()
            })
        })
    }

    publish(name: string, branch: string) {
        if (ProjectService.currentProcess && ProjectService.currentProcess.publishing)
            throw Error('Há um projeto sendo publicado')

        name = (name || '').replace(/[ ]/g, '')
        branch = (branch || '').replace(/[ ]/g, '')
        const proj = this.getAll().find(p => p.name === name)
        const logFile = join(Config.logsPath, `${name}.log`)
        const publishFolder = join(Config.publishPath, name)
        const child = ProcessChildRunner.runPublish(proj.path, branch, publishFolder)
        onLog(name, LogType.PublishStart)
        proj.logPublish = ''
        child.stdout.on('data', data => {
            const str = data.toString()
            if (str && str.includes('Progress'))
                onLog(name, LogType.PublishData, proj.logPublish + str)
            else {
                proj.logPublish += str
                onLog(name, LogType.PublishData, proj.logPublish)
            }
        })
        child.stdout.on('close', () => {
            ProjectService.currentProcess.publishing = false
            proj.published = true
            proj.selectedBranch = branch
            proj.errorInPublish = proj.logPublish.includes('Errors in publishing.')
            onLog(name, LogType.PublishEnd, proj.errorInPublish ? 'ERROR' : 'OK')
            this.save(proj)
        })
        ProjectService.currentProcess = { logFile, name, branch, publishing: true }
    }
}