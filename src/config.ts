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

const ext = isLinux ? 'sh' : 'bat'

runnerPublish = join(__dirname, 'scripts', `publish.${ext}`)
runnerLoadBranches = join(__dirname, 'scripts', `load-branches.${ext}`)
runnerApp = join(__dirname, 'scripts', `run.${ext}`)

export const Config = {
    runnerApp,
    runnerLoadBranches,
    runnerPublish,
    projectsJsonPath,
    logsPath,
    publishPath,
    isLinux
}