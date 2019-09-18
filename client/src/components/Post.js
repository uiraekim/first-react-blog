import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import Header from './Header';
import PostContainer from './PostContainer';
import jQuery from "jquery";
import Right from './Right';



class Post extends Component {
  componentDidMount() {
    //window.scrollTo(0,0);
    jQuery('body, html').animate({scrollTop: 160}, 600);
  }

  componentDidUpdate(prevProps) {
    //window.scrollTo(0,0);
    jQuery('body, html').animate({scrollTop: 160}, 600);
  }

    render() {
        return (
            <div className="">
              <Header />
              <Right/>
              <PostContainer bno={this.props.match.params.bno}/>
            </div>
        );
    }
}



export default Post;
