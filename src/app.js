import React, {Component} from 'react'
import ReactDOM from 'react-dom'
const { dialog } = window.require('electron').remote
const app = window.require('electron').remote.app
const storage = window.require('electron-json-storage')
const _ = require('lodash')

class Main extends Component {
  constructor(props){
    super()

    this.state = {
      projects: []
    }

    storage.getAll((error, data) => {
      if (error) throw error
  
      if(!_.isEmpty(data.projects)){
        console.log('cargando proyectos', data.projects)
        this.setState({
          projects: data.projects
        })
      }
    })
  }

  addProjects() {
    const path = dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    console.log('antes de agregar', this.state.projects)
    let buffer = this.state.projects
    buffer.push({dir: path})
    this.setState({
      projects: buffer
    })
    storage.set('projects', this.state.projects , (error) => {
      if (error) throw error
    })
    console.log('Se agregaron estos proyectos', this.state.projects)
  }

  deleteProjects() {
    storage.remove('projects', function(error) {
      if (error) throw error;
    })
    this.setState({
      projects: []
    })
  }

  listProjects() {
    if(this.state.projects.length > 0){
      return this.state.projects.map((project) => {
        (<p> project.dir </p>)
      })
    }
    return null;
  }

  render(){
    return (
      <div>
        <div id="empty">
          <p>Empty Projects :(</p>
        </div>
          <button type="button" onClick={this.addProjects.bind(this)} id="addProjects">Add One</button>
          <button type="button" id="deleteProjects">delete projects</button>
          <div id="projects">
            {this.listProjects() ? this.listProjects() : '' }
          </div>
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('main'))