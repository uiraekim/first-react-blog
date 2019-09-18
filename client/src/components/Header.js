import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import search from '../img/search.png';
import './Header.css';
import jQuery from "jquery";

import { connect } from 'react-redux';
import * as actions from '../actions';

class Header extends Component {

  state = {
    isDark: this.props.isDark,
    iconMode: this.props.iconMode
  }

  handleModeChange = (e) => { //darkMode를 체크하거나 체크 해제를 할 때 호출
    this.setState({
      isDark: !this.state.isDark
    });
    this.props.handleDarkMode(!this.state.isDark);
  }

  handlePostsChange = (e) => { //포스트를 어떻게 보여줄 지 바꿀 때 호출
    this.setState({
      iconMode: !this.state.iconMode
    });
    this.props.handlePostsMode(!this.state.iconMode);
  }

    componentDidMount(){
      this.setColor();
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

//이 생명주기 함수에서 setColor 함수를 실행
    componentDidUpdate(){
      this.setColor();
    }

    render() {

        return (
            <div className="container">
              <div className="dark">Dark mode <input type="checkbox"
                                                onChange={this.handleModeChange}
                                                defaultChecked={this.state.isDark}>
                                              </input></div>
              <SearchBar/>
              <hr/>
              <div className="logoMenu">
                <Link className="logo" to="/">Uirae's log</Link>
                <Menu name="일상" url="/category/life" />
                <Menu name="노래" url="/category/song" />
                <Menu name="UFC/격투기" url="/category/ufc" />
                <Menu name="영어" url="/category/english" />
                <Menu name="프로그래밍" url="/category/programming" />
              </div>
              <hr/>
              {/*아이콘 모드일 때는 아이콘모드가 디폴트, 반대일때는 게시판모드가 디폴트*/}
                  {this.state.iconMode ?
                    <select name="category" className="selectPostsMode" onChange={this.handlePostsChange}>
                      <option selected>아이콘 형식(기본)</option>
                      <option>게시판 형식</option>
                    </select>
                  :
                   <select name="category" className="selectPostsMode" onChange={this.handlePostsChange}>
                     <option>아이콘 형식(기본)</option>
                     <option selected>게시판 형식</option>
                    </select>
                  }


            </div>
        );
    }
}

const mapStateToProps = (state) => {//이 state는 컴포넌트가 아닌 redux의 state
  return{
    isDark: state.darkMode.isDark, //이렇게 posts값에 넘겨받은 state의 값을 넣어주면 하위 컴포넌트로 보낼수 있음
    iconMode: state.postsMode.iconMode
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    handleDarkMode: (darkMode) => { dispatch(actions.darkMode(darkMode)) },
    handlePostsMode: (iconMode) => { dispatch(actions.postsMode(iconMode)) }
  }
}

class SearchBar extends Component {

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
          <div className="searchDiv">
            <Link to={"/search/" + this.state.keyword}><img className="searchIcon" src={search} alt="검색" /></Link>
            <input className="searchInput" placeholder="search" name="keyword" value={this.state.keyword} onChange={this.handleValueChange} type="text" maxlength="24" minlength="2"/>
          </div>
        );
    }
}

const Menu = (props) => {
    return (
      <Link className="menu" to={props.url}>{props.name}</Link>
    );
}


export default connect(mapStateToProps, mapDispatchToProps)(Header);
