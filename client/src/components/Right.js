import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import search from '../img/search.png';
import './Right.css';

class Right extends Component {

    render() {
        return (
            <div className="rightContainer">
              <MostViewedPost/>
              <Category/>
              <Search/>
              <RecentPost/>
              <RecentComment/>
              <Manager/>
            </div>
        );
    }
}

class MostViewedPost extends Component {

    state = {
      posts: ""
    }

    componentDidMount(){
      this.callApi()
        .then(res => this.setState({posts: res}))
        .catch(err => console.log(err));
    }

    callApi = async () => {
      const response = await fetch('/api/post/most');
      const body = await response.json();
      return body;
    }


    render() {
        return (
            <div className="mostViewedPost">
              <div className="title">Most viewed posts</div>
              <ul>

                {this.state.posts ? this.state.posts.map(c => {
                  let content;
                  if (c.content.length > 80) {
                    content = c.content.substring(0, 80) + "...";
                  }else{
                    content = c.content;
                  }

                  return <MostViewedPostList title={"[" + c.category + "] " + c.title} date={c.date.split("일", 1) + "일"} bno={"/post/"+c.id} hit={c.hit} />
                }) : ""}
              </ul>
            </div>
        );
    }
}

const MostViewedPostList = (props) => {
    return (
      <li>
        <Link className="postTitle" to={props.bno}>{props.title}</Link>
        <span className="count">{props.count}</span>
        <div className="hit">{props.hit} viewed</div>
        <div className="date">{props.date}</div>
      </li>
    );
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


    state = {
      keyword: ""
    }

      handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
      }

    render() {
        return (
            <div className="search">
              <div className="title">Search</div>
              <input className="rightSearchInput" placeholder="search" name="keyword" value={this.state.keyword} onChange={this.handleValueChange} type="text" maxlength="24" minlength="2"/>
              <Link to={"/search/" + this.state.keyword}><img className="rightSearchIcon" src={search} alt="검색" /></Link>
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
      const response = await fetch('/api/post/recent');
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

                  return <RecentPostList title={"[" + c.category + "] " + c.title} date={c.date.split("일", 1) + "일"} bno={"/post/"+c.id} />
                }) : ""}
              </ul>
            </div>
        );
    }
}

const RecentPostList = (props) => {
    return (
      <li>
        <Link className="postTitle" to={props.bno}>{props.title}</Link>
        <span className="count">{props.count}</span>
        <div className="date">{props.date}</div>
      </li>
    );
}

class RecentComment extends Component {

  state = {
    comments: ""
  }

//마운트가 끝난 후에 api서버에서 모든 최근 10개의 댓글 데이터를 가져와서 state의 comments에 저장한다.
  componentDidMount(){
    this.callApi()
      .then(res => this.setState({comments: res}))
      .catch(err => console.log(err));
  }

//api서버로 접속할 때 호출하는 함수
  callApi = async () => {
    const response = await fetch('/api/comment/recent');
    const body = await response.json();
    return body;
  }

    render() {
        return (
            <div className="recentComment">
              <div className="title">Recent comments</div>
              <ul>
                {this.state.comments ? this.state.comments.map(c => {
                  let content;
                  if (c.content.length > 20) {
                    content = c.content.substring(0, 20) + "...";
                  }else{
                    content = c.content;
                  }

                  return <Comment name={content} bno={c.bno}/>
                }) : ""}
              </ul>
            </div>
        );
    }
}

const Comment = (props) => {
    return (
      <li><Link className="commentTitle" to={"/post/"+props.bno}>{props.name}</Link></li>
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
