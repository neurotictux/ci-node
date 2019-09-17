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
    console.log({ project, branch })
    res.end('Publicando...')
})

app.post('/project', (req, res) => {
    const { name, path } = req.body || {}
    if (!name || !path)
        return res.json({ error: 'Informe o nome e o caminho do projeto.' })
    if (!fs.existsSync(path))
        return res.status(200).json({ error: 'O diretório informado não existe.' })
    try {
        projectService.save({ name, path })
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