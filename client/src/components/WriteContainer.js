import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { post } from 'axios';
import './WriteContainer.css';
import song from '../img/song.png';

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {stateToHTML} from 'draft-js-export-html';

class WriteContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      category: '',
      title: '',
      content: '',
      file: null,
      fileName: '',
      editorState: EditorState.createEmpty(),
    }
  }

//오늘 날짜를 얻어오는 함수
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

//값들을 저장하기 위해 서버로 전송하는 함수
  addPost = () => {
    const url = '/api/save';
    const formData = new FormData();

    formData.append('category', this.state.category)
    formData.append('title', this.state.title)
    formData.append('date', this.getDate())
    //editorState에서 json값을 스트링으로 변환하는 과정
    formData.append('content', JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())))
    formData.append('image', this.state.file)

    /*const formData = {
      'category' : this.state.category,
      'title' : this.state.title,
      'date' : this.getDate(),
      'content' : this.state.content,
      'image' : this.state.file
    }*/

    //폼 데이터에 이미지파일이 들어있기 때문에 컨텐트 타입을 따로 정의해서 보내준다.
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    return post(url, formData, config);
  }

//form 데이터를 submit하면 호출되는 함수
  handleFormSubmit = (e) => {
    e.preventDefault();
    this.addPost()
      .then((response) => {
        console.log(response.data);
      })
    this.setState({ //제출 후에 state값을 모두 초기화
      category: '',
      title: '',
      content: '',
      file: null,
      fileName: '',
      editorState: EditorState.createEmpty(),
    })
    this.props.history.push('/')
  }

//파일이 변경되었을 때 호출되는함수 (input태그)
  handleFileChange = (e) => {
    this.setState({
      file: e.target.files[0],
      fileName: e.target.value
    })
  }

//input태그들의 값이 변화했을 때 호출되는 함수
  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState); //해당 태그의 값을 해당 name에 맞는 state에 넣어준다.
  }


 //에디터에 글을 쓰거나 해서 상태가 변할 때 호출되는 함수
  onEditorStateChange: Function = (editorState) => {
      this.setState({
        editorState,
      });
      //console.log(stateToHTML(this.state.editorState.getCurrentContent()));
      //console.log(this.state.editorState.getCurrentContent().getPlainText());
    };

    //draft에디터에 이미지파일을 올리면 호출되는 함수
    uploadCallback = (file) =>  {
      return new Promise(
        (resolve, reject) => {

          const formData = new FormData();
          formData.append('image', file)

          const config = { //파일을 넣는 폼데이터이기 때문에
            headers: {
              'content-type': 'multipart/form-data' // 컨텐트 타입을 멀티파트로 정의
            }
          }

          //에디터에 올린 이미지파일을 업로드하기위해 post로 보냄
          post('/api/editorimage', formData, config)
          .then(function (response) {
            console.log(response.data); // 서버에서 업로드를 한 후에 이미지의 path를 받아옴
            resolve({ data: { link: response.data } });
          })
          .catch(function (error) {
          });
        }
      );
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
                {/*<textarea name="content" className='content' value={this.state.content} onChange={this.handleValueChange}></textarea>*/}
                <Editor
                  editorState={this.state.editorState}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  toolbar={{
                    embedded: {height: '300px', width: 'auto' },
                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },
                    image: { previewImage: true, urlEnabled: true, uploadEnabled: true, uploadCallback: this.uploadCallback}

                  }}
                  onEditorStateChange={this.onEditorStateChange}
                />
                <button className='save' type="submit">Save</button>
              </form>
            </div>
        );
    }
}

export default withRouter(WriteContainer);
