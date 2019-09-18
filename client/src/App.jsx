import React, { useState, useEffect } from 'react';
import axios from 'axios'
import './App.css';

function App() {

  const [projects, setProjects] = useState([])
  const [project, setProject] = useState()
  const [branches, setBranches] = useState({})
  const [log, setLog] = useState('')

  useEffect(() => {
    refresh()
    setInterval(() => {
      axios.get('publish')
        .then(res => setLog(res.data.log))
        .catch(err => console.log(err))
    }, 2000)
  }, [])

  function refresh() {
    axios.get('projects').then(res => {
      const b = {}
      res.data.forEach(p => b[p.name] = p.branches[0])
      setBranches(b)
      setProjects(res.data)
    })
    setProject(null)
  }

  function changeBranch(name, branch) {
    branches[name] = branch
    setBranches(branches)
  }

  function save() {
    axios.post('project', project)
      .then(res => {
        if (res.data && res.data.error)
          console.log(res.data)
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

  function cancel() {
    setProject(null)
  }

  function setValue(prop, val) {
    if (project) {
      project[prop] = val
    }
    setProject(project)
  }

  return (
    <div className="App">
      <header className="App-header">
        <table className="projects-table">
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
                <td className="path-cell">{p.path}</td>
                <td>
                  <select onChange={val => changeBranch(p.name, val.target.value)}>
                    {p.branches.map(x => <option key={x}>{x}</option>)}
                  </select>
                </td>
                <td>
                  <button className="btn" onClick={() => updateBranches(p.name)}>Atualizar</button>
                  <button className="btn" onClick={() => remove(p.name)}>Remover</button>
                  <button className="btn" onClick={() => publish(p.name)}>Publicar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn" onClick={() => setProject({})}>Novo</button>
        <button className="btn" onClick={() => refresh({})}>Atualizar</button>
        <div className="divForm" hidden={!project}>
          <span>Nome:</span><input onChange={val => setValue('name', val.target.value)} />
          <br />
          <span>Path:</span><input onChange={val => setValue('path', val.target.value)} />
          <br />
          <button className="btn" onClick={() => cancel()}>Cancelar</button>
          <button className="btn" onClick={() => save()}>Salvar</button>
        </div>
        <textarea hidden={!log} value={log} className="text-log" disabled={true}>
        </textarea>
      </header>
    </div>
  );
}

export default App