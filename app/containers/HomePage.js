// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import database from '../database';
import { GENERA } from '../constants';
import Home from '../components/Home';
import { formatPhageDbPhages } from '../utils/PhageFormatter';

type Props = {};

class HomePage extends Component<Props> {
  props: Props;
  componentDidMount() {}

  updateAllPhages = async () => {
    try {
      const phages = [].concat(...(await Promise.all(GENERA.map(({ value }) => this.fetchPhagesFromPhagesDb(value)))));
      await Promise.all(phages.map(async phage => {
        const genus = phage.genus === 'Mycobacterium' ? 'Mycobacteriophage' : phage.genus;
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

export default HomePage;
