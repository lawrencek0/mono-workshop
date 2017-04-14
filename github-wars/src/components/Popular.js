import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const SelectLanguage = (props) => {
    const languages = ['All', 'Javascript', 'Ruby', 'CSS', 'Python'];
    return (
    <ul className="languages">
      {languages.map(lang =>
        <li
          style={lang === props.selectedLanguage ? { color: '#d0021b'} : null }
          onClick={() => props.onSelect(lang)}
          key={lang}
        >
          {lang}
        </li>
      )}
    </ul>
    )
};

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};

const RepoGrid = (props) => {
  return (
    <ul className="popular-list">
      {
        props.repos.map((repo, i) => {
        return (
          <li key={repo.name} className="popular-item">
            <div className="popular-rank">#{i + 1}</div>
            <ul className="space-list-items">
              <li>
                <img
                  src={repo.owner.avatar_url}
                  alt={`Avatar for ${repo.owner.login}`}
                  className="avatar"/>
              </li>
              <li>
                <a href={repo.html_url}>{repo.name}</a>
              </li>
              <li>@{repo.owner.login}</li>
              <li>{repo.stargazers_count} stars</li>
            </ul>
          </li>
        )
      })}
    </ul>
  )
};

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
};

class Popular extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedLanguage: 'All',
      repos: null
    };

    this.updateLanguage = this.updateLanguage.bind(this);
  }

  async updateLanguage(lang) {
    this.setState({
      selectedLanguage: lang,
      repos: null
    });

    const url = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${lang}&sort=stars&order=desc&type=Repositories`);
    const res = await axios.get(url);

    this.setState({
      repos: res.data.items
    });
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage);

  }

  render() {
    return (
      <div>
        <SelectLanguage
          selectedLanguage={this.state.selectedLanguage}
          onSelect={this.updateLanguage}
        />
        { !this.state.repos ?
          <h2>Loading</h2> :
          <RepoGrid repos={this.state.repos}/>
        }

      </div>

    )
  }
}
export default Popular