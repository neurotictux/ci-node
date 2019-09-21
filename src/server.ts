import * as bodyParser from 'body-parser'
import * as express from 'express'
import { existsSync } from 'fs'
import { writeFileSync } from 'fs'
import { createServer } from 'http'

import { Project } from './models'
import { AppRunner } from './services/app-runner'
import { ProjectService } from './services/project.service'

const projectService = new ProjectService()
const appRunner = new AppRunner()

const app = express()
app.use(bodyParser.json())

app.get('/projects', (req, res) => {
    const projects = projectService.getAll()
    projects.forEach(p => p.running = appRunner.isRunning(p.name))
    res.json(projects)
})

app.post('/publish', (req, res) => {
    const { project, branch } = req.body || {}
    projectService.publish(project, branch)
    res.end()
})

app.post('/run/:name', (req, res) => {
    const { name } = req.params || {}
    appRunner.run(name)
    res.end()
})

app.post('/project', (req, res) => {
    const { name, path } = req.body || {}
    try {
        if (!name || !path)
            throw { message: 'Informe o nome e o arquivo.' }
        const fileName = (/[a-zA-Z0-9-.]{2,}csproj$/.exec(path) || [])[0]
        if (!fileName)
            throw { message: 'Arquivo inválido.' }
        if (!existsSync(path))
            throw { message: 'O arquivo não foi localizado.' }
        const proj = new Project()
        proj.name = name
        proj.path = path.replace(fileName, '')
        proj.fileName = fileName
        projectService.save(proj)
        res.json({ message: 'Salvo com sucesso' })
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

const server = createServer(app)

server.listen(8000)

export enum LogType {
    AppStart = 'APP_RUN_START',
    AppData = 'APP_RUN_DATA',
    AppEnd = 'APP_RUN_END',
    PublishStart = 'APP_RUN_START',
    PublishData = 'APP_RUN_DATA',
    PublishEnd = 'APP_RUN_END',
}

export const onLog = (appName: string, type: LogType, data: string = '') => {
    writeFileSync(appName, data)
}