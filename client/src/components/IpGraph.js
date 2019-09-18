import React, { Component } from 'react';
import './IpGraph.css';
import { XYPlot, LineSeries,
        HorizontalGridLines, VerticalGridLines,
        XAxis, YAxis } from "react-vis";

class IpGraph extends Component {

  state = {
    ipData: "", //오늘의 아이피를 가져와서 담음
    date: "" //그래프에 그릴 때 사용할 데이터들을 담음
  }

  callApi = async (date) => { //date input에서 지정한 date값을 파라미터로 받아서 서버쪽에 그래프에 그릴 데이터를 요청한다.
    const response = await fetch('/api/ip/data/?date='+date);
    const body = await response.json();
    console.log(body);
    return body;
  }

  handleValueChange = (e) => { //date input의 value 값이 바뀔 때 마다 호출된다.
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState); //바뀐 값을 다시 state값에 넣어준다.

      this.callApi(e.target.value) //바뀔 때마다 이 함수를 실행해서  계속 그래프 모양을 바꿔준다.
        .then(res => this.setState({ipData: res}))
        .catch(err => console.log(err));
  }

  render() {

    return (
      <div className="ipGraph">
        <input name="date" type='date' value={this.state.date} onChange={this.handleValueChange}/>
        <span>  접속자 동향 그래프</span>
        {this.state.ipData ?
          <XYPlot xType={'ordinal'} width={500} height={350}>
            <LineSeries
              data={this.state.ipData}
              strokeStyle={"solid"}
              stroke={"#bcbcbc"}
            />
          <HorizontalGridLines/>
          <VerticalGridLines/>
          <XAxis/>
          <YAxis/>
          </XYPlot>
           : ""}

      </div>
    );
  }
}

export default IpGraph;
