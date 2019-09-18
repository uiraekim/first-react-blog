import * as types from '../actions/ActionTypes';

const initialState = {
  posts: ""
};

//모든 posts를 불러온다.
export default function callPosts(state = initialState, action){ //state가 undefined 일 때 initialState를 사용
  switch(action.type) {
    case types.CALL_POSTS:
      return { posts: action.posts };
    default:
      return state;
  }
}
