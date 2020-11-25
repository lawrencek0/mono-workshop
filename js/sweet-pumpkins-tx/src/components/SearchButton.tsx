import * as React from 'react';
import styled from '../theme';

interface SearchButtonProps {
  onClick?: () => void;
  className?: string;
}

const SearchButton: React.StatelessComponent<SearchButtonProps> = ({
  className,
  onClick
}) => (
  <button className={className} onClick={onClick}>
    Search
  </button>
);

const StyledSearchButton = styled(SearchButton)`
  padding: 1em 1.5em;
  background: ${props => props.theme.secondaryColor};
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.125rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s ease-out;
  outline: 0;
  border: 0;

  &:hover {
    color: #fff;
  }
`;

export default StyledSearchButton;
