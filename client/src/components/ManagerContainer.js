import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import Header from './Header';
import Right from './Right';
import IpGraph from './IpGraph';
import './ManagerContainer.css';
import programming from '../img/programming.jpg';
import english from '../img/english.png';
import life from '../img/life.PNG';
import song from '../img/song.png';
import ufc from '../img/ufc.jpg';

class ManagerContainer extends Component {
    render() {
        return (
            <div className="managerContainer">
              <PostList page={this.props.page}/>
              <IpList/>
              <IpGraph/>
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
                <th className="deletePost"></th>
                <th className="modifyPost"></th>
                {this.state.posts ? this.state.posts.map((c, i) => {
                  if(i > (this.props.page - 1) * 10 && i < (this.props.page) * 10){
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
                        {/*<td align="center" className="deletePost"><button>수정</button></td>
                        <td align="center" className="modifyPost"><button>삭제</button></td>*/}
                    </tr>

                    );
                  }

                }) : ""}

              </table>
            </div>
            <Link className="goWritePage" to="/write">Writing</Link>
            <div className="pageContainer">{this.state.posts ? this.state.posts.map((c, i) => {
                if(i % 10 == 0){
                  const page = i/10 + 1;
                  if(page == this.props.page){
                    return (
                      <Link className="pageSelected" to={"/manager/" + page}><span>{page}</span></Link>
                    );
                  }else{return (
                    <Link className="page" to={"/manager/" + page}><span>{page}</span></Link>
                  );
                  }

                }

            }) : ""}</div>
          </div>
        );
    }
}

class IpList extends Component {

    state = {
      ips: ""
    }

    componentDidMount(){
      this.callApi()
        .then(res => this.setState({ips: res}))
        .catch(err => console.log(err));
    }

    callApi = async () => {
      const response = await fetch('/api/ip');
      const body = await response.text();
      return body;
    }

    render() {
        return (
          <div className="ipList">
            {this.state.ips ? this.state.ips : ""}
          </div>
        );
    }
}

export default ManagerContainer;
