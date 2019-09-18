const { unlinkSync, readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs')
const { join } = require('path')
const { execSync, exec } = require('child_process')
const pathFile = join(__dirname, '..', 'projects.json')
const pathLogs = join(__dirname, '..', 'logs')
const publishPath = join(__dirname, '..', 'publish')
const isLinux = process.platform === 'linux'

let currentProcess = null

if (!existsSync(pathFile))
    writeFileSync(pathFile, JSON.stringify([]), 'utf-8')

if (!existsSync(pathLogs))
    mkdirSync(pathLogs)

if (!existsSync(publishPath))
    mkdirSync(publishPath)

let runnerPublish = null
let runnerLoadBranches = null

if (isLinux) {
    runnerPublish = `sh ${join(__dirname, 'scripts', 'publish.sh')}`
    runnerLoadBranches = `sh ${join(__dirname, 'scripts', 'load-branches.sh')}`
} else {
    runnerPublish = `powershell ${join(__dirname, 'scripts', 'publish.ps1')}`
    runnerLoadBranches = `powershell ${join(__dirname, 'scripts', 'load-branches.ps1')}`
}
const resolveString = str => (str || '').replace(/[ ]/g, '')

const loadAll = () => JSON.parse(readFileSync(pathFile, 'utf-8')) || []

const save = proj => {
    const projects = loadAll().filter(p => p.name.toLowerCase() !== proj.name.toLowerCase())
    proj.branches = []
    projects.push(proj)
    writeFileSync(pathFile, JSON.stringify(projects), 'utf-8')
    updateBranches(proj.name)
}

const remove = name => {
    const projects = loadAll().filter(p => p.name.toLowerCase() !== name.toLowerCase())
    writeFileSync(pathFile, JSON.stringify(projects), 'utf-8')
}

const updateBranches = name => {
    const projects = loadAll()
    const proj = projects.find(p => p.name.toLowerCase() === name.toLowerCase())
    const outputPath = join(__dirname, `branches_${name}`)
    execSync(`${runnerLoadBranches} ${name} ${proj.path} ${outputPath}`)
    const result = readFileSync(outputPath, 'utf-8').replace(/(refs[/](heads|(remotes[/]origin))[/])|(\n)/g, '')
    unlinkSync(outputPath)
    proj.branches = result.split(' ').map(p => p.trim())
    proj.branches = proj.branches.filter((v, i, arr) => arr.indexOf(v) === i)
    writeFileSync(pathFile, JSON.stringify(projects), 'utf-8')
}

const publish = (name, branch) => {
    if (currentProcess && currentProcess.publishing)
        throw 'Há um projeto sendo publicado'
    name = resolveString(name)
    branch = resolveString(branch)
    const proj = loadAll().find(p => p.name === name)
    const logFile = join(pathLogs, `${name}.log`)
    const publishFolder = join(publishPath, name)
    const command = `${runnerPublish} ${proj.path} ${branch} ${publishFolder} ${logFile}`
    currentProcess = { logFile, name, branch }
    exec(command, () => currentProcess.publishing = false)
}

const currentPublish = () => {
    const result = Object.assign({}, currentProcess)
    if (result && result.logFile)
        result.log = readFileSync(result.logFile, 'utf-8')
    return Object.assign({}, result)
}

module.exports = {
    loadAll,
    save,
    updateBranches,
    remove,
    publish,
    currentPublish
}