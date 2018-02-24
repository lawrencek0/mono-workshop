import * as React from 'react';
import Header from './components/Header';
import SideBar from './components/SideBar';
import Movies from './components/Movies';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <SideBar />
        <Movies />
      </div>
    );
  }
}

export default App;
