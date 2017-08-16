const { dialog } = require('electron').remote
const app = require('electron').remote.app
const storage = require('electron-json-storage')
let projects = []
 
storage.getAll((error, data) => {
  if (error) throw error

  if(data.projects !== undefined){
    document.getElementById('empty').style.display = 'none';
    document.getElementById('projects').style.display = 'block';
    projects = data.projects
    projects.forEach(elem => {
      let dir = document.createElement("P")
      let dirText = document.createTextNode(elem.dir)
      dir.appendChild(dirText)
      document.getElementById('projects').appendChild(dir) 
    })
  }
})

let buttonAdd = document.getElementById("addProjects")
let buttonDel = document.getElementById("deleteProjects")

buttonAdd.addEventListener("click", (e) => {
  const path = dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  let dir = document.createElement("P")
  let dirText = document.createTextNode(path)
  dir.appendChild(dirText)
  document.getElementById('projects').appendChild(dir)
  projects.push({dir: path})
  console.log(projects);
  document.getElementById('projects').style.display = 'block'
  storage.set('projects', projects , (error) => {
    if (error) throw error;
  })
});

buttonDel.addEventListener("click", (e) => {
   
  while(document.getElementById('projects').hasChildNodes()) {
    document.getElementById('projects').removeChild(document.getElementById('projects').lastChild)
  }
  storage.remove('projects', function(error) {
    if (error) throw error;
  });

});