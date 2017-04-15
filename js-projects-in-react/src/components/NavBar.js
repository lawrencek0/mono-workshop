import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import {spacing, typography} from 'material-ui/styles';
import {cyan500} from 'material-ui/styles/colors';
import { List, ListItem } from 'material-ui/List';

const styles = {
  logo: {
    cursor: 'pointer',
    fontSize: 24,
    lineHeight: `${spacing.desktopKeylineIncrement}px`,
    fontWeight: typography.fontWeightLight,
    backgroundColor: cyan500,
    paddingLeft: spacing.desktopGutter,
    marginBottom: 8,
  }
};

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {open: false};

    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    this.setState({
      open: !this.state.open
    })
  }

  render() {
    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={this.handleToggle}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
        <Drawer
          docked={false}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <div style={styles.logo}>
            <Link to="/">
              <span style={{color: typography.textFullWhite}} >
                FCC JS Projects
              </span>
            </Link>
          </div>

          <List>
            <ListItem
              containerElement={
                <NavLink exact activeClassName='active' to="/" />
              }
              onTouchTap={this.handleToggle}
              primaryText="Portfolio"
            />
            <ListItem
              containerElement={
                <NavLink activeClassName='active' to="/weather" />
              }
              onTouchTap={this.handleToggle}
              primaryText="Weather"
            />
            <ListItem
              containerElement={
                <NavLink activeClassName='active' to="/quotes" />
              }
              onTouchTap={this.handleToggle}
              primaryText="Random Quote Generator"
            />
            <ListItem
              containerElement={
                <NavLink activeClassName='active' to="/wikipedia-viewer" />
              }
              onTouchTap={this.handleToggle}
              primaryText="Wikipedia Viewer"
            />
            <ListItem
              containerElement={
                <NavLink activeClassName='active' to="/pomodoro-timer" />
              }
              onTouchTap={this.handleToggle}
              primaryText="Pomodoro Timer"
            />
          </List>
        </Drawer>
      </div>
    )
  }
}

export default NavBar;
