import { spawn } from 'child_process'

import { Config } from '../config'
import { IChildProcess, IProcessChildRunner } from './'

export class WindowsChildFactory implements IProcessChildRunner {

  runLoadBranches(projectPath: string): IChildProcess {
    const child = spawn(Config.runnerLoadBranches, [projectPath], { shell: true })
    return {
      pid: child.pid,
      stdout: child.stdout
    }
  }

  runPublish(projectPath: string, branchName: string, publishFolder: string): IChildProcess {
    const child = spawn(Config.runnerPublish, [projectPath, branchName, publishFolder], { shell: true })
    return {
      pid: child.pid,
      stdout: child.stdout
    }
  }

  runApp(publishPath: string, fileName: string): IChildProcess {
    const child = spawn(Config.runnerApp, [publishPath, fileName], { shell: true })
    return {
      pid: child.pid,
      stdout: child.stdout
    }
  }
}