import React from "react";
import accurateInterval from './accurateInterval';
import TimerLengthControl from "./TimerLengthControl";
import soundFile from '../assets/buzzer-or-wrong-answer-20582.mp3'
import Footer from "./Footer";


export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brkLength: 5,
      seshLength: 25,
      timerState: "stopped",
      timerType: "Session",
      timer: 1500,
      intervalID: "",
      alarmColor: { color: "white" },
    };
  }

  setBrkLength = (e) => {
    this.lengthControl(
      "brkLength",
      e.currentTarget.value,
      this.state.brkLength,
      "Session"
    );
  };

  setSeshLength = (e) => {
    this.lengthControl(
      "seshLength",
      e.currentTarget.value,
      this.state.seshLength,
      "Break"
    );
  };

  lengthControl = (stateToChange, sign, currentLength, timerType) => {
    if (this.state.timerState === "running") {
      return;
    }
    if (this.state.timerType === timerType) {
      if (sign === "-" && currentLength !== 1) {
        this.setState({ [stateToChange]: currentLength - 1 });
      } else if (sign === "+" && currentLength !== 60) {
        this.setState({ [stateToChange]: currentLength + 1 });
      }
    } else if (sign === "-" && currentLength !== 1) {
      this.setState({
        [stateToChange]: currentLength - 1,
        timer: currentLength * 60 - 60,
      });
    } else if (sign === "+" && currentLength !== 60) {
      this.setState({
        [stateToChange]: currentLength + 1,
        timer: currentLength * 60 + 60,
      });
    }
  };

  timerControl = () => {
    if (this.state.timerState === "stopped") {
      this.beginCountDown();
      this.setState({ timerState: "running" });
    } else {
      this.setState({ timerState: "stopped" });
      if (this.state.intervalID) {
        this.state.intervalID.cancel();
      }
    }
  };

  beginCountDown = () => {
    this.setState({
      intervalID: accurateInterval(() => {
        this.decrementTimer();
        this.phaseControl();
      }, 1000),
    });
  };

  decrementTimer = () => {
    this.setState({ timer: this.state.timer - 1 });
  };

  phaseControl = () => {
    let timer = this.state.timer;
    this.warning(timer);
    this.buzzer(timer);
    if (timer < 0) {
      if (this.state.intervalID) {
        this.state.intervalID.cancel();
      }
      if (this.state.timerType === "Session") {
        this.beginCountDown();
        this.switchTimer(this.state.brkLength * 60, "Break");
      } else {
        this.beginCountDown();
        this.switchTimer(this.state.seshLength * 60, "Session");
      }
    }
  };

  warning = (_timer) => {
    if (_timer < 61) {
      this.setState({ alarmColor: { color: "#7fff00" } });
    } else {
      this.setState({ alarmColor: { color: "white" } });
    }
  };

  buzzer = (_timer) => {
    if (_timer === 0) {
      this.audioBeep.play();
    }
  };

  switchTimer = (num, str) => {
    this.setState({
      timer: num,
      timerType: str,
      alarmColor: { color: "white" },
    });
  };

  clockify = () => {
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
  };

  reset = () => {
    this.setState({
      brkLength: 5,
      seshLength: 25,
      timerState: "stopped",
      timerType: "Session",
      timer: 1500,
      intervalID: "",
      alarmColor: { color: "white" },
    });
    if (this.state.intervalID) {
      this.state.intervalID.cancel();
    }
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  };

  render() {
    return (
      <div>
        <div className="main-title">25 + 5 Clock</div>
        <TimerLengthControl
          addID="break-increment"
          length={this.state.brkLength}
          lengthID="break-length"
          minID="break-decrement"
          onClick={this.setBrkLength}
          title="Break Length"
          titileID="break-lable"
        />
        <TimerLengthControl
          addID="session-increment"
          length={this.state.seshLength}
          lengthID="session-length"
          minID="session-decrement"
          onClick={this.setSeshLength}
          title="Session Length"
          titileID="session-lable"
        />
        <div className="timer" style={this.state.alarmColor}>
          <div className="timer-wrapper">
            <div id="timer-label">{this.state.timerType}</div>
            <div id="timer-left">{this.clockify()}</div>
          </div>
        </div>
        <div className="timer-control">
          <button id="start_stop" onClick={this.timerControl}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#5f6368"
              className="bi bi-play-cirle ibtnt"
            >
              <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#5f6368"
              className="bi bi-stop-cirle ibtnt"
            >
              <path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z" />
            </svg>
          </button>
          <button id="reset" onClick={this.reset}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#5f6368"
              className="ibtnt bi bi-arrow-repeat"
            >
              <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
            </svg>
          </button>
        </div>
        <Footer />
        <audio id="beep" preload="auto" ref={(audio)=>{this.audioBeep=audio;}} src={soundFile}></audio>
      </div>
    );
  }
}
