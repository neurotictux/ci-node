import { Config } from '../config'
import { IProcessChildRunner, LinuxChildFactory, WindowsChildFactory } from './'

let processRunner: IProcessChildRunner

if (Config.isLinux)
  processRunner = new LinuxChildFactory()
else
  processRunner = new WindowsChildFactory()

export const ProcessChildRunner = processRunner