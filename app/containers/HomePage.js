// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import Home from '../components/Home';
import database from '../database';
import scraper from '../lib/Scraper';
import { GENERA } from '../constants';
import {
  savePhageToDb,
  getPetCreds,
  getPhagesFromPhagesDbApi
} from '../utils/Misc';

class HomePage extends Component {
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

  updatePetDbPhages = async genus => {
    try {
      await scraper.openGenus(genus);
      const phages = await scraper.scrapePhagesFromPet(genus);
      await Promise.all(phages.map(phage => savePhageToDb(`${phage.genus}PetPhages`, phage)));
    } catch (e) {
      console.error(e);
    }
  };

  updatePhagesDbPhages = async genus => {
    try {
      const { value } = GENERA.find(({ name }) => name === genus);
      const phages = await getPhagesFromPhagesDbApi(value);
      await Promise.all(phages.map(phage => savePhageToDb(`${genus}PhagesDb`, phage)));
    } catch (e) {
      console.error(e);
    }
  };

  updateAllPetDbPhages = async () => {
    try {
      for (const genus of GENERA) {
        await this.updatePetDbPhages(genus.name);
      }
    } catch (e) {
      console.error(e);
    }
  };

  updateAllPhagesDbPhages = async () => {
    try {
      await Promise.all(GENERA.map(({ name }) => this.updatePhagesDbPhages(name)));
    } catch (e) {
      console.error(e);
    }
  };

  fetchPhagesDbPhages = async genus => database(`${genus}PhagesDb`).select();

  fetchAllPhagesDbPhages = async () => {
    try {
      return Promise.all(GENERA.map(({ name }) => this.fetchPhagesDbPhages(name)));
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    return <Home />;
  }
}

export default withRouter(HomePage);
