import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import Header from './Header';
import CategoryContainer from './CategoryContainer';
import Right from './Right';

import { connect } from 'react-redux';

class Category extends Component {
    render() {
        return (
            <div className="">
              <Header />
              <Right/>
              <CategoryContainer posts={this.props.posts} category={this.props.match.params.category} iconMode={this.props.iconMode}/>

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

export default connect(mapStateToProps)(Category);
