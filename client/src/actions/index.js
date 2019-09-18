import * as types from './ActionTypes';

//액션을 정의한다.
export function callPosts(posts) {
  return {
    type: types.CALL_POSTS,
    posts
  };
}

export function callPost(post) {
  return {
    type: types.CALL_POST,
    post
  };
}

export function darkMode(isDark) {
  return {
    type: types.DARK_MODE,
    isDark
  };
}

export function postsMode(iconMode) {
  return {
    type: types.POSTS_MODE,
    iconMode
  };
}
