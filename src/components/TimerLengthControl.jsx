import React from "react";

export default class TimerLengethControl extends React.Component {
  render() {
    return (
      <div className="length-control">
        <div id={this.props.titleID}>{this.props.title}</div>
        <button
          className="btn-level"
          id={this.props.minID}
          onClick={this.props.onClick}
          value="-"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#5f6368"
            className="bi bi-arrow-down-circle ibtnt"
          >
            <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
          </svg>
        </button>
        <div className="btn-level" id={this.props.lengthID}>
          {this.props.length}
        </div>
        <button
          className="btn-level"
          id={this.props.addID}
          onClick={this.props.onClick}
          value="+"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#5f6368"
            className="bi bi-arrow-up-circle ibtnt"
          >
            <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
          </svg>
        </button>
      </div>
    );
  }
}
