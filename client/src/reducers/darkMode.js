import * as types from '../actions/ActionTypes';

const initialState = {
  isDark: false
};


export default function darkMode(state = initialState, action){ //state가 undefined 일 때 initialState를 사용

  switch(action.type) {
    case types.DARK_MODE:
      return { isDark: action.isDark };
    default:
      return state;
  }
}
