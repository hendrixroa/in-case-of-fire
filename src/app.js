import React, {Component} from 'react'
import ReactDOM from 'react-dom'
const { dialog } = window.require('electron').remote
const app = window.require('electron').remote.app
const storage = window.require('electron-json-storage')
const _ = require('lodash')
const Git = window.require('simple-git')
let num=0

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
    Git(path[0]).status((err,res) => { 
      if(!err){
        let bufferProyects = this.state.projects
        bufferProyects.push({dir: path[0], changes: res.files.length})
        this.setState({
          projects: bufferProyects,
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
      projects: [],
      changes: []
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
                num++
                console.log(num)
                return (<div className="box-projects" key={ index }> {project.dir} <span className="number-changes">{project.changes}</span></div>)
              }) 
            }
          </div>
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('main'))