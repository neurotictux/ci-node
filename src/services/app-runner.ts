import { spawn } from 'child_process'
import { join } from 'path'

import { Config } from '../config'
import { RunningProcess } from '../models'
import { LogType, onLog } from '../server'
import { ProjectService } from './project.service'

export class AppRunner {

    private static runningProcesses: RunningProcess[]
    private projectService: ProjectService

    constructor() {
        if (!AppRunner.runningProcesses)
            AppRunner.runningProcesses = []
        this.projectService = new ProjectService()
    }

    run(name: string): void {
        const proj = this.projectService.get(name)
        const child = spawn('sh', [Config.runnerApp, join(Config.publishPath, name), proj.fileName.replace('csproj', 'dll')])
        onLog(name, LogType.AppStart)
        child.stdout.on('data', data => onLog(name, LogType.AppData, data.toString()))
        child.stdout.on('close', () => onLog(name, LogType.AppEnd))
        AppRunner.runningProcesses.push({ name, pid: child.pid })
    }

    isRunning(name: string): boolean {
        return !!AppRunner.runningProcesses.find(p => p.name === name)
    }

    stop(name: string) {
        const runningProcess = AppRunner.runningProcesses.find(p => p.name === name)
        if (!runningProcess)
            throw Error(`App '${name}' is not running.`)

        process.kill(runningProcess.pid)
        AppRunner.runningProcesses = AppRunner.runningProcesses.filter(p => p.name !== name)
    }
}