import React, { Fragment } from 'react';
import { Header, Table, Tab } from 'semantic-ui-react';
import Phage from './Phage';
import { GENERA } from '../constants';

const PhageList = ({ heading, phages, viewPhage }) => {
  const panes = () =>
    GENERA.map(({ name }) => {
      const genusPhages = phages.filter(phage => phage.genus === name);
      if (genusPhages.length !== 0) {
        return {
          menuItem: name,
          pane: (
            <Tab.Pane attached={false} key={heading + name}>
              <Table basic="very" celled unstackable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width={5}>Phage</Table.HeaderCell>
                    <Table.HeaderCell>Cluster</Table.HeaderCell>
                    <Table.HeaderCell>Subcluster</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {genusPhages.map(phage => (
                    <Phage
                      key={phage.phageName}
                      phage={phage}
                      viewPhage={viewPhage}
                    />
                  ))}
                </Table.Body>
              </Table>
            </Tab.Pane>
          )
        };
      }
    }).filter(genus => Boolean(genus));
  return (
    <Fragment>
      <Header as="h2" textAlign="center">
        New phages in {heading} ({phages.length})
      </Header>
      <Tab
        renderActiveOnly={false}
        menu={{ secondary: true, pointing: true }}
        panes={panes()}
      />
    </Fragment>
  );
};

export default PhageList;
