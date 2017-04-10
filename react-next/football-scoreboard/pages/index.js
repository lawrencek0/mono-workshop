import React from 'react';
import axios from 'axios';
import SelectField from 'react-md/lib/SelectFields';

import Layout from '../components/layout';

/*const data = [
  {
    _links: {
      self: {
        href: "http://api.football-data.org/v1/competitions/424"
      },
      teams: {
        href: "http://api.football-data.org/v1/competitions/424/teams"
      },
      fixtures: {
        href: "http://api.football-data.org/v1/competitions/424/fixtures"
      },
      leagueTable: {
        href: "http://api.football-data.org/v1/competitions/424/leagueTable"
      }
    },
    id: 424,
    caption: "European Championships France 2016",
    league: "EC",
    year: "2016",
    currentMatchday: 7,
    numberOfMatchdays: 7,
    numberOfTeams: 24,
    numberOfGames: 51,
    lastUpdated: "2016-07-10T21:32:20Z"
  },
  {
    _links: {
      self: {
        href: "http://api.football-data.org/v1/competitions/426"
      },
      teams: {
        href: "http://api.football-data.org/v1/competitions/426/teams"
      },
      fixtures: {
        href: "http://api.football-data.org/v1/competitions/426/fixtures"
      },
      leagueTable: {
        href: "http://api.football-data.org/v1/competitions/426/leagueTable"
      }
    },
    id: 426,
    caption: "Premier League 2016/17",
    league: "PL",
    year: "2016",
    currentMatchday: 32,
    numberOfMatchdays: 38,
    numberOfTeams: 20,
    numberOfGames: 380,
    lastUpdated: "2017-04-09T17:00:29Z"
  }
];

const data1 = data.map((item) => {
  return {
    label: item.caption,
    value: item.id
  };
});*/

export default class extends React.Component {
  static async getInitialProps() {
    const res = await axios.get('http://api.football-data.org/v1/competitions');

    return {data: res.data}
  }

  //try changing the value and see if it works then move to ajax requests
  render() {
    const leagues = this.props.data.map((item) => {
      return {
        label: item.caption,
        value: item.id
      }
    });
    return (
        <Layout>
          <div className="md-grid">
            <div className="md-cell md-cell--2" />
            <div className="md-cell md-cell--8">
              <section className="md-grid">
                <SelectField
                  id="selectLeague"
                  menuItems={leagues}
                  placeholder="Select a Leagues"
                  className="md-cell md-cell--12"
                  position={SelectField.Positions.BELOW}
                />
              </section>
            </div>
            <div className="md-cell md-cell--2" />
          </div>
        </Layout>
    )
  }
}
