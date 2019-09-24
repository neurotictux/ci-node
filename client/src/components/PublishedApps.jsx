import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { StatusApp, StatusComponent } from './StatusApp'
import { Socket, LogType } from '../socket'
import { LogArea } from './styles'

export function PublishedApps({ projects }) {

    const [log, setLog] = useState('')
    const [appLogs, setAppLogs] = useState({})

    useEffect(() => {
        projects.forEach(p => {
            appLogs[p.name] = p.running
        })
        setAppLogs(appLogs)
    }, [projects])

    useEffect(() => {
        Socket.on(LogType.AppStart, data => {
            appLogs[data.appName] = { log: '', running: true }
            setAppLogs(appLogs)
        })
        Socket.on(LogType.AppData, data => {
            let appLogsTemp = Object.assign({}, appLogs)
            if (!appLogsTemp[data.appName])
                appLogsTemp[data.appName] = { log: '', running: true }
            appLogsTemp[data.appName].log = (appLogsTemp[data.appName].log || '') + (data.data || '')
            appLogsTemp[data.appName].running = true
            setAppLogs(appLogsTemp)
        })
        Socket.on(LogType.AppEnd, data => {
            if (!appLogs[data.appName])
                appLogs[data.appName] = { log: '', running: false }
            appLogs[data.appName].running = false
            setAppLogs(projects)
        })
    }, [])

    function showLog(name) {
        if ((appLogs[name] || {}).log) {
            setLog(appLogs[name].log)
            const area = document.getElementById('text-log-running')
            if (area)
                area.scrollTo(0, area.scrollTopMax)
        }
    }

    function run(name) {
        if (!(appLogs[name] || {}).running)
            showLog(name)

        axios.post(`run/${name}`)
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }

    return (
        <div>
            <table hidden={!projects.length} className="projects-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Branches</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(p => (
                        <tr key={p.name}>
                            <td>{p.name}</td>
                            <td><StatusComponent status={(appLogs[p.name] || {}).running ? StatusApp.OK : StatusApp.ERROR} project={p} /></td>
                            <td>{p.selectedBranch}</td>
                            <td>
                                <button className="btn btn-light btn-sm" onClick={() => showLog(p.name)}>Log</button>
                                <button className="btn btn-light btn-sm" onClick={() => run(p.name)}>{(appLogs[p.name] || {}).running ? 'Stop' : 'Run'}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <LogArea hidden={!log} value={log} id="text-log-running" className="text-log" disabled={true} />
        </div>
    )
}