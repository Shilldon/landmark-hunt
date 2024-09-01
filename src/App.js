
import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Top from './components/TopBanner'
import Home from './components/Home'

function App() {

  return (
    <div className="App" style={({height:"100vh", width: "100vw"})}>
        <Top />
        <Home />


    </div>

  );
}

export default App;
