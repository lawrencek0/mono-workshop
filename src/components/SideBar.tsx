import * as React from 'react';
import styled from '../theme';
import { Genre } from '../redux/genres';

interface SideBarProps {
  genres: Genre[];
  className?: string;
}
class SideBar extends React.Component<SideBarProps> {
  render() {
    return <div className={this.props.className}>SideBar</div>;
  }
}

const StyledBar = styled(SideBar)`
  min-width: 300px;
  flex-basis: 20%;
  padding: 1.275rem;
  display: flex;
  flex-direction: column;
`;

export default StyledBar;
