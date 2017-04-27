import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchPosts } from '../actions';

class Home extends Component {
  componentDidMount() {
    this.props.fetchPosts();
  }

  render() {
    return (
      <div>
        <div className="text-sm-right">
          <Link to="/posts/new" className="btn btn-primary">
            Add a Post
          </Link>
        </div>
        List of blog posts
      </div>
    )
  }
}

export default connect(null, { fetchPosts })(Home);