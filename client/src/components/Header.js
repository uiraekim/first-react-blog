import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import search from '../img/search.png';
import './Header.css';

class Header extends Component {
    render() {
        return (
            <div className="container">
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
            </div>
        );
    }
}

const SearchBar = (props) => {
    return (
      <div className="searchDiv">
        <input className="searchInput" placeholder="search"/>
        <img className="searchIcon" src={search} alt="검색" />
      </div>
    );
}

const Menu = (props) => {
    return (
      <Link className="menu" to={props.url}>{props.name}</Link>
    );
}


export default Header;
