// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { withRouter } from 'react-router';
import scraper from '../lib/Scraper';
import { savePetCreds } from '../utils/Misc';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: false
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { email, password } = this.state;
    const canLogIn = await scraper.loginToPet(email, password);
    if (!canLogIn) {
      this.setState({ errors: true });
    } else {
      await savePetCreds(email, password);
      this.props.history.push('/');
    }
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
