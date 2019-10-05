import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

import './Home.css'
import { Container, Table, ActionsButton } from './styles'
import { StatusApp, StatusComponent } from '../StatusApp'
import { PublishedApps } from '../PublishedApps'
import { setRunning, setPublishCurrentLog, setPublishes } from '../../store/actions'

export function Home() {

  const [projects, setProjects] = useState([])
  const [projectName, setProjectName] = useState('')
  const [projectPath, setProjectPath] = useState('')
  const [edition, setEdition] = useState(false)
  const [branches, setBranches] = useState({})
  const [error, setError] = useState('')
  const [publishing, setPublishing] = useState('')

  const publishLog = useSelector(state => state.publishLogState)
  const dispatch = useDispatch()

  useEffect(() => {
    refresh()
  }, [])

  useEffect(() => {
    if (publishLog.currentLog && (publishLog[publishLog.currentLog] || {}).log) {
      const area = document.getElementById('text-log-publish')
      if (area) {
        area.scrollTo(0, area.scrollTopMax)
        window.scrollTo(0, window.scrollMaxY)
      }
    }
  }, [publishLog])

  function refresh() {
    axios.get('projects').then(res => {
      const b = {}
      const appsRunning = []
      res.data.forEach(p => {
        b[p.name] = p.selectedBranch
        if (p.running)
          appsRunning.push(p.name)
      })
      if (appsRunning.length)
        dispatch(setRunning(appsRunning))

      dispatch(setPublishes(res.data.map(p => ({ name: p.name, log: p.logPublish }))))

      setBranches(b)
      setProjects(res.data)
    })
    clearForm()
  }

  function changeBranch(name, branch) {
    branches[name] = branch
    setBranches(branches)
  }

  function save() {
    axios.post('project', { name: projectName, path: projectPath })
      .then(res => {
        if (res.data && res.data.error)
          showError(res.data.error)
        else
          refresh()
      })
      .catch(err => console.log(Object.keys(err)))
  }

  function updateBranches(name) {
    axios.post(`branches/${name}`)
      .then(res => refresh())
      .catch(err => console.log(err))
  }

  function remove(name) {
    axios.delete(`project/${name}`)
      .then(res => refresh())
      .catch(err => console.log(err))
  }

  function publish(name) {
    axios.post('publish', { project: name, branch: branches[name] })
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  function clearForm() {
    setProjectName('')
    setProjectPath('')
    setEdition(false)
  }

  function showError(message) {
    setError(message || '')
    setTimeout(() => setError(''), 3000)
  }

  function showLog(name) {
    if (publishLog.currentLog === name)
      dispatch(setPublishCurrentLog(''))
    else
      dispatch(setPublishCurrentLog(name))
  }

  function getStatus(app) {
    if ((publishLog[app.name] || {}).publishing)
      return StatusApp.PROCESSING
    else if (!app.errorInPublish && app.published)
      return StatusApp.OK
    else
      return StatusApp.ERROR
  }

  return (
    <Container>
      <h4>Deployed</h4>
      <div style={{ marginBottom: '40px' }}>
        <PublishedApps projects={projects.filter(p => p.published)} />
      </div>
      <h3>Projects</h3>
      <Table hidden={!projects.length}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Path</th>
            <th>Branches</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.name}>
              <td>{p.name}</td>
              <td className="path-cell">{p.path + p.fileName}</td>
              <td>
                <select onChange={val => changeBranch(p.name, val.target.value)}>
                  {p.branches.map(x => <option key={x}>{x}</option>)}
                </select>
              </td>
              <td><StatusComponent status={getStatus(p)} project={p} /></td>
              <td>
                <ActionsButton>actions</ActionsButton>
                {/* <button className="btn btn-success btn-sm" onClick={() => updateBranches(p.name)}>Update Branches</button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(p.name)}>Remove</button>
                <br />
                <button className="btn btn-light btn-sm" hidden={!p.published} onClick={() => showLog(p.name)}>Log</button>
                <button className="btn btn-light btn-sm" onClick={() => publish(p.name)}>Deploy</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <button className="btn-add-projeto btn btn-light btn-sm" onClick={() => setEdition(true)}>Add Project</button>
      <div className="divForm" hidden={!edition}>
        <div className="form-group">
          <span className="label-form">Name:</span>
          <input value={projectName} onChange={val => setProjectName(val.target.value)} />
        </div>
        <div className="form-group">
          <span className="label-form">File .csproj:</span>
          <input value={projectPath} onChange={val => setProjectPath(val.target.value)} />
          <small id="emailHelp" className="form-text text-muted">Full path .csproj file.</small>
        </div>
        <button className="btn btn-light" onClick={() => clearForm()}>Cancel</button>
        <button className="btn btn-success" onClick={() => save()}>Save</button>
      </div>
      <span className="error-message">{error}</span>
      <div hidden={!(publishLog[publishLog.currentLog] || {}).log || !projects.length}>
        <textarea value={(publishLog[publishLog.currentLog] || {}).log} id="text-log-publish" className="text-log" disabled={true}>
        </textarea>
      </div>
    </Container>
  )
}