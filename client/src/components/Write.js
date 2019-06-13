import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import Header from './Header';
import Right from './Right';
import WriteContainer from './WriteContainer';
import './Write.css';

class Write extends Component {
    constructor(props) {
      super(props);
    }

    render() {
        return (
            <div className="">
              <Header />
              <Right/>
              <WriteContainer/>
            </div>
        );
    }
}


export default Write;
