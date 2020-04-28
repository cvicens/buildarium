import React from 'react';

import Unity, { UnityContent } from "react-unity-webgl";

import logo from './logo.svg';
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // Next up create a new Unity Content object to 
    // initialise and define your WebGL build. The 
    // paths are relative from your index file.

    this.unityContent = new UnityContent(
      "unity_project_build/Build.wasm.json",
      "unity_project_build/UnityLoader.js"
    );
  }

  render() {

    // Finally render the Unity component and pass 
    // the Unity content through the props.

    return <Unity unityContent={this.unityContent} />;
  }

  render2() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

function AppOld() {
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

//export default App;
