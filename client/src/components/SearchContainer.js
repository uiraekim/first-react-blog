import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import './SearchContainer.css';
import programming from '../img/programming.jpg';
import english from '../img/english.png';
import life from '../img/life.PNG';
import song from '../img/song.png';
import ufc from '../img/ufc.jpg';
import { convertFromRaw } from 'draft-js';


class SearchContainer extends Component {

  constructor(props) {
      super(props);
  };

    render() {
      console.log(this.props.posts);
        return (
            <div className="searchContainer">
              {this.props.posts ? this.props.posts.map(c => {
                let content;
                let imgSrc;
                const contentPlainText = (convertFromRaw(JSON.parse(c.content))).getPlainText();
                if (contentPlainText.length > 80) { //내용의 글자 수가 80자보다 많으면
                  content = contentPlainText.substring(0, 80) + "..."; //80자까지 자르고 마지막에 ...을 붙임
                }else{
                  content = contentPlainText;
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

                if(c.title.includes(this.props.keyword) || c.title.replace(/ /gi, "").includes(this.props.keyword)
                   || c.content.includes(this.props.keyword) || c.content.replace(/ /gi, "").includes(this.props.keyword)){
                  return <Content title={"[" + c.category + "] " + c.title} date={c.date.substring(0, 9)} content={content} imgSrc={imgSrc} url={"/post/" + c.id} />
                } else {
                  return ""
                }
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


export default SearchContainer;
