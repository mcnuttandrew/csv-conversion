import React from 'react';

import {csvParse} from 'd3-dsv';
import Dropzone from 'react-dropzone';

const STATE_MESSAGES = {
  initial: 'CSV TO JSON COVERTER',
  processing: 'WORKING>>>',
  complete: 'JOB DONE! FILE DOWNLOADED',
  error: 'SOMETHING WENT WRONG!'
}

import ReactGA from 'react-ga';

export default React.createClass({
  displayName : 'App',

  getInitialState() {
    return {
      dragging: false,
      state: 'initial'
    };
  },

  componentDidMount: function componentDidMount() {
    ReactGA.event({
      category: 'CSV2JSON',
      action: 'Page was loaded'
    });
  },

   _onFileLoad(oldFileName) {
    return ({target: {result}}) => {
      const newFileName = `${oldFileName.includes('csv') ? oldFileName.split('.csv')[0] : oldFileName}.json`;
      const parsedJson = csvParse(result);
      const json = JSON.stringify(parsedJson, newFileName);

      const blob = new Blob([json], {type: "octet/stream"});
      const url = window.URL.createObjectURL(blob);

      this.refs.hiddenLink.setAttribute('href', url);
      this.refs.hiddenLink.setAttribute('download', newFileName);
      this.refs.hiddenLink.click();

      window.URL.revokeObjectURL(url);
      this.setState({state: 'complete'});
    }
  },

  onDrop(acceptedFiles, rejectedFiles) {
    this.setState({dragging: false});
    const file = acceptedFiles[0];
    if (!file) {
      this.setState({state: 'error'});
      return;
    }
    this.setState({state: 'processing'});
    setTimeout(() => {
      const fileReader = new FileReader();
      fileReader.onload = this._onFileLoad(file.name);
      fileReader.readAsText(file);
    }, 10);
  },

  render() {
    const {dragging, state} = this.state;
    return (
      <div className={'app' + (dragging ? ' app-dragging' : '')}>
        <Dropzone
          onDragEnter={() => this.setState({dragging: true})}
          onDrop={this.onDrop}
          className="drop-target">
          <div className="page-title">{STATE_MESSAGES[state]}</div>
          <div className="page-explanation">(DROP A FILE OR CLICK ANYWHERE TO BEGIN)</div>
          <a className="hidden-link" ref='hiddenLink'/>
        </Dropzone>
      </div>
    );
  }
});
