import axios from 'axios';

export const FETCH_POSTS = 'FETCH_POSTS';
export const CREATE_POST = 'CREATE_POST';

const PATH_BASE = 'http://reduxblog.herokuapp.com/api';
const PATH_POST = '/posts';
const PARAM_KEY = 'key=';
const API_KEY = 'fjilidkjafd;lfja';

export function fetchPosts() {
  const request = axios.get(`${PATH_BASE}${PATH_POST}?${PARAM_KEY}${API_KEY}`);

  return {
    type: FETCH_POSTS,
    payload: request
  };
}

export function createPost(props) {
  const request = axios.post(`${PATH_BASE}${PATH_POST}?${PARAM_KEY}${API_KEY}`, props);

  return {
    type: CREATE_POST,
    payload: request
  }
}