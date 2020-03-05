import * as React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './css/index.css';
import App from './App';
// import store from './store';
import * as serviceWorker from './serviceWorker';

const Root = (props) => {
    return (
        <Provider store={props.store}>
            <App/>
        </Provider>
    )
}
export default Root;
// ReactDOM.render(<Root store={store}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
