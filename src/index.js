/* React Imports */
import React                 from 'react';
import ReactDOM              from 'react-dom';

/* JS */
import App                   from './js/App';
import registerServiceWorker from './js/registerServiceWorker';

/* CSS */
import './css/index.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
