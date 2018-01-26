// @flow
import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { shell } from 'electron';
import { Container, Tab } from 'semantic-ui-react';
import Home from '../components/Home';
import PhageList from '../components/PhageList';
import scraper from '../lib/Scraper';
import {
  getPetCreds,
  compareAllTables,
  updateAllPhagesDbPhages,
  updateAllPetDbPhages
} from '../utils/Misc';
import { PHAGES_DB_BASE_URL } from '../constants';

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

  viewPhage = phageName => {
    shell.openExternal(`${PHAGES_DB_BASE_URL}/phages/${phageName}`);
  };

  render() {
    const panes = [
      {
        menuItem: 'Phages DB',
        render: () => (
          <Tab.Pane attached={false}>
            <PhageList
              heading="New Phages in Phages DB"
              phages={this.state.phagesDbPhages}
              viewPhage={this.viewPhage}
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: 'PET',
        render: () => (
          <Tab.Pane attached={false}>
            <PhageList
              heading="New Phages in PET"
              phages={this.state.petPhages}
              viewPhage={this.viewPhage}
            />
          </Tab.Pane>
        )
      }
    ];
    return (
      <Container>
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </Container>
    );
  }
}

export default withRouter(HomePage);
