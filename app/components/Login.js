// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Card, Message } from 'semantic-ui-react';
import scraper from '../lib/Scraper';
import { savePetCreds } from '../utils/Misc';

class Login extends Component {
  state = {
    email: '',
    password: '',
    error: false,
    loading: false,
    success: false
  };

  componentDidMount() {
    document.body.style.setProperty('--background-primary-color', '#ffa500');
  }

  componentWillUnmount() {
    document.body.style.setProperty('--background-primary-color', '#f9f9f9');
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { email, password } = this.state;
    this.setState({ loading: true });
    const canLogIn = await scraper.loginToPet(email, password);
    if (!canLogIn) {
      this.setState({ error: true });
      document.body.style.setProperty('--background-primary-color', '#ff4444');
    } else {
      this.setState({ error: false, success: true });
      await savePetCreds(email, password);
      document.body.style.setProperty('--background-primary-color', '#00c851');
      setTimeout(() => {
        this.props.history.push('/');
      }, 800);
    }
    this.setState({ loading: false });
  };

  render() {
    const {
      email, password, success, error, loading
    } = this.state;
    return (
      <Card className="login-form">
        <Card.Content>
          {success && <Message success header="Successfully Logged In" />}
          {error && <Message error header="Invalid Email or Password" />}
          <Form
            size="huge"
            onSubmit={this.handleSubmit}
            success={success}
            error={error}
            loading={loading}
          >
            <Form.Input
              label="Email"
              placeholder="Email"
              type="email"
              value={email}
              onChange={this.handleChange('email')}
            />
            <Form.Input
              label="Password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={this.handleChange('password')}
            />
            <Form.Button basic color="grey" fluid>
              Login
            </Form.Button>
          </Form>
        </Card.Content>
      </Card>
    );
  }
}

export default withRouter(Login);
