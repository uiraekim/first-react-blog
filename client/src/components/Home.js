import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import Header from './Header';
import MainContainer from './MainContainer';
import Right from './Right';
import './Home.css';

class Home extends Component {



    render() {
        return (
            <div className="">
              <Header />
              <Right/>
              <MainContainer/>
            </div>
        );
    }
}

export default Home;
