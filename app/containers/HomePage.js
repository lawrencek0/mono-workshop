// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import Home from '../components/Home';
import database from '../database';
import scraper from '../lib/Scraper';
import { GENERA } from '../constants';
import { formatPhageDbPhages, formatPetPhages } from '../utils/PhageFormatter';
import getPetCreds from '../utils/Misc';

class HomePage extends Component {
  componentDidMount() {
    ipcRenderer.on('ready', () => {});
  }

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

  // // eslint-disable-next-line class-methods-use-this
  // async scrapePhageFromPet(genus) {
  //   let phages;
  //   try {
  //     await scraper.openGenus(genus);
  //     phages = await scraper.scrapePhagesFromPet();
  //     return formatPetPhages(phages);
  //   } catch (e) {
  //     console.error(e);
  //   }
  //   return phages;
  // }
  // // eslint-disable

  updatePetDbPhages = async genus => {
    try {
      await scraper.openGenus(genus);
      const phages = await scraper.scrapePhagesFromPet(genus);
      // await Promise.all(phages.map(async phage => {
      //   // this.savePhageToDb(`${phage.genus}PetPhages`, phage);
      //   const phageName = await database(`${phage.genus}PetPhages`)
      //     .where({ phage_name: phage.phage_name })
      //     .select('phage_name');
      //   console.log(phageName);
      //   console.log(phage);
      //   if (phageName.length === 0) {
      //     database(`${phage.genus}PetPhages`)
      //       .insert(phage)
      //       .then(console.log)
      //       .catch(console.error);
      //   } else {
      //     console.log(`WHAT THE FUCK HOW ${phageName}`);
      //   }
      // }));
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

  // eslint-disable-next-line class-methods-use-this
  async savePhageToDb(tableName, phage) {}
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
