import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

import { StatusApp, StatusComponent } from './StatusApp'
import { LogArea } from './styles'

export function PublishedApps({ projects }) {

    const [log, setLog] = useState('')
    const runningLog = useSelector(state => state.runningLogState)

    function showLog(name) {
        if ((runningLog[name] || {}).log) {
            setLog(runningLog[name].log)
            const area = document.getElementById('text-log-running')
            if (area)
                area.scrollTo(0, area.scrollTopMax)
        }
    }

    function run(name) {
        if (!(runningLog[name] || {}).running)
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
                            <td><StatusComponent status={(runningLog[p.name] || {}).running ? StatusApp.OK : StatusApp.ERROR} project={p} /></td>
                            <td>{p.selectedBranch}</td>
                            <td>
                                <button className="btn btn-light btn-sm" onClick={() => showLog(p.name)}>Log</button>
                                <button className="btn btn-light btn-sm" onClick={() => run(p.name)}>{(runningLog[p.name] || {}).running ? 'Stop' : 'Run'}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <LogArea hidden={!log} value={log} id="text-log-running" className="text-log" disabled={true} />
        </div>
    )
}