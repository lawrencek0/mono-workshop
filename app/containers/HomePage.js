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
  Dimmer,
  Button
} from 'semantic-ui-react';
import PhageList from '../components/PhageList';
import scraper from '../lib/Scraper';
import {
  getPetCreds,
  compareAllTables,
  updateAllPhagesDbPhages,
  updateAllPetDbPhages,
  updatePetDbPhages
} from '../utils/Misc';
import { PHAGES_DB_BASE_URL } from '../constants';

class HomePage extends Component {
  state = { phagesDbPhages: [], petPhages: [], loading: false };

  async componentDidMount() {
    const [creds] = await getPetCreds();
    document.body.classList.add('center-container');
    if (!creds) {
      this.props.history.push('/login');
    }
  }

  updateAllPhages = async () => {
    this.setState({
      loading: true
    });
    await this.loginToPet();
    await Promise.all([
      updateAllPetDbPhages(scraper),
      updateAllPhagesDbPhages()
    ]);

    const { phagesDbPhages, petPhages } = await compareAllTables();
    if (phagesDbPhages.length !== 0 || petPhages.length !== 0) {
      document.body.classList.remove('center-container');
    }

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
        <Dimmer active inverted>
          <Loader content="Updating Phages..." />
        </Dimmer>
      );
    }
    if (phagesDbPhages.length === 0 && petPhages.length === 0) {
      return (
        <Segment
          size="big"
          color="green"
          textAlign="center"
          className="segment--big"
        >
          <Header as="h2" icon textAlign="center">
            <Icon name="lab" size="massive" circular inverted />
            <Header.Content>No New Phages Found!</Header.Content>
          </Header>
          <UpdateButton updateAllPhages={this.updateAllPhages} />
        </Segment>
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

const UpdateButton = ({ updateAllPhages }) => (
  <Button basic color="green" size="big" onClick={updateAllPhages}>
    Check for Updates
  </Button>
);
