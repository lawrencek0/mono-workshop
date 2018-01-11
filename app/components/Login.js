// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';

class Login extends Component {
  state = {
    email: '',
    password: ''
  };

  componentDidMount() {}

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    ipcRenderer.send('login-user', { email: this.state.email, password: this.state.password });
  };

  render() {
    return (
      <div>
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
      </div>
    );
  }
}

export default Login;
