import { existsSync } from 'fs'
import { createServer } from 'http'

import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as socketio from 'socket.io'

import { Project } from './models'
import { AppRunner } from './services/app-runner'
import { ProjectService } from './services/project.service'

interface IClientSocket {
    emit(type: string, data: { name: string, log: string }): void
}

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
    if (appRunner.isRunning(project))
        appRunner.stop(project)
    projectService.publish(project, branch)
    res.end()
})

app.post('/run/:name', (req, res) => {
    const { name } = req.params || {}
    if (appRunner.isRunning(name))
        appRunner.stop(name)
    else
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
    projectService.updateBranches(name).then(() => res.end())
})

app.delete('/project/:name', (req, res) => {
    const { name } = req.params || {}
    projectService.remove(name)
    res.end()
})

const server = createServer(app)
const io = socketio(server)
const clients: IClientSocket[] = []
io.on('connection', (client: IClientSocket) => clients.push(client))

server.listen(8000)

export enum LogType {
    AppStart = 'APP_RUN_START',
    AppData = 'APP_RUN_DATA',
    AppEnd = 'APP_RUN_END',
    PublishStart = 'APP_PUBLISH_START',
    PublishData = 'APP_PUBLISH_DATA',
    PublishEnd = 'APP_PUBLISH_END',
}

export const onLog = (name: string, type: LogType, log: string = '') => {
    clients.forEach(p => p.emit(type.toString(), { name, log }))
}