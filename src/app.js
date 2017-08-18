import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Tutorial from './components/tutorial'
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
      modeAutomatic: false
    }

    storage.getAll((error, data) => {
      if (error) throw error
      
      console.log('DATA', data)
      if(!_.isEmpty(data.projects)){
        console.log('cargando proyectos', data.projects)
        this.setState({
          projects: data.projects.sort(this.sortProjects)
        })
      }
      if(data.mode){
        console.log('entre en data mode', data.mode)
        this.setState({
          modeAutomatic: data.mode
        })
      }
      this.checkUpdate()
    })
  }

  checkUpdate(){
    setInterval(() => {
      console.log('my projects', this.state.projects)
      let projectsBackup = []
      if(this.state.projects.length > 0){
        this.state.projects.forEach((project,index) => {
          Git(project.dir).status((err,res) =>{
            projectsBackup.push({ dir: project.dir, changes: res.files.length })
            storage.set('projects', projectsBackup , (error) => {
              if (error) throw error
              this.setState({
                projects: projectsBackup.sort(this.sortProjects)
              })
              const projectsFiltered = projectsBackup.filter(this.filterProjects)
              if(projectsFiltered.length > 0){
                let notificationProjects = new Notification('Warning', {
                  body: 'You have ' + projectsBackup.length + ' not sync, please commit and push changes :)'
                })
                Git(projectsFiltered[0].dir)
                  .add('./*')
                  .commit("first commit!")
                  .addRemote('origin', 'some-repo-url')
                  .push( function () {
                      // done. 
                  })
              }
            })
          })
        })        
      }          
    },5000)
  }

  filterProjects(project) {
    return project.changes > 0
  }

  sortProjects(pro1,pro2) {
    return pro2.changes - pro1.changes
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
        storage.set('projects', bufferProyects , (error) => {
          if (error) throw error
        })
      }else{
        let notificationError = new Notification('Error', {
          body: 'This folder is not a repository Git, please execute `git init`'
        })
      }
    })
  }

  changeMode(){
    storage.set('mode', !this.state.modeAutomatic, (err) => {
      if (err) throw err
    })
    this.setState({
      modeAutomatic: !this.state.modeAutomatic
    })
  }

  deleteProjects() {
    storage.remove('projects', function(error) {
      if (error) throw error;
    })
    storage.remove('mode', function(error) {
      if (error) throw error;
    })
    this.setState({
      projects: [],
      modeAutomatic: false
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
          <button type="button" onClick={this.deleteProjects.bind(this)}>delete projects</button><br/>
          <input type="checkbox" onChange={this.changeMode.bind(this)} checked={this.state.modeAutomatic}/><span>Mode Automatic</span>
          <div>
            {
              this.state.projects.map((project, index) => {
                return (<div className="box-projects" key={ index }> {project.dir} <span className="number-changes">{project.changes}</span></div>)
              }) 
            }
          </div>
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('main'))