import * as types from '../actions/ActionTypes';

const initialState = {
  post: ""
};

//각각의 post들을 불러온다. (board id에 따라 하나의 게시글을 불러옴)
export default function callPost(state = initialState, action){ //state가 undefined 일 때 initialState를 사용

  switch(action.type) {
    case types.CALL_POST:
      return { post: action.post };
    default:
      return state;
  }
}
