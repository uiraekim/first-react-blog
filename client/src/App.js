import React from 'react';
import { Route } from "react-router-dom";
import Home from './components/Home';
import Manager from './components/Manager';
import Login from './components/Login';
import Write from './components/Write';
import Category from './components/Category';
import Post from './components/Post';
import Search from './components/Search';
import './App.css';

class App extends React.Component{

  render(){
    return (
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/manager/:page" component={Manager} />
        <Route path="/write" component={Write} />
        <Route path="/category/:category" component={Category} />
        <Route path="/post/:bno" component={Post} />
        <Route path="/search/:keyword" component={Search} />
      </div>
    );
  }
}

export default App;
