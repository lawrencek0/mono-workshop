// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { withRouter } from 'react-router';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: false
  };

  componentDidMount() {
    // TODO: handle login-user-reply
    ipcRenderer.on('login-user-reply', (event, isLoggedIn) => {
      if (isLoggedIn) {
        this.props.history.push('/');
      } else {
        this.setState({ errors: true });
      }
    });
  }

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
        {this.state.errors && <span style={{ color: 'red' }}>DANGER</span>}
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

export default withRouter(Login);
