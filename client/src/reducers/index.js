import { combineReducers } from 'redux';
import callPosts from './callPosts';
import callPost from './callPost';
import darkMode from './darkMode';
import postsMode from './postsMode';

const reducers = combineReducers({
  callPosts, callPost, darkMode, postsMode
});

export default reducers;
