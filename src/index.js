const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const http = require('http')
const { execSync } = require('child_process')
const projectService = require('./projectService')

const app = express()
app.use(bodyParser.json())

app.get('/projects', (req, res) => res.json(projectService.loadAll()))

app.post('/publish', (req, res) => {
    const { project, branch } = req.body || {}
    projectService.publish(project, branch)
    res.json(projectService.currentPublish())
})

app.post('/run/:name', (req, res) => {
    const { name } = req.params || {}
    projectService.run(name)
    res.json(projectService.runningProcesses)
})

app.get('/publish', (req, res) => res.json(projectService.currentPublish()))

app.post('/project', (req, res) => {
    const { name, path } = req.body || {}
    try {
        if (!name || !path)
            throw { message: 'Informe o nome e o arquivo.' }
        const fileName = (/[a-zA-Z0-9-.]{2,}csproj$/.exec(path) || [])[0]
        if (!fileName)
            throw { message: 'Arquivo inválido.' }
        if (!fs.existsSync(path))
            throw { message: 'O arquivo não foi localizado.' }

        projectService.save({ name, path: path.replace(fileName, ''), fileName })
        res.json('Salvo com sucesso')
    } catch (ex) {
        res.json({ error: ex.message })
    }
})

app.post('/branches/:name', (req, res) => {
    const { name } = req.params || {}
    projectService.updateBranches(name)
    res.end()
})

app.delete('/project/:name', (req, res) => {
    const { name } = req.params || {}
    projectService.remove(name)
    res.end()
})

const server = http.createServer(app)

server.listen(8000)