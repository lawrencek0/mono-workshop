// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';

class Login extends Component {
  state = {
    email: '',
    password: ''
  };

  componentDidMount() {
    ipcRenderer.on('logged-in-user', (event, arg) => {
      console.log(arg);
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    ipcRenderer.send('login-user', this.state.email);
  };

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <input
            placeholder="Email"
            type="email"
            value={this.state.email}
            onChange={this.handleChange('email')}
          />
          <input
            placeholder="Password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange('password')}
          />
          <button type="submit">Submit</button>
        </form>
      </React.Fragment>
    );
  }
}

export default Login;
