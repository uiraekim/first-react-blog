import * as types from '../actions/ActionTypes';

const initialState = {
  iconMode: true
};


export default function postsMode(state = initialState, action){ //state가 undefined 일 때 initialState를 사용

  switch(action.type) {
    case types.POSTS_MODE:
      return { iconMode: action.iconMode };
    default:
      return state;
  }
}
