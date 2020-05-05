import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Game from "./components/Game"

type AppState = {
  time: Date
}

export default class App extends Component<{}, AppState> {
  render() {
    return (
      <div className="App">
        
        <div className='row'>
          <div className='game-col'>
            <Game name="dummy" />
          </div>
          <div className='terminal-col'>
            <p />
          </div>
        </div>
      </div>
    );
  }

  render2() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
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

