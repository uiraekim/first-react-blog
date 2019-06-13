import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import './CategoryContainer.css';
import programming from '../img/programming.jpg';
import english from '../img/english.png';
import life from '../img/life.PNG';
import song from '../img/song.png';
import ufc from '../img/ufc.jpg';

class CategoryContainer extends Component {

  state = {
    posts: ""
  }

//처음에 컴포넌트가 렌더 되었을 때 서버에서 post정보들을 불러옴
  componentDidMount(){
    this.callApi()
      .then(res => this.setState({posts: res}))
      .catch(err => console.log(err));
  }

  componentDidUpdate(prevProps) {
    //바로 이전의 props 와 바뀐 props가 다를 때만 호출된다. 이렇게 하지 않으면 무한루프에 빠진다.
    if (this.props.category !== prevProps.category) {
    this.callApi()
      .then(res => this.setState({posts: res}))
      .catch(err => console.log(err));
    }
  }

  callApi = async () => {
    const response = await fetch('/api/category/?category=' + this.props.category);
    const body = await response.json();
    return body;
  }

    render() {
        return (
            <div className="categoryContainer">
              {this.state.posts ? this.state.posts.map(c => {
                let content;
                let imgSrc;
                if (c.content.length > 80) {
                  content = c.content.substring(0, 80) + "...";
                }else{
                  content = c.content;
                }
                if(c.img){
                  imgSrc = c.img;
                }else{
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
                }


                return <Content title={"[" + c.category + "] " + c.title} date={c.date.substring(0, 9)} content={content} imgSrc={imgSrc} url={"/post/" + c.id} />
              }) : ""}

            </div>
        );
    }
}

class Content extends Component {
    render() {
        return (
            <div className="post">
              <Link to={this.props.url}><img className="img" src={this.props.imgSrc} alt="사진" /></Link>
              <Link className="title" to={this.props.url}><div>{this.props.title}</div></Link>
              <div className="date">{this.props.date}</div>
              <div className="content">{this.props.content}</div>

            </div>
        );
    }
}

export default CategoryContainer;
