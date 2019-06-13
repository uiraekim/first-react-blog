import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { post } from 'axios';
import './WriteContainer.css';

class WriteContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      category: '',
      title: '',
      content: '',
      imgFile: null,
      imgName: ''
    }
    this.handleClick = this.handleClick.bind(this);
  }

  getDate = () => {
    const date = new Date();
    const year = date.getYear() + 1900;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const dateForm = year + "년" + month + "월" + day + "일 " + hour + ":" + minute + ":" + second;
    return dateForm;
  }

  addPost = () => {
    const url = '/api/save';
    const formData = new FormData();


    formData.append('category', this.state.category)
    formData.append('title', this.state.title)
    formData.append('date', this.getDate())
    formData.append('content', this.state.content)
    formData.append('image', this.state.file)

    /*const formData = {
      'category' : this.state.category,
      'title' : this.state.title,
      'date' : this.getDate(),
      'content' : this.state.content,
      'image' : this.state.file
    }*/
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    return post(url, formData, config);
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.addPost()
      .then((response) => {
        console.log("리스폰스 데이터"+response.data);
      })
    this.setState({
      category: '',
      title: '',
      content: '',
      file: null,
      fileName: ''
    })
    this.props.history.push('/')
  }

  handleFileChange = (e) => {
    this.setState({
      file: e.target.files[0],
      fileName: e.target.value
    })
  }

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  handleClick() {
    //this.props.history.push('/')
  }

    render() {
        return (
            <div className="writeContainer">
              <div className="writePost">Write post</div>
              <form onSubmit={this.handleFormSubmit}>
                <div>
                  <select name="category" className="category" value={this.state.category} onChange={this.handleValueChange}>
                    <option selected>카테고리</option>
                    <option>프로그래밍</option>
                  	<option>영어</option>
                  	<option>UFC/격투기</option>
                    <option>노래</option>
                  	<option>일상</option>
                  </select>
                </div>
                <input className="file" type="file" name="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange}/>
                <input name="title" className="title" value={this.state.title} onChange={this.handleValueChange} type="text" maxlength="50" minlength="6"/>
                <textarea name="content" className='content' value={this.state.content} onChange={this.handleValueChange}></textarea>
                <button className='save' type="submit" onClick={this.handleClick}>Save</button>
              </form>
            </div>
        );
    }
}

export default withRouter(WriteContainer);
