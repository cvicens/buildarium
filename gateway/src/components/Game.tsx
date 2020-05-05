import React, { Component } from 'react';

import Unity, { UnityContent } from "react-unity-webgl";

import './Game.css';

type GameProps = {
  name: String
}

type GameState = {
  name: String
}

export default class Game extends Component<GameProps, GameState> {
  unityContent: UnityContent 

  constructor(props: GameProps) {
    super(props);

    // Next up create a new Unity Content object to 
    // initialise and define your WebGL build. The 
    // paths are relative from your index file.

    this.unityContent = new UnityContent( "unity_project_build/Build.wasm.json", "unity_project_build/UnityLoader.js");
  }

  render() {
    return <Unity height="100%"  unityContent={this.unityContent} />;
  }
}