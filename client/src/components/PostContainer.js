import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import './PostContainer.css';
import programming from '../img/programming.jpg';
import english from '../img/english.png';
import life from '../img/life.PNG';
import song from '../img/song.png';
import ufc from '../img/ufc.jpg';
class PostContainer extends Component {

  state = {
    post: ""
  }

  componentDidMount(){
    this.callApi()
      .then(res => this.setState({post: res}))
      .catch(err => console.log(err));
  }

  componentDidUpdate(prevProps) {
    //바로 이전의 props 와 바뀐 props가 다를 때만 호출된다. 이렇게 하지 않으면 무한루프에 빠진다.
    if (this.props.bno !== prevProps.bno) {
    this.callApi()
      .then(res => this.setState({post: res}))
      .catch(err => console.log(err));
    }
  }

  callApi = async () => {
    const response = await fetch('/api/post/?bno='+ this.props.bno);
    const body = await response.json();
    return body;
  }

    render() {

      let imgSrc; //이미지 경로를 선언하고 카테고리에 따라서 변수에 맞는 경로를 대입해준다.
      if(this.state.post){
        if(this.state.post[0].img){
          imgSrc = this.state.post[0].img;
        }else{
          if (this.state.post[0].category == "프로그래밍"){
            imgSrc = programming;
          }else if (this.state.post[0].category == "영어") {
            imgSrc = english;
          }else if (this.state.post[0].category == "UFC/격투기") {
            imgSrc = ufc;
          }else if (this.state.post[0].category == "노래") {
            imgSrc = song;
          }else if (this.state.post[0].category == "일상") {
            imgSrc = life;
          }
        }

      }

        return (
            <div className="postContainer">
            {this.state.post ?
              <div>
                <div className="title">{this.state.post[0].title}</div>
                <div>
                  <span className="date">{this.state.post[0].date.split("일", 1)+"일"}</span>
                  <span className="category">[{this.state.post[0].category}]</span>
                </div>
                <hr/>
                <img className="img" src={imgSrc} alt="사진" />
                <div className="content">{this.state.post[0].content}</div>
              </div>
              : ""}
              <div className="box"></div>
            </div>
        );
    }
}

export default PostContainer;
