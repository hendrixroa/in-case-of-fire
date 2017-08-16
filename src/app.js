import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class Main extends Component {
  constructor(props){
    super();

    this.state = {
    };
  }

  render(){
    return (
      <div>
        <div id="empty">
          <p>Empty Projects :(</p>
        </div>
          <button type="button" id="addProjects">Add One</button>
          <button type="button" id="deleteProjects">delete projects</button>
          <div id="projects">
        </div>
      </div>
    );
  }
 
}

var main = document.getElementById('main');
ReactDOM.render(<Main />, main);
