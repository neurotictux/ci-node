const { unlinkSync, readFileSync, writeFileSync } = require('fs')
const { join } = require('path')
const { execSync } = require('child_process')

const pathFile = join(__dirname, '..', 'projects.json')
const isLinux = process.platform === 'linux'

let runnerPublish = null
let runnerLoadBranches = null

if (isLinux) {
    runnerPublish = `sh ${join(__dirname, 'scripts', 'main.sh')}`
    runnerLoadBranches = `sh ${join(__dirname, 'scripts', 'load-branches.sh')}`
} else {
    runnerPublish = `powershell ${join(__dirname, 'scripts', 'main.ps1')}`
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

const publish = (project, branch) => {
    execSync(`${runnerPublish} ${resolveString(project)} ${resolveString(branch)}`)
}

module.exports = {
    loadAll,
    save,
    updateBranches,
    remove
}