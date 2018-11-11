import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter as Router} from 'react-router-dom';

import Index from './pages/index';
import Jacob from './pages/jacob';

const routing = (
    <Router>
        <div className="App">
            <Route exact path="/" component={Index} />
            <Route path="/jacob" component={Jacob} />
        </div>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));
