import React from 'react';

import {csvParse} from 'd3-dsv';

export default React.createClass({
  displayName : 'App',

  _onChange: function _onChange({target: {files}}) {
    const file = files[0];
    if (!file) {
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = this._onFileLoad;
    fileReader.readAsText(file);
  },

  _onFileLoad: function _onFileLoad({target: {result}}) {
    const fileName = 'file-name.json';
    const parsedJson = csvParse(result);
    const json = JSON.stringify(parsedJson, fileName);

    const blob = new Blob([json], {type: "octet/stream"});
    const url = window.URL.createObjectURL(blob);

    this.refs.hiddenLink.setAttribute('href', url);
    this.refs.hiddenLink.setAttribute('download', fileName);
    this.refs.hiddenLink.click();

    window.URL.revokeObjectURL(url);
  },

  render() {
    return (
      <div className="app">
        <div>Dumb CSV Uploader</div>
        <div>Simple client side csv to json conversion</div>
        <input
          type="file"
          ref="fileInput"
          onChange={this._onChange} />
        <a
          ref='hiddenLink'
          style={{display: 'none'}} />
      </div>
    );
  }
});
