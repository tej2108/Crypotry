import React, {Component} from 'react';
import './App.css'
import Welcome from './views/Welcome/Welcome';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {render} from "react-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Cryptory',
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img className="welcomeLogo" src="https://i.imgur.com/s5krUs0.png"/>
            <h2> Get ready to maintain your crypto transactions..</h2>
          <Welcome/>
        </header>
      </div>
    )
  }
}

render(
  <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
  <App/>
  </MuiThemeProvider>
  ,
  document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}
