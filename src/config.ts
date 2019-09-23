import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const configDir = join(__dirname, '..')
const projectsJsonPath = join(configDir, 'projects.json')
const logsPath = join(configDir, 'logs')
const publishPath = join(configDir, 'publish')
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
let shell = null

if (isLinux) {
    runnerPublish = join(__dirname, 'scripts', 'publish.sh')
    runnerLoadBranches = join(__dirname, 'scripts', 'load-branches.sh')
    runnerApp = join(__dirname, 'scripts', 'run.sh')
    shell = 'sh'
} else {
    runnerPublish = join(__dirname, 'scripts', 'publish.ps1')
    runnerLoadBranches = join(__dirname, 'scripts', 'load-branches.ps1')
    runnerApp = join(__dirname, 'scripts', 'run.sh')
    shell = 'powershell'
}

export const Config = {
    runnerApp,
    runnerLoadBranches,
    runnerPublish,
    projectsJsonPath,
    logsPath,
    publishPath,
    isLinux,
    shell
}