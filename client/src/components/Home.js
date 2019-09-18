import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import Header from './Header';
import MainContainer from './MainContainer';
import Right from './Right';
import { post } from 'axios';

import { connect } from 'react-redux';

class Home extends Component {

  addPost = () => { //메인페이지에 들어왔을 때 서버측으로 신호를 보냄 (ip를 얻어내기 위해)
    const url = '/api/connect';
    return post(url);
  }

  componentDidMount() {
    this.addPost()
      .then((response) => {
        console.log("리스폰스 데이터"+response.data); //걍 출력해봄
      })
  }

    render() {
        return (
            <div className="">
              <Header />
              <Right/>
              <MainContainer posts={this.props.posts} iconMode={this.props.iconMode}/> {/*mapStateToProps의 값을 받아서 posts로 하위 컴포넌트에 넘겨준다.*/}
            </div>
        );
    }
}


const mapStateToProps = (state) => {//이 state는 컴포넌트가 아닌 redux의 state
  return{
    posts: state.callPosts.posts, //이렇게 posts값에 넘겨받은 state의 값을 넣어주면 하위 컴포넌트로 보낼수 있음
    iconMode: state.postsMode.iconMode
  }
}

export default connect(mapStateToProps)(Home);
