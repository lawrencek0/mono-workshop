import * as React from 'react';
import Header from './components/Header';
import SideBar from './components/SideBar';
import MovieList from './components/MovieList';

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <div>
          <SideBar />
          <MovieList />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
