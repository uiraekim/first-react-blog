import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import Header from './Header';
import Right from './Right';
import ManagerContainer from './ManagerContainer';
import './Manager.css';

class Manager extends Component {
    render() {
        return (
            <div className="">
              <Header />
              <Right/>
              <ManagerContainer/>
            </div>
        );
    }
}

export default Manager;
