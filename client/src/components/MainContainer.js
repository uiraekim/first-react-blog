import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import './MainContainer.css';
import programming from '../img/programming.jpg';
import english from '../img/english.png';
import life from '../img/life.PNG';
import song from '../img/song.png';
import ufc from '../img/ufc.jpg';

class MainContainer extends Component {

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
            <div className="mainContainer">
            {/*<img src="http://localhost:3000/uploads/turtle.jpg" alt="사진" />*/}
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


                return <Content title={"[" + c.category + "] " + c.title} date={c.date.split("일",1)+"일"} content={content} imgSrc={imgSrc} url={"/post/" + c.id} />
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

class Category extends Component {
    render() {
        return (
            <div className="category">
            </div>
        );
    }
}

export default MainContainer;
