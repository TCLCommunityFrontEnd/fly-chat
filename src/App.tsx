import React, { useCallback } from 'react';
import {useSelector,useDispatch} from 'react-redux';
import './css/App.css';
import Chat from './components/Chat/index';
import action from 'action/app';

const logo = require('./logo.svg');

const App = () => {
  const {show} = useSelector((state:any)=>state.Chat);
  const dispatch = useDispatch();

  React.useEffect(()=>{
    dispatch(action.getLoginUserInfo());
    action.updateMapStorage();
  },[])

  const handleShowState = useCallback(()=>{
    if(show){
      dispatch({type:'CHAT_CLOSE'});
    }else{
      dispatch({type:'CHAT_SHOW'});
    }
  },[show])
  return (
    // <div className="App">
    //   <header className="App-header">
    //     {/* <img src={logo} className="App-logo" alt="logo" />
    //     <a onClick={handleShowState}>open chat</a> */}
    //     <Chat/>
    //   </header>
    // </div>
    <div style={{fontSize:25}}>
    <Chat/>
    </div>
  );
}

export default App;
