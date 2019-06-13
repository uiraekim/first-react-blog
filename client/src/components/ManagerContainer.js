import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import Header from './Header';
import Right from './Right';
import './ManagerContainer.css';
import programming from '../img/programming.jpg';
import english from '../img/english.png';
import life from '../img/life.PNG';
import song from '../img/song.png';
import ufc from '../img/ufc.jpg';

class Manager extends Component {
    render() {
        return (
            <div className="managerContainer">
              <PostList/>
            </div>
        );
    }
}

class PostList extends Component {

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
          <div>
            <div className="postList">
              <table>
                <th className="number">No</th>
                <th className="title">Title</th>
                <th className="hit">Views</th>
                <th className="checkbox"><input type="checkbox" name="" value=""/></th>
                {this.state.posts ? this.state.posts.map(c => {
                  let content;
                  let imgSrc;

                  if (c.content.length > 20) {
                    content = c.content.substring(0, 20) + "...";
                  }else{
                    content = c.content;
                  }

                  if (c.content.length > 80) {
                    content = c.content.substring(0, 80) + "...";
                  }else{
                    content = c.content;
                  }
                  if (c.category == "프로그래밍"){
                    imgSrc = programming;
                  }else if (c.category == "영어") {
                    imgSrc = english;
                  }else if (c.category == "UFC/격투기") {
                    imgSrc = ufc;
                  }else if (c.category == "노래") {
                    imgSrc = song;
                  }else if (c.category == "일상") {
                    imgSrc = life;
                  }
                  return (
                    <tr>
                      <td align="center">{c.id}</td>
                      <td><img className="img" src={imgSrc} alt="사진" /><Link className="title" to={"/post/" + c.id}><span>{c.title}</span></Link></td>
                      <td align="center">{c.hit}</td>
                      <td align="center"><input type="checkbox" name="" value=""/></td>
                  </tr>

                  );

                }) : ""}

              </table>
            </div>
            <Link className="goWritePage" to="/write">Writing</Link>
          </div>
        );
    }
}

export default Manager;
