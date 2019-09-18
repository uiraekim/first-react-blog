import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import './MainContainer.css';
import programming from '../img/programming.jpg';
import english from '../img/english.png';
import life from '../img/life.PNG';
import song from '../img/song.png';
import ufc from '../img/ufc.jpg';
import {stateToHTML} from 'draft-js-export-html';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';


class MainContainer extends Component {

  constructor(props) {
      super(props);
  };

  state = {
    showPosts: 12
  }

  componentDidMount(){
    // 마운트 될때에, 스크롤링 이벤트 생성
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
  // 언마운트 될때에, 스크롤링 이벤트 제거
  window.removeEventListener("scroll", this.handleScroll);
}

handleScroll = () => { //스크롤이 내려갔을 때 무한스크롤발동!
  const { innerHeight } = window;
  const { scrollHeight } = document.body;
  // IE에서는 document.documentElement 를 사용.
  const scrollTop =
    (document.documentElement && document.documentElement.scrollTop) ||
    document.body.scrollTop;
  // 스크롤링 했을때, 브라우저의 가장 밑에서 100정도 높이가 남았을때에 실행하기위함.
  if(this.props.posts.length > this.state.showPosts){
    if (scrollHeight - innerHeight - scrollTop < 10) {
      //alert("Almost Bottom Of This Browser" + this.props.posts.length);
      window.scrollTo(0,scrollHeight - 1000);
      this.setState({
        showPosts: this.state.showPosts + 6
      });
    }
  }

}

    render() {
        return (
            <div className="mainContainer">
              {this.props.iconMode && this.props.posts ? this.props.posts.slice(0,this.state.showPosts).map(c => { //아이콘 모드일 때
                  let content;
                  let imgSrc;
                  const contentPlainText = (convertFromRaw(JSON.parse(c.content))).getPlainText();
                  if (contentPlainText.length > 80) {
                    content = contentPlainText.substring(0, 80) + "...";
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
                  //아이콘모드인 컴포넌트를 리턴한다.
                  return <IconModeContent title={"[" + c.category + "] " + c.title} date={c.date.split("일",1)+"일"} content={content} imgSrc={imgSrc} url={"/post/" + c.id} />
                }) : "" }

              {!this.props.iconMode && this.props.posts ? this.props.posts.map(c => {  //아이콘 모드가 아닐 때
                let content;
                let imgSrc;
                //에디터에서 가져온 콘텐트 정보는 plainText가 아니므로 바꿔서 저장을 해준다.
                const contentPlainText = (convertFromRaw(JSON.parse(c.content))).getPlainText();
                if (contentPlainText.length > 80) {
                  content = contentPlainText.substring(0, 80) + "...";
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

                return <BoardModeContent title={"[" + c.category + "] " + c.title} date={c.date.split("일",1)+"일"} content={content} imgSrc={imgSrc} url={"/post/" + c.id} />
              }) : ""}
            </div>
        );
    }
}

class IconModeContent extends Component { //아이콘모드 컴포넌트
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

class BoardModeContent extends Component { //보드모드 컴포넌트
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


export default MainContainer;
