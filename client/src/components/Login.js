import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import Header from './Header';
import Right from './Right';
import jQuery from "jquery";
import './Login.css';

class Login extends Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
      this.setState({value: event.target.value});
    }

    handleSubmit(event) {
    event.preventDefault();
      if(this.state.value == "12341234"){ //비밀번호가 맞아야지
        this.props.history.push("/manager/1"); //메니저 페이지로 감
      }else{
        alert("비밀번호가 틀렸습니다.");
      }
    }

    componentDidMount() {
      jQuery('body, html').animate({scrollTop: 0}, 500); //스크롤을 맨상단으로 500ms만에 올림
    }

    render() {
        return (
            <div className="">
              <Header />
              <Right/>
              <div className="loginContainer">
                <form onSubmit={this.handleSubmit}>
                  <input type="password" placeholder="관리자 비밀번호" value={this.state.value} onChange={this.handleChange} />
                  <button type="submit">입력</button>
                </form>
              </div>
            </div>
        );
    }
}


export default Login;
