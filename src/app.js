import React, {Component} from 'react'
import ReactDOM from 'react-dom'
const { dialog } = window.require('electron').remote
const app = window.require('electron').remote.app
const storage = window.require('electron-json-storage')
const _ = require('lodash')
const Git = window.require('simple-git')

class Main extends Component {
  constructor(props){
    super()

    this.state = {
      projects: [],
      changes: []
    }

    storage.getAll((error, data) => {
      if (error) throw error
  
      if(!_.isEmpty(data.projects)){
        console.log('cargando proyectos', data.projects)
        this.setState({
          projects: data.projects
        })

        data.projects.forEach((project, index) => {
          this.checkDir(project.dir)
        })
      }
    })
  }

  checkDir(path) {
    Git(path).status((err,res) => { 
      if(!err){
        let buffer = this.state.changes
        buffer.push(res.files.length)
        this.setState({
          changes: buffer
        })
      }
    })
  }

  addProjects() {
    const path = dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    Git(path[0]).status((err,res) => { 
      if(!err){
        let bufferProyects = this.state.projects
        let bufferChanges = this.state.changes
        bufferProyects.push({dir: path[0]})
        bufferChanges.push(res.files.length)
        this.setState({
          projects: bufferProyects,
          changes: bufferChanges
        })
        storage.set('projects', this.state.projects , (error) => {
          if (error) throw error
        })
      }else{
        let notificationError = new Notification('Error', {
          body: 'This folder is not a repository Git, please execute `git init`'
        })
      }
    })
  }

  deleteProjects() {
    storage.remove('projects', function(error) {
      if (error) throw error;
    })
    this.setState({
      projects: []
    })
  }

  render(){
    return (
      <div> 
        { this.state.projects.length === 0 ? 
          (<div>
            <p>Empty Projects :(</p>
          </div>) : ''
        }
          <button type="button" onClick={this.addProjects.bind(this)}>Add One</button>
          <button type="button" onClick={this.deleteProjects.bind(this)}>delete projects</button>
          <div>
            {
              this.state.projects.map((project, index) => {
                return (<div className="box-projects" key={ index }> {project.dir} <span className="number-changes">{ this.state.changes[index] !== null ? this.state.changes[index] : 'X'}</span></div>)
              }) 
            }
          </div>
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('main'))