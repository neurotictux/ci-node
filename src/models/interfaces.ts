export interface IChildProcess {
  pid: number
  stdout: { on(event: string, listener: (data: string) => void): void }
}

export interface IProcessChildRunner {
  runLoadBranches(projectPath: string): IChildProcess
  runPublish(projectPath: string, branchName: string, publishFolder: string): IChildProcess
  runApp(publishPath: string, fileName: string): IChildProcess
}
