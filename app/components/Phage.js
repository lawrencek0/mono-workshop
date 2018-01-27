import React from 'react';
import { Table, Header } from 'semantic-ui-react';

const Phage = ({ phage, viewPhage }) => {
  const openPhage = () => {
    viewPhage(phage.phageName);
  };

  return (
    <Table.Row>
      <Table.Cell>
        <Header as="h4">
          <Header.Content onClick={openPhage}>
            {phage.phageName}
            {phage.oldNames && (
              <Header.Subheader>Old Names: {phage.oldNames}</Header.Subheader>
            )}
          </Header.Content>
        </Header>
      </Table.Cell>
      <Table.Cell>{phage.cluster}</Table.Cell>
      <Table.Cell>{phage.subcluster}</Table.Cell>
    </Table.Row>
  );
};

export default Phage;
