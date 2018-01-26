// @flow
import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { shell } from 'electron';
import {
  Container,
  Tab,
  Icon,
  Header,
  Segment,
  Loader,
  Dimmer
} from 'semantic-ui-react';
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
  state = { phagesDbPhages: [], petPhages: [], loading: true };

  async componentDidMount() {
    const [creds] = await getPetCreds();
    if (!creds) {
      this.props.history.push('/login');
    } else {
      await this.updateAllPhages();
    }
  }

  updateAllPhages = async () => {
    const { phagesDbPhages, petPhages } = await compareAllTables();
    this.setState({
      phagesDbPhages,
      petPhages,
      loading: false
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
    const { phagesDbPhages, petPhages, loading } = this.state;
    const panes = [
      {
        menuItem: 'Phages DB',
        render: () => (
          <Tab.Pane attached={false}>
            <PhageList
              heading="New Phages in Phages DB"
              phages={phagesDbPhages}
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
              phages={petPhages}
              viewPhage={this.viewPhage}
            />
          </Tab.Pane>
        )
      }
    ];

    if (loading) {
      return (
        <Segment>
          <Dimmer active>
            <Loader content="Updating Phages..." />
          </Dimmer>
        </Segment>
      );
    }
    if (phagesDbPhages.length === 0 && petPhages.length === 0) {
      return (
        <Fragment>
          <Header as="h2" icon textAlign="center">
            <Icon name="lab" size="massive" circular inverted />
            <Header.Content>No New Phages Found!</Header.Content>
          </Header>
        </Fragment>
      );
    }
    return (
      <Container>
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </Container>
    );
  }
}

export default withRouter(HomePage);
