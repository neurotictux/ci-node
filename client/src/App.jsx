import React, { useState, useEffect } from 'react';
import axios from 'axios'
import openSocket from 'socket.io-client'
import 'bootstrap/dist/css/bootstrap.min.css'

import './App.css';

const LogType = {
  AppStart: 'APP_RUN_START',
  AppData: 'APP_RUN_DATA',
  AppEnd: 'APP_RUN_END',
  PublishStart: 'APP_PUBLISH_START',
  PublishData: 'APP_PUBLISH_DATA',
  PublishEnd: 'APP_PUBLISH_END',
}

const socket = openSocket('http://localhost:8000')

function App() {

  const [projects, setProjects] = useState([])
  const [projectName, setProjectName] = useState('')
  const [projectPath, setProjectPath] = useState('')
  const [edition, setEdition] = useState(false)
  const [branches, setBranches] = useState({})
  const [log, setLog] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    refresh()

    socket.on(LogType.PublishStart, () => setLog(''))
    socket.on(LogType.PublishData, data => showLog(data.data))
    socket.on(LogType.PublishEnd, () => console.log('publish end'))

  }, [])

  function refresh() {
    axios.get('projects').then(res => {
      const b = {}
      res.data.forEach(p => b[p.name] = p.selectedBranch)
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

  function run(name) {
    axios.post(`run/${name}`)
      .then(res => console.log(res.data))
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

  function showLog(text) {
    setLog(text)
    const area = document.getElementById('text-log')
    if (area)
      area.scrollTo(0, area.scrollTopMax)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>CI/CD em Node.js para aplicações .Net Core </h2>
        <table hidden={!projects.length} className="projects-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Path</th>
              <th>Branches</th>
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
                <td>
                  <button className="btn btn-success btn-sm" onClick={() => updateBranches(p.name)}>Atualizar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(p.name)}>Remover</button>
                  <button className="btn btn-info btn-sm" onClick={() => publish(p.name)}>Publicar</button>
                  <button hidden={!p.published} className="btn btn-info btn-sm" onClick={() => run(p.name)}>{p.running ? 'Parar' : 'Rodar'}</button>
                  <button hidden={!p.published} className="btn btn-light btn-sm" onClick={() => showLog(p.logPublish)}>Log</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn-add-projeto btn btn-light btn-sm" onClick={() => setEdition(true)}>Adicionar Projeto</button>
        <div className="divForm" hidden={!edition}>
          <div className="form-group">
            <span className="label-form">Nome:</span><input value={projectName} onChange={val => setProjectName(val.target.value)} />
          </div>
          <div className="form-group">
            <span className="label-form">Arquivo .csproj:</span><input value={projectPath} onChange={val => setProjectPath(val.target.value)} />
            <small id="emailHelp" className="form-text text-muted">Caminho do arquivo .csproj do projeto.</small>
          </div>
          <button className="btn btn-light" onClick={() => clearForm()}>Cancelar</button>
          <button className="btn btn-success" onClick={() => save()}>Salvar</button>
        </div>
        <span className="error-message">{error}</span>
        <textarea hidden={!log || !projects.length} value={log} id="text-log" disabled={true}>
        </textarea>
      </header>
    </div>
  );
}

export default App