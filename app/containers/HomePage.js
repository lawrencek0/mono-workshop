// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { remote, ipcRenderer } from 'electron';
import Home from '../components/Home';
import database from '../database';
import scraper from '../lib/Scraper';
import { GENERA } from '../constants';
import { formatPhageDbPhages, formatPetPhages } from '../utils/PhageFormatter';

const keytar = remote.require('keytar');

class HomePage extends Component {
  componentDidMount() {
    ipcRenderer.on('ready', () => {});
  }

  // eslint-disable-next-line class-methods-use-this
  async getPetCreds() {
    return keytar.findCredentials('PetUpdater');
  }
  // eslint-enable

  async scrapePhageFromPet(genus) {
    let phages;
    try {
      const [creds] = await this.getPetCreds();
      if (!creds) {
        this.props.history.push('/login');
      } else {
        const { account, password } = creds;
        const isLoggedIn = await scraper.loginToPet(account, password);
        if (!isLoggedIn) {
          this.props.history.push('/login');
        } else {
          await scraper.openGenus(genus);
          phages = await scraper.scrapePhagesFromPet();
          return formatPetPhages(phages);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return phages;
  }

  updatePetDbPhages = async genus => {
    try {
      const phages = await this.scrapePhageFromPet(genus);
      await Promise.all(phages.map(async phage =>
        this.savePhageToDb(`${phage.genus}PetPhages`, phage)));
    } catch (e) {
      console.error(e);
    }
  };

  // eslint-disable-next-line class-methods-use-this
  async savePhageToDb(tableName, phage) {
    const phageName = await database(tableName)
      .where({ phage_name: phage.phage_name })
      .select('phage_name');
    if (phageName.length === 0) {
      database(tableName)
        .insert(phage)
        .then(console.log)
        .catch(console.error);
    }
  }
  // eslint-enable

  // eslint-disable-next-line class-methods-use-this
  async fetchPhagesDbPhages(genus) {
    return database(`${genus}PhagesDb`).select();
  }
  // eslint-enable

  fetchAllPhagesDbPhages = async () => {
    try {
      return Promise.all(GENERA.map(({ name }) => this.fetchPhagesDbPhages(name)));
    } catch (e) {
      console.error(e);
    }
  };

  updateAllPhagesDbPhages = async () => {
    try {
      const phages = [].concat(...(await Promise.all(GENERA.map(({ value }) => this.fetchPhagesFromPhagesDb(value)))));
      await Promise.all(phages.map(async phage => {
        const genus =
            phage.genus === 'Mycobacterium' ? 'Mycobacteriophage' : phage.genus;
        const phageName = await database(`${genus}PhagesDb`)
          .where({
            phage_name: phage.phage_name
          })
          .select('phage_name');
        if (phageName.length === 0) {
          database(`${genus}PhagesDb`)
            .insert(phage)
            .catch(console.error);
        }
      }));
    } catch (e) {
      console.error(e);
    }
  };

  fetchPhagesFromPhagesDb = async (pk, pageNum = 1, phages = []) => {
    try {
      const res = await fetch(`http://phagesdb.org/api/host_genera/${pk}/phagelist/?page=${pageNum}`);
      const { next, results } = await res.json();
      const allPhages = phages.concat(...formatPhageDbPhages(results));
      if (next) {
        const num = pageNum + 1;
        return this.fetchPhagesFromPhagesDb(pk, num, allPhages);
      }
      return allPhages;
    } catch (e) {
      console.error(e);
    }
  };
  render() {
    return <Home />;
  }
}

export default withRouter(HomePage);
