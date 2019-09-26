import { spawn } from 'child_process'

import { Config } from '../config'
import { IChildProcess, IProcessChildRunner } from './'

export class LinuxChildFactory implements IProcessChildRunner {
  runLoadBranches(projectPath: string): IChildProcess {
    const child = spawn('sh', [Config.runnerLoadBranches, projectPath])
    return {
      pid: child.pid,
      stdout: child.stdout
    }
  }

  runPublish(projectPath: string, branchName: string, publishFolder: string): IChildProcess {
    const child = spawn('sh', [Config.runnerPublish, projectPath, branchName, publishFolder])
    return {
      pid: child.pid,
      stdout: child.stdout
    }
  }

  runApp(publishPath: string, fileName: string): IChildProcess {
    const child = spawn('sh', [Config.runnerApp, publishPath, fileName])
    return {
      pid: child.pid,
      stdout: child.stdout
    }
  }
}
