import React from 'react';
import Device from './components/Device';

const App = () => (
  <div>
    <Device />
    <div className="badge">Powered by <a href="https://darksky.net/">Dark Sky API</a></div>
  </div>
);

export default App;