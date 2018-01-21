// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { remote, ipcRenderer } from 'electron';
import Home from '../components/Home';
import database from '../database';
import scraper from '../lib/Scraper';
import { GENERA } from '../constants';
import { formatPhageDbPhages } from '../utils/PhageFormatter';

const keytar = remote.require('keytar');

class HomePage extends Component {
  componentDidMount() {
    ipcRenderer.on('ready', () => {
      this.fetchAllPhages();
    });
    this.getPetCreds();
  }

  async getPetCreds() {
    try {
      const [creds] = await keytar.findCredentials('PetUpdater');
      if (!creds) {
        this.props.history.push('/login');
      } else {
        const { account, password } = creds;
        await scraper.loginToPet(account, password);
      }
    } catch (e) {
      console.error(e);
    }
  }

  fetchPhage = async (genus = 'Rhodococcus') => {
    try {
      const phages = await database(`${genus}PhagesDb`).select();
      return phages;
    } catch (e) {
      console.error(e);
    }
  };

  fetchAllPhages = async () => {
    try {
      const phages = await Promise.all(GENERA.map(({ name }) => this.fetchPhage(name)));
      console.log(await phages);
    } catch (e) {
      console.error(e);
    }
  };

  updateAllPhages = async () => {
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
