import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import search from '../img/search.png';
import './Right.css';

class Right extends Component {

    render() {
        return (
            <div className="rightContainer">
              <Category/>
              <Search/>
              <RecentPost/>
              <RecentComment/>
              <Manager/>
            </div>
        );
    }
}

class Category extends Component {
    render() {
        return (
            <div className="category">
              <span className="title">Category</span>
              <ul>
                <Menu name="프로그래밍" url="/category/programming" count="" />
                <Menu name="영어" url="/category/english" count="" />
                <Menu name="UFC/격투기" url="/category/ufc" count="" />
                <Menu name="노래" url="/category/song" count="" />
                <Menu name="일상" url="/category/life" count="" />
              </ul>
            </div>
        );
    }
}

const Menu = (props) => {
    return (
      <li><Link className="categoryName" to={props.url}>{props.name}</Link><span className="count">{props.count}</span></li>
    );
}

class Search extends Component {
    render() {
        return (
            <div className="search">
              <div className="title">Search</div>
              <input className="rightSearchInput" placeholder="search"/>
              <img className="rightSearchIcon" src={search} alt="검색" />
            </div>
        );
    }
}

class RecentPost extends Component {

    state = {
      posts: ""
    }

    componentDidMount(){
      this.callApi()
        .then(res => this.setState({posts: res}))
        .catch(err => console.log(err));
    }

    callApi = async () => {
      const response = await fetch('/api/category');
      const body = await response.json();
      return body;
    }


    render() {
        return (
            <div className="recentPost">
              <div className="title">Recent posts</div>
              <ul>

                {this.state.posts ? this.state.posts.map(c => {
                  let content;
                  if (c.content.length > 80) {
                    content = c.content.substring(0, 80) + "...";
                  }else{
                    content = c.content;
                  }

                  return <Post title={"[" + c.category + "] " + c.title} date={c.date.split("일", 1) + "일"} bno={"/post/"+c.id} />
                }) : ""}
              </ul>
            </div>
        );
    }
}

const Post = (props) => {
    return (
      <li>
        <Link className="postTitle" to={props.bno}>{props.title}</Link>
        <span className="count">{props.count}</span>
        <div className="date">{props.date}</div>
      </li>
    );
}

class RecentComment extends Component {
    render() {
        return (
            <div className="recentComment">
              <div className="title">Recent comments</div>
              <ul>
                <Comment name="[프로그래밍][React] 즐겁게 공부하는 리액트라구요." count="13" />
                <Comment name="[프로그래밍][React] 즐겁게 공부하는 리액트라구요." count="10" />
                <Comment name="[프로그래밍][React] 즐겁게 공부하는 리액트라구요." count="6" />
                <Comment name="[프로그래밍][React] 즐겁게 공부하는 리액트라구요." count="21" />
                <Comment name="[프로그래밍][React] 즐겁게 공부하는 리액트라구요." count="32" />
              </ul>
            </div>
        );
    }
}

const Comment = (props) => {
    return (
      <li><Link className="commentTitle" to="/">{props.name}</Link><span className="count">({props.count})</span></li>
    );
}

class Manager extends Component {

    render() {
        return (
            <div>
              <Link className="goManagerPage" to="/login" >manager</Link>
            </div>
        );
    }
}

export default Right;
