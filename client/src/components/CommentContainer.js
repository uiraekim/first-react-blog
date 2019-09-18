import React, { Component } from 'react';
import './CommentContainer.css';
import { post } from 'axios';
import jQuery from "jquery";

class CommentContainer extends Component {

    render() {

        return (
            <div className="commentContainer">
              <CommentForm bno={this.props.bno}></CommentForm>
              <CommentList bno={this.props.bno}></CommentList>
            </div>
        );
    }
}

class CommentForm extends Component {

  constructor(props) {
    super(props); //props 초기화
    this.state = { //state 초기화
      content: '',
      nickName: '',
      pw: ''
    }
  }

//날짜 시간을 받아오는 함수
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

//댓글을 저장하면 불려오는 함수
    addComment = () => {
      const url = '/api/save/comment';

      const formData = {
        'bno' : this.props.bno,
        'content' : this.state.content,
        'nickName' : this.state.nickName,
        'pw' : this.state.pw,
        'date' : this.getDate()
      }

      return post(url, formData);
    }

//제출을 누르면 호출됨 여기서 위의 addComment 함수를 호출한다
    handleFormSubmit = (e) => {
      e.preventDefault();
      this.addComment()
        .then((response) => {
          console.log("리스폰스 데이터"+response.data);
        })
      this.setState({
        content: '',
        nickName: '',
        pw: ''
      })
      window.location.reload();
      //this.props.history.push('/')
    }

//input태그의 값이 변하면 호출되는 함수
  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

    render() {

        return (
            <div className="">
              <h1 className="commentTitle">Comment</h1>
              <form className="commentForm" onSubmit={this.handleFormSubmit}>
                <textarea name="content" className='content' value={this.state.content} onChange={this.handleValueChange} placeholder="댓글을 입력하세요...."></textarea>
                <div className="commentInfo">
                  <input name="nickName" className="nickName" value={this.state.nickName} onChange={this.handleValueChange} type="text" placeholder="닉네임을 입력하세요...." maxlength="12" minlength="1"/>
                  <input name="pw" className="pw" value={this.state.pw} onChange={this.handleValueChange} type="password" placeholder="비밀번호를 입력하세요...." maxlength="24" minlength="4"/>
                </div>
                <button className='save' type="submit" onClick={this.handleClick}>Save</button>
              </form>
            </div>
        );
    }
}

class CommentList extends Component {

  constructor(props) {
    super(props);
    this.modify = this.modify.bind(this);
    this.delete = this.delete.bind(this);
    this.modifySave = this.modifySave.bind(this);
  }

  state = {
    comments: "",
    modifyContent: "",
  }

  componentDidMount(){
    this.callApi()
      .then(res => this.setState({comments: res}))
        .then(res => console.log(this.state.comments))
      .catch(err => console.log(err));
  }

  componentDidUpdate(prevProps) {
    //바로 이전의 props 와 바뀐 props가 다를 때만 호출된다. 이렇게 하지 않으면 무한루프에 빠진다.
    if (this.props.bno !== prevProps.bno) {
    this.callApi()
      .then(res => this.setState({comments: res}))
      .catch(err => console.log(err));
    }
  }

  callApi = async () => {
    const response = await fetch('/api/comment/?bno='+ this.props.bno);
    const body = await response.json();
    return body;
  }

  addPost = () => {
    const url = '/api/modify/comment';

    const formData = {
      'category' : this.state.category,
      'title' : this.state.title,
      'date' : this.getDate(),
      'content' : this.state.content,
      'image' : this.state.file
    }

    return post(url, formData);
  }

  modify = (e) => {
    if(jQuery('#modify' + e.target.value).css("display") == "none"){
        jQuery('#modify' + e.target.value).show();
    } else {
        jQuery('#modify' + e.target.value).hide();
    }
  }

  modifySave = (e) => {
    const url = '/api/modify/comment';

    const formData = {
      'id' : e.target.id,
      'content' : jQuery("#modify" + e.target.id + " textarea").val(),
    }
    if(jQuery("#modify" + e.target.id + " input").val() == e.target.value){
      post(url, formData)
        .then((response) => {
          console.log(response);
          this.callApi()
            .then(res => this.setState({comments: res}))
            .catch(err => console.log(err))
        })
        jQuery("#modify" + e.target.id + " input").val("") //비밀번호 input의 값을 비움
        if(jQuery('#modify' + e.target.id).css("display") == "none"){
            jQuery('#modify' + e.target.id).show();
        } else {
            jQuery('#modify' + e.target.id).hide();
        }
    }else{
      alert("비밀번호가 틀렸습니다.")
    }


    //alert("modifySave : " + e.target.value);
    //alert("modifyContent : " + jQuery("#modify" + e.target.id + " textarea").val());
    //alert("modifypw : " + jQuery("#modify" + e.target.id + " input").val());
  }

  delete = (e) => {
    if(jQuery('#delete' + e.target.value).css("display") == "none"){
        jQuery('#delete' + e.target.value).show();
    } else {
        jQuery('#delete' + e.target.value).hide();
    }
  }

  deleteSave = (e) => {
    const url = '/api/delete/comment';
    const formData = {
      'id' : e.target.id,
    }
    if(jQuery("#delete" + e.target.id + " input").val() == e.target.value){
      if (window.confirm("정말 삭제하시겠습니까??") == true){
        post(url, formData)
        .then((response) => {
          console.log(response);
          this.callApi()
            .then(res => this.setState({comments: res}))
            .catch(err => console.log(err))
        })
        jQuery("#delete" + e.target.id + " input").val("") //비밀번호 input의 값을 비움
        if(jQuery('#delete' + e.target.id).css("display") == "none"){
            jQuery('#delete' + e.target.id).show();
        } else {
            jQuery('#delete' + e.target.id).hide();
        }
      }

    }else{
      alert("비밀번호가 틀렸습니다.")
    }
      /*if (window.confirm("정말 삭제하시겠습니까??") == true){
          const url = '/api/delete/comment';
          const formData = {
            'id' : e.target.id,
          }
          post(url, formData)
            .then((response) => {
              console.log(response);
              this.callApi()
                .then(res => this.setState({comments: res}))
                .catch(err => console.log(err))
            })
      }*/
  }

  render() {
      return (
          <div className="commentList">
            {this.state.comments.length > 0 ?
              this.state.comments.map(c =>
                <div>
                  <div className="comment">
                    <div className="info"><span className="nickName">{c.nickname}</span><span className="date">{c.date}</span></div>
                    <div className='button'>
                      <button value={c.id} onClick={(e) => this.modify(e)}>수정</button>
                      <button value={c.id} onClick={(e) => this.delete(e)}>삭제</button>
                    </div>
                    <div className="commentContent">{c.content}</div>
                  </div>

                  <div className="deleteTextarea" id={"delete" + c.id}>
                    <span>비밀번호</span><input type="password"></input>
                    <button className="deleteButton" id={c.id} value={c.pw} onClick={(e) => this.deleteSave(e)}>삭제</button>
                  </div>

                  <div className="modifyTextarea" id={"modify" + c.id}>
                    <textarea>{c.content}</textarea><br/>
                    <span>비밀번호</span><input type="password"></input>
                    <button className="modifyButton" id={c.id} value={c.pw} onClick={(e) => this.modifySave(e)}>저장</button>
                  </div>
                </div>
                )
              : ""}

          </div>
      );
  }
}

export default CommentContainer;
