import { execSync, spawn } from 'child_process'
import { readFileSync, unlinkSync, writeFileSync } from 'fs'
import { join } from 'path'

import { Config } from '../config'
import { Project } from '../models'
import { LogType, onLog } from '../server'

interface ICurrentProcess {
    logFile: string
    name: string
    branch: string
    publishing: boolean
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
            const child = spawn(Config.shell, [Config.runnerLoadBranches, proj.path])
            let branches = ''
            child.stdout.on('data', data => {
                const str = data.toString()
                if (str.includes('refs'))
                    branches += str
            })

            child.stdout.on('close', () => {
                branches = branches.replace(/(refs[/](heads|(remotes[/]origin))[/])|(\n)/g, '')
                proj.branches = branches.split(' ').map(p => p.trim())
                proj.branches = proj.branches.filter((v, i, arr) => v && v !== 'HEAD' && arr.indexOf(v) === i)
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
        const child = spawn(Config.shell, [Config.runnerPublish, proj.path, branch, publishFolder])
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
            onLog(name, LogType.PublishEnd, 'ERROR')
            ProjectService.currentProcess.publishing = false
            proj.published = true
            proj.selectedBranch = branch
            proj.errorInPublish = proj.logPublish.includes('Errors in publishing.')
            this.save(proj)
        })
        ProjectService.currentProcess = { logFile, name, branch, publishing: true }
    }
}