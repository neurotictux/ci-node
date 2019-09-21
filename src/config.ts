import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const projectsJsonPath = join(__dirname, '..', 'projects.json')
const logsPath = join(__dirname, '..', 'logs')
const publishPath = join(__dirname, '..', 'publish')
const isLinux = process.platform === 'linux'

if (!existsSync(projectsJsonPath))
    writeFileSync(projectsJsonPath, JSON.stringify([]), 'utf-8')

if (!existsSync(logsPath))
    mkdirSync(logsPath)

if (!existsSync(publishPath))
    mkdirSync(publishPath)

let runnerPublish = null
let runnerLoadBranches = null
let runnerApp = null

if (isLinux) {
    runnerPublish = join(__dirname, 'scripts', 'publish.sh')
    runnerLoadBranches = `sh ${join(__dirname, 'scripts', 'load-branches.sh')}`
    runnerApp = join(__dirname, 'scripts', 'run.sh')
} else {
    runnerPublish = `powershell ${join(__dirname, 'scripts', 'publish.ps1')}`
    runnerLoadBranches = `powershell ${join(__dirname, 'scripts', 'load-branches.ps1')}`
    runnerApp = `powershell ${join(__dirname, 'scripts', 'run.sh')}`
}

export const Config = {
    runnerApp,
    runnerLoadBranches,
    runnerPublish,
    projectsJsonPath,
    logsPath,
    publishPath,
    isLinux
}