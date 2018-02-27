import * as React from 'react';
import styled, { ThemeInterface } from '../theme';

interface HeaderProps {
  theme?: ThemeInterface;
  className?: string;
}

// @TODO: after adding React-Router make this button navigate to home
const Header: React.StatelessComponent<HeaderProps> = props => (
  <header className={props.className}>
    <h1>Sweeet Pumpkins (TX)</h1>
  </header>
);

const StyledHeader = styled(Header)`
  background-color: ${props => props.theme.primaryColor};
  font-family: 'Amatic SC', cursive;
  font-size: 1.75rem;
  height: 5.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default StyledHeader;
