import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import Header from './Header';
import SearchContainer from './SearchContainer';
import Right from './Right';
import { post } from 'axios';

import { connect } from 'react-redux';

class Search extends Component {

    render() {
        return (
            <div className="">
              <Header />
              <Right/>
              <SearchContainer posts={this.props.posts} keyword={this.props.match.params.keyword}/> {/*mapStateToProps의 값을 받아서 posts로 하위 컴포넌트에 넘겨준다.*/}
            </div>
        );
    }
}


const mapStateToProps = (state) => {//이 state는 컴포넌트가 아닌 redux의 state
  return{
    posts: state.callPosts.posts //이렇게 posts값에 넘겨받은 state의 값을 넣어주면 하위 컴포넌트로 보낼수 있음
  }
}

export default connect(mapStateToProps)(Search);
