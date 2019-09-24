import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'

import './App.css';
import { StatusApp, StatusComponent } from './components/StatusApp'
import { PublishedApps } from './components/PublishedApps'
import { setRunning } from './store/actions'

function App() {

  const [projects, setProjects] = useState([])
  const [projectName, setProjectName] = useState('')
  const [projectPath, setProjectPath] = useState('')
  const [edition, setEdition] = useState(false)
  const [branches, setBranches] = useState({})
  const [log, setLog] = useState('')
  const [error, setError] = useState('')
  const [publishing, setPublishing] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    refresh()
  }, [])

  function refresh() {
    axios.get('projects').then(res => {
      const b = {}
      res.data.forEach(p => b[p.name] = p.selectedBranch)

      const appsRunning = res.data.filter(p => p.running).map(p => p.name)
      if (appsRunning.length)
        dispatch(setRunning(appsRunning))

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
    setLog('')
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

  function showLog(text) {
    setLog(text)
    const area = document.getElementById('text-log-publish')
    if (area)
      area.scrollTo(0, area.scrollTopMax)
  }

  function getStatus(app) {
    if (publishing === app.name)
      return StatusApp.PROCESSING
    else if (!app.errorInPublish && app.published)
      return StatusApp.OK
    else
      return StatusApp.ERROR
  }

  return (
    <div className="App">
      <div className="app-container">
        <h2 className="title">CI/CD em Node.js para aplicações .Net Core </h2>
        <h4>Published</h4>

        <div style={{ marginBottom: '40px' }}>
          <PublishedApps projects={projects.filter(p => p.published)} />
        </div>
        <h3>Projects</h3>
        <table hidden={!projects.length} className="projects-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Path</th>
              <th>Status</th>
              <th>Branches</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.name}>
                <td>{p.name}</td>
                <td className="path-cell">{p.path + p.fileName}</td>
                <td><StatusComponent status={getStatus(p)} project={p} /></td>
                <td>
                  <select onChange={val => changeBranch(p.name, val.target.value)}>
                    {p.branches.map(x => <option key={x}>{x}</option>)}
                  </select>
                </td>
                <td>
                  <button className="btn btn-success btn-sm" onClick={() => updateBranches(p.name)}>Atualizar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(p.name)}>Remover</button>
                  <br />
                  <button className="btn btn-light btn-sm" hidden={!p.published} onClick={() => showLog(p.logPublish)}>Log</button>
                  <button className="btn btn-light btn-sm" onClick={() => publish(p.name)}>Publicar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn-add-projeto btn btn-light btn-sm" onClick={() => setEdition(true)}>Add</button>
        <div className="divForm" hidden={!edition}>
          <div className="form-group">
            <span className="label-form">Nome:</span><input value={projectName} onChange={val => setProjectName(val.target.value)} />
          </div>
          <div className="form-group">
            <span className="label-form">Arquivo .csproj:</span><input value={projectPath} onChange={val => setProjectPath(val.target.value)} />
            <small id="emailHelp" className="form-text text-muted">Caminho do arquivo .csproj do projeto.</small>
          </div>
          <button className="btn btn-light" onClick={() => clearForm()}>Cancel</button>
          <button className="btn btn-success" onClick={() => save()}>Save</button>
        </div>
        <span className="error-message">{error}</span>
        <div hidden={!log || !projects.length}>
          <button className="btn btn-light" onClick={() => setLog('')}>Hide Log</button>
          <textarea value={log} id="text-log-publish" className="text-log" disabled={true}>
          </textarea>
        </div>
      </div>
    </div>
  );
}

export default App