import React from 'react';
import ReactDOM from 'react-dom';
import { configure } from 'mobx';
import App from './App';

// 配置MobX
configure({
    enforceActions: 'observed'
});

ReactDOM.render(<App />, document.getElementById('root')); 