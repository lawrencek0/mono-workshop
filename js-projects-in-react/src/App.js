import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import './App.css';
import NavBar from './components/NavBar';
import Portfolio from './components/Portfolio';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <NavBar/>

          <Switch>
            <Route exact path='/' render={Portfolio}/>
            <Route render={() => <h4>Not Found</h4>}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
