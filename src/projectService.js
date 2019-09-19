const kill = require('tree-kill')
const { unlinkSync, readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs')
const { join } = require('path')
const { spawn, execSync, exec } = require('child_process')
const pathFile = join(__dirname, '..', 'projects.json')
const pathLogs = join(__dirname, '..', 'logs')
const publishPath = join(__dirname, '..', 'publish')
const isLinux = process.platform === 'linux'

let currentProcess = null
let runningProcesses = []

if (!existsSync(pathFile))
    writeFileSync(pathFile, JSON.stringify([]), 'utf-8')

if (!existsSync(pathLogs))
    mkdirSync(pathLogs)

if (!existsSync(publishPath))
    mkdirSync(publishPath)

let runnerPublish = null
let runnerLoadBranches = null
let runnerApp = null

if (isLinux) {
    runnerPublish = `sh ${join(__dirname, 'scripts', 'publish.sh')}`
    runnerLoadBranches = `sh ${join(__dirname, 'scripts', 'load-branches.sh')}`
    runnerApp = join(__dirname, 'scripts', 'run.sh')
} else {
    runnerPublish = `powershell ${join(__dirname, 'scripts', 'publish.ps1')}`
    runnerLoadBranches = `powershell ${join(__dirname, 'scripts', 'load-branches.ps1')}`
    runnerApp = `powershell ${join(__dirname, 'scripts', 'run.sh')}`
}
const resolveString = str => (str || '').replace(/[ ]/g, '')

const loadAll = () => JSON.parse(readFileSync(pathFile, 'utf-8')) || []

const loadOne = name => loadAll().find(p => p.name === name)

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
    proj.selectedBranch = proj.selectedBranch && proj.branches.includes(proj.selectedBranch) ? proj.selectedBranch : proj.branches[0]
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
    exec(command, () => {
        currentProcess.publishing = false
        proj.published = true
        proj.selectedBranch = branch
        save(proj)
    })
}

const run = name => {
    console.log(runningProcesses)
    const proj = loadOne(name)
    const running = runningProcesses.find(p => p.name === name)
    if (running) {
        kill(running.pid)
        console.log(`${name} killed.`)
        runningProcesses = runningProcesses.filter(p => p.name !== name)
    } else {
        const child = spawn('sh', [runnerApp, join(publishPath, name), proj.fileName.replace('csproj', 'dll')])
        runningProcesses.push({ name, pid: child.pid })
        console.log(`${child.pid} started`)
    }
    proj.running = !running
    save(proj)
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
    run,
    currentPublish,
    runningProcesses
}