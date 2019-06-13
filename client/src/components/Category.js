import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import Header from './Header';
import CategoryContainer from './CategoryContainer';
import Right from './Right';
import './Category.css';

class Category extends Component {
    render() {
        return (
            <div className="">
              <Header />
              <Right/>
              <CategoryContainer category={this.props.match.params.category}/>

            </div>
        );
    }
}



export default Category;
