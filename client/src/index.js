import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import * as serviceWorker from './serviceWorker';

import { createStore } from 'redux';
import reducers from './reducers';
import * as actions from './actions';
import { Provider } from 'react-redux';

const store = createStore(reducers); //최상위의 index파일에 스토어를 생성한다.

const callApi = async () => { //카테고리별 posts data를 불러온다.
  const response = await fetch('/api/category');
  const body = await response.json();
  return body;
}

callApi() //data를 불러오는 함수를 실행시킨 뒤
  .then(res => store.dispatch(actions.callPosts(res))) //dispatch로 액션에 data를 담아서 넘겨줘서 store의 state값을 업데이트한다.
  .then(res => console.log(store.getState().callPosts.posts)) //콘솔로 찍어봄
  .catch(err => console.log(err));


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'));

serviceWorker.unregister();
