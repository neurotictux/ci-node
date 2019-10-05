import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

import { StatusApp, StatusComponent } from './StatusApp'
import { LogArea, Table, ActionsButton, StatusRunning } from './styles'

export function PublishedApps({ projects }) {

    const [currentLogName, setCurrentLogName] = useState('')

    const runningLog = useSelector(state => state.runningLogState)

    function showLog(name) {
        setCurrentLogName(currentLogName === name ? '' : name)
        // if ((runningLog[name] || {}).log) {
        //     setLog(runningLog[name].log)
        //     const area = document.getElementById('text-log-running')
        //     if (area)
        //         area.scrollTo(0, area.scrollTopMax)
        // }
    }

    function run(name) {
        if (!(runningLog[name] || {}).running)
            showLog(name)

        axios.post(`run/${name}`)
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }

    return (
        <>
            <Table hidden={!projects.length}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Branches</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(p => (
                        <tr key={p.name}>
                            <td>{p.name}</td>
                            <td>{p.selectedBranch}</td>
                            <td>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <div style={{
                                        width: '100px',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        backgroundColor: '#32533a',
                                    }}>
                                        <StatusRunning />
                                    </div>
                                </div>
                                {/* <StatusComponent status={(runningLog[p.name] || {}).running ? StatusApp.OK : StatusApp.ERROR} project={p} /> */}
                            </td>
                            <td>
                                {/* <button className="btn btn-light btn-sm" onClick={() => showLog(p.name)}>Log</button>
                                <button className="btn btn-light btn-sm" onClick={() => run(p.name)}>{(runningLog[p.name] || {}).running ? 'Stop' : 'Run'}</button> */}
                                <ActionsButton>actions</ActionsButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <LogArea hidden={!(runningLog[currentLogName] || {}).log} value={(runningLog[currentLogName] || {}).log} id="text-log-running" disabled={true} />
        </>
    )
}