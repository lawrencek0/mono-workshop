// @flow
import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import Home from '../components/Home';
import PhageList from '../components/PhageList';
import scraper from '../lib/Scraper';
import {
  getPetCreds,
  compareAllTables,
  updateAllPhagesDbPhages,
  updateAllPetDbPhages
} from '../utils/Misc';

class HomePage extends Component {
  state = { phagesDbPhages: [], petPhages: [] };

  async componentDidMount() {
    // const [creds] = await getPetCreds();
    // if (!creds) {
    //   this.props.history.push('/login');
    // } else {
    //   await this.loginToPet();
    //   await
    // }
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
    return (
      <Fragment>
        <PhageList
          heading="New Phages in PhagesDB"
          phages={this.state.phagesDbPhages}
        />
        <PhageList heading="New Phages in PET" phages={this.state.petPhages} />
      </Fragment>
    );
  }
}

export default withRouter(HomePage);
