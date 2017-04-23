import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Home  from './components/Home';
import PostsNew from './components/Posts/New';

class App extends Component {
  render() {
    return (
      <div className="container">
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path="/posts/new" component={PostsNew}/>
        </Switch>
      </div>
    );
  }
}

export default App;
