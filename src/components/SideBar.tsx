import * as React from 'react';
import styled from '../theme';

interface SideBarProps {
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
`;

export default StyledBar;
