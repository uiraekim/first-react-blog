import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import './CategoryContainer.css';
import programming from '../img/programming.jpg';
import english from '../img/english.png';
import life from '../img/life.PNG';
import song from '../img/song.png';
import ufc from '../img/ufc.jpg';
import { convertFromRaw } from 'draft-js';

import jQuery from "jquery";

import { connect } from 'react-redux';
import * as actions from '../actions';

class CategoryContainer extends Component {
  constructor(props) {
      super(props);
  };

  state = {
    posts: ""
  }

//darkMode인지 아닌지에 따라서 여러가지 태그의 색상을 정의
  setColor = () => {
    if(this.props.isDark){ //redux의 state중 darkMode의 isDark가 true일 때
      document.body.style.backgroundColor = "#424242";
      jQuery('body').css({ color: "white" });
      jQuery('.content').css({ color: "white" });
      jQuery('.logo').css({ color: "#E6E6E6" });
      jQuery('.menu').css({ color: "white" });
      jQuery('.title').css({ color: "white" });
      jQuery('.postTitle').css({ color: "white" });
    }else { //redux의 state중 darkMode의 isDark가 false일 때
      document.body.style.backgroundColor = "white";
      jQuery('body').css({ color: "black" });
      jQuery('.content').css({ color: "black" });
      jQuery('.logo').css({ color: "#545454" });
      jQuery('.menu').css({ color: "#585858" });
      jQuery('.menu:hover').css({ color: "#76FB3E" });
      jQuery('.title').css({ color: "black" });
      jQuery('.postTitle').css({ color: "#8A0829" });
    }
  }


  //처음에 컴포넌트가 렌더 되었을 때 서버에서 post정보들을 불러옴
    componentDidMount(){
      this.setColor();
      this.callApi()
        .then(res => this.setState({posts: res}))
        .catch(err => console.log(err));
    }
  componentDidUpdate(prevProps) {
    this.setColor();
    //바로 이전의 props 와 바뀐 props가 다를 때만 호출된다. 이렇게 하지 않으면 무한루프에 빠진다.
    if (this.props.category !== prevProps.category) {
    this.callApi()
      .then(res => this.setState({posts: res}))
      .catch(err => console.log(err));
    }
  }

//각각의 카테고리의 이름을 props에 담아서 api서버로 GET으로 보내준다. (해당 카테고리의 내용만 받아서 보여주기 위해)
  callApi = async () => {
    const response = await fetch('/api/category/?category=' + this.props.category);
    const body = await response.json();
    return body;
  }

    render() {
        return (
            <div className="categoryContainer">
              {this.props.posts ? this.props.posts.map(c => {
                let content;
                let imgSrc;
                let categoryE; //현재 페이지 카테고리를 영어로 담아놓은 변수.
                const contentPlainText = (convertFromRaw(JSON.parse(c.content))).getPlainText();
                if (contentPlainText.length > 80) { //내용의 길이가 길면 80글자까지만 보여주고 뒤에 ...붙여서 출력
                  content = contentPlainText.substring(0, 80) + "...";
                }else{
                  content = contentPlainText;
                }

                if(c.img){ //이미지가 있으면
                  imgSrc = c.img; //이미지의 경로를 담고
                }else{ //없으면 디폴트 경로를 담는다.
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

                //c.category값은 한글로 되어있으므로 영어로 바꿔준다. categoryE는 category 영어버전
                if (c.category == "프로그래밍"){
                  categoryE = "programming";
                }else if (c.category == "영어") {
                  categoryE = "english";
                }else if (c.category == "UFC/격투기") {
                  categoryE = "ufc";
                }else if (c.category == "노래") {
                  categoryE = "song";
                }else if (c.category == "일상") {
                  categoryE = "life";
                }

                if(this.props.category == categoryE){
                  if(this.props.iconMode){
                    return <IconModeContent title={"[" + c.category + "] " + c.title} date={c.date.substring(0, 9)} content={content} imgSrc={imgSrc} url={"/post/" + c.id} />
                  }else{
                    return <BoardModeContent title={"[" + c.category + "] " + c.title} date={c.date.substring(0, 9)} content={content} imgSrc={imgSrc} url={"/post/" + c.id} />
                  }
                } else {
                  return ""
                }
              }) : ""}

            </div>
        );
    }
}

const mapStateToProps = (state) => {//이 state는 컴포넌트가 아닌 redux의 state
  return{
    isDark: state.darkMode.isDark //이렇게 posts값에 넘겨받은 state의 값을 넣어주면 하위 컴포넌트로 보낼수 있음
  }
}

class IconModeContent extends Component {
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

class BoardModeContent extends Component {
    render() {
        return (
            <div className="boardMode">
              <Link to={this.props.url}><img className="img" src={this.props.imgSrc} alt="사진" /></Link>
              <Link className="title" to={this.props.url}><div>{this.props.title}</div></Link>
              <div className="date">{this.props.date}</div>
              <div className="content">{this.props.content}</div>

            </div>
        );
    }
}



export default connect(mapStateToProps)(CategoryContainer);
