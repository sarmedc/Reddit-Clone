import React, { Component } from 'react';
import './App.css';
var Page = require('./Page');

class App extends Component {
  render() {
    return (
      <div className="container">
        <h1 className="header">Reddit Clone</h1>
        <Page />
      </div>
    );
  }
}

export default App;
