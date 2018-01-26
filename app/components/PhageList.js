import React, { Fragment } from 'react';
import { Header, Table } from 'semantic-ui-react';
import Phage from './Phage';

const PhageList = ({ heading, phages }) => (
  <Fragment>
    <Header as="h2" textAlign="center">
      {heading} ({phages.length})
    </Header>
    <Table basic="very" celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Phage</Table.HeaderCell>
          <Table.HeaderCell>Genus</Table.HeaderCell>
          <Table.HeaderCell>Cluster</Table.HeaderCell>
          <Table.HeaderCell>Subcluster</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {phages.map(phage => <Phage phage={phage} key={phage.phageName} />)}
      </Table.Body>
    </Table>
  </Fragment>
);

export default PhageList;
