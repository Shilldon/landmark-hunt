import React from 'react';
//import { startAnimation } from '../utils/map-events';

function Scanner() {
   
  
//startAnimation();
    /*
    const [lat, setLat] = useState();
    const [lng, setLng] = useState();
    //const scanner = document.getElementById("scanner");
    //const mapContainer = document.getElementById("map");

    useEffect(() => {
        
        const interval = setInterval(function() {
           /* if(scanner!=null) {
                let mapHeight=mapContainer.offsetHeight;
                let mapWidth=mapContainer.offsetWidth;
                let scannerHeight = scanner.offsetHeight;
                let scannerWidth = scanner.offsetWidth;
                //let lat = (Math.random()*mapWidth)-scannerWidth;
                //let lng = (Math.random()*mapHeight)-scannerHeight;

                let lat = (58.727300 - 51.1788381996643)/8.75612 * mapHeight-scannerHeight;
                let lng = -(-12.666099 +1.82617277730141)/16.589355 * mapWidth-scannerWidth;

                if(lat<0) { lat = 0 }
                if(lng<0) {lng = 0 }
                setLat(lat+"px");
                setLng(lng+"px");
            }                */
            /*
                const lat = 57.927300 - (Math.random() * 8.25612)
                const lng = -12.066099 + (Math.random() * 15.059355)
                setLat(lat);
                setLng(lng);
             //   moveFeature([lat,lng])
        },2000);*/
    /*
        return () => clearInterval(interval);*/
            
    //})

 

    return (
        <>
    {/*}    <div id="scanner" style={({height:"75px",width:"75px",top:lng,left:lat,transitionDuration:"0.75s",display:"grid", gridTemplateColumns:"repeat(4, 1fr)",gridTemplateRows:"repeat(4, 1fr)",position: "absolute",zIndex:"1"})}>
        <div style={({gridArea:"1 / 2 / 5 / 2", borderRight:"2px solid green"})}></div>
        <div style={({gridArea:"2 / 1 / 2 / 5", borderBottom:"2px solid green"})}></div>
        <div style={({gridArea:"2 / 2 / 4 / 4", borderRadius: "50%", border:"2px solid green"})}></div>


    </div>*/}
    </>
    )
}

export default Scanner;
