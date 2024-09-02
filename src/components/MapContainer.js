import React from 'react';
import { useEffect } from 'react'

import Col from 'react-bootstrap/Col';

import Scanner from './Scanner';
import TimeComponent from './TimeComponent';
import Awards from './Awards.js'
import map from  '../utils/map-events'

function MapContainer(props) {
const counter = props.showTimer;
const showAwards = props.landmarkHasBeenFound;
const finders = props.finders;
    useEffect(() => {
        map.setTarget("map")
        return () => map.setTarget(null)

    });

    if(showAwards === true) {
        document.getElementById("trophy").style.display = "none";
    }

    return (
        <Col id="map-container" md={6} className="p-0" style={({ overflow: "hidden", position: "relative" })}>
            {showAwards === true ? <Awards finders={finders}/> : null}
            <img id="trophy" alt="trophy" src="./images/gold.png"></img>
            <img id="landmark-image" alt="Landmark" src="./images/stonehenge-large.jpg" style={({position:"absolute",display:"none",zIndex:"2",height:"100%",width:"100%"})}></img>
            <Scanner />
            {counter > 0 ? <TimeComponent counter={counter}/> : ""}           
            <div id="map" className="h-100 w-100">
            </div>

        </Col>

    )
}

export default MapContainer;
