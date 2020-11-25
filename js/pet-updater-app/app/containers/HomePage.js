// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import type { RouterHistory } from 'react-router-dom';
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
import { PetScraper, BacillusScraper } from '../lib/Scraper';
import {
  getPetCreds,
  compareAllTables,
  updateAllPhagesDbPhages,
  updateAllPetPhages,
  comparePhages
} from '../utils/Misc';
import { PHAGES_DB_BASE_URL } from '../constants';

type Props = {
  history: RouterHistory
};
class HomePage extends Component<Props> {
  state = { phagesDbPhages: [], petPhages: [], loading: true };

  async componentDidMount() {
    const { history } = this.props;
    document.body.classList.add('center-container');
    const a = await comparePhages();
    await console.log(a);
    const [creds] = await getPetCreds();

    if (!creds) {
      history.push('/login');
    } else {
      this.fetchAllNewPhages();
    }
  }

  petScraper = new PetScraper();

  bacillusScraper = new BacillusScraper();

  updateAllPhages = async () => {
    this.setState({
      loading: true
    });

    await this.loginToPet();
    await Promise.all([
      updateAllPetPhages(this.petScraper),
      updateAllPhagesDbPhages()
    ]);

    await this.fetchAllNewPhages();
    await this.petScraper.closeScraper();
  };

  fetchAllNewPhages = async () => {
    const { phagesDbPhages, petPhages } = await compareAllTables();

    if (phagesDbPhages.length !== 0 || petPhages.length !== 0) {
      document.body.classList.remove('center-container');
    } else {
      document.body.classList.add('center-container');
    }

    this.setState({
      phagesDbPhages,
      petPhages,
      loading: false
    });
  };

  insertAllPhages = async () => {
    this.setState({
      loading: true
    });

    const { phagesDbPhages } = this.state;

    await this.loginToPet();
    await this.petScraper.insertPhages(phagesDbPhages);
    await this.fetchAllNewPhages();
  };

  async loginToPet() {
    const { history } = this.props;
    const [creds] = await getPetCreds();

    if (!creds) {
      history.push('/login');
    } else {
      const { account, password } = creds;

      const isLoggedIn = await this.petScraper.login(account, password);

      if (!isLoggedIn) {
        await this.petScraper.closeScraper();

        history.push('/login');
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
        pane: (
          <Tab.Pane attached={false} key="phagesDB">
            <PhageList
              heading="PhagesDB"
              phages={phagesDbPhages}
              viewPhage={this.viewPhage}
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: 'PET',
        pane: (
          <Tab.Pane attached={false} key="petPhages">
            <PhageList
              heading="PET"
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
          <Loader content="This might take a while." />
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
      <Container fluid style={{ marginTop: '3rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '2rem'
          }}
        >
          <UpdateButton updateAllPhages={this.updateAllPhages} />
          <Button
            basic
            color="green"
            size="big"
            onClick={this.insertAllPhages}
            disabled={phagesDbPhages.length === 0}
          >
            Update PET
          </Button>
        </div>
        <Tab
          renderActiveOnly={false}
          menu={{
            fluid: true,
            secondary: true,
            pointing: true,
            vertical: true
          }}
          panes={panes}
        />
      </Container>
    );
  }
}

export default withRouter(HomePage);

type UpdateButtonProps = {
  updateAllPhages: () => void
};

const UpdateButton = ({ updateAllPhages }: UpdateButtonProps) => (
  <Button basic color="green" size="big" onClick={updateAllPhages}>
    Check for Updates
  </Button>
);
