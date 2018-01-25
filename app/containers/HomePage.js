// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Home from '../components/Home';
import scraper from '../lib/Scraper';
import { getPetCreds, compareAllTables } from '../utils/Misc';

class HomePage extends Component {
  state = { phagesDbPhages: [], petPhages: [] };

  componentDidMount() {
    this.updateAllPhages();
  }

  updateAllPhages = async () => {
    const { phagesDbPhages, petPhages } = await compareAllTables();
    this.setState({
      phagesDbPhages,
      petPhages
    });
  };
  async loginToPet() {
    const [creds] = await getPetCreds();
    if (!creds) {
      this.props.history.push('/login');
    } else {
      const { account, password } = creds;
      const isLoggedIn = await scraper.loginToPet(account, password);
      if (!isLoggedIn) {
        this.props.history.push('/login');
      }
    }
  }

  render() {
    return <Home />;
  }
}

export default withRouter(HomePage);
