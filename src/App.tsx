import * as React from 'react';
import Header from './components/Header';
import SideBar from './components/SideBar';
import MovieList from './components/MovieList';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div>
          <SideBar />
          <MovieList />
        </div>
      </div>
    );
  }
}

export default App;
