import React from 'react';
import ReactDOM from 'react-dom';
import {browserHistory, Router, Route} from 'react-router';

import Root from './components/root.jsx';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/csv-conversion/" component={Root}></Route>
    <Route path="/csv-conversion" component={Root}></Route>
    <Route path="/" component={Root}></Route>
  </Router>
),  document.querySelector('.app-root'));
