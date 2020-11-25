import * as React from 'react';
import styled from '../theme';

const Wrapper = styled.header`
  background-color: ${props => props.theme.primaryColor};
  font-family: 'Amatic SC', cursive;
  text-align: center;
  font-size: 1.875rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`;

const Title = styled.h1`
  margin: 0;
`;

const Header: React.SFC = props => (
  <Wrapper>
    <Title>Sweeet Pumpkins (TX)</Title>
  </Wrapper>
);

export default Header;
