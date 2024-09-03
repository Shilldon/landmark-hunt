import React, { useState, useEffect, useRef } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Clues from './CluesContainer'
import LoginPage from './LoginContainer'
import MapContainer from './MapContainer';
import Leaderboard from './Leaderboard'
import Messages from './Messages';


import * as database from '../utils/database-query'
import supabase from '../utils/supabase';
import * as messagesFunc from '../utils/message-updates'
import * as mapFunc from '../utils/map-events'
function Home() {

  supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        table: 'players',
        event: 'UPDATE',
        schema: 'public',
      },
      (payload) => {
        getPlayers();
      }
    )
    .on(
      'postgres_changes',
      {
        table: 'current-landmark',
        event: 'UPDATE',
        schema: 'public',
      },
      (payload) => {
        const timesFound = payload.new.times_found.split(",").length;
        if (timesFound >= 3) {

          //send message to everyone that the landmark has been found
          messagesFunc.foundLandmarkMessage(payload);
          triggerFoundLandmark();
          //activate function to hide map and display the landmark
          //only to those who don't have the trophy showing
          //show landmark found (bronze silver gold) on scoreboard
          //message who found it
          setShowTimer(30);
          setTimeout(function () {

            document.getElementById("landmark-image").style.display = "none";
            document.getElementsByClassName("clue-message")[0].innerHTML = ``;
            setLandmarkFound(false);
            setFinders([]);
            incrementLandmark();

          }, 10000)

          //
        }
      }
    )
    .on(
      'postgres_changes',
      {
        table: 'messages',
        event: 'INSERT',
        schema: 'public',
      },
      (payload) => {
        console.log(payload)
        setupMessage(payload.new.message, payload.new.id, payload.new.user_id);
      }
    )
    .subscribe()

  async function incrementLandmark() {
    await database.setCurrentLandmark();
  }

  async function triggerFoundLandmark() {
    await database.playersFoundLandmark().then(function (results) {
      setLandmarkFound(true);
      setFinders(results.split(","));
    });
  }

  const [showTimer, setShowTimer] = useState(0);
  const [session, setSession] = useState(null)
  const [playersArray, setPlayers] = useState([]);
  const [currentLandmark, setCurrentLandmark] = useState(1);
  const [landmarkHasBeenFound, setLandmarkFound] = useState(false);
  const [finders, setFinders] = useState([]);
  const [messages, setMessage] = useState([]);
  const [fadeout, setFadeout] = useState(true);
  const [delay, setDelay] = useState(7000);
const [firstRun,setMessageActive] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        getCurrentLandmark();
        getPlayers();
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)

      if (session) {
        getCurrentLandmark();
        getPlayers();
      }
    })
  }, [])

  useEffect(() => {
    
  }, [])

  async function setupMessage(newMessage, messageID, messageFrom) {
    console.log(newMessage)
    const { data: { user } } = await database.getUser(); //get the user
    const userId = user.id;
    console.log(userId,messageFrom)
    if (messageFrom !== userId) {
      setMessageActive(true);
      setMessage([...messages, newMessage])
      setFadeout(false);
      setDelay(delay + 7000);
      setTimeout(function () {
        setFadeout(true);
      }, delay)
    }

    await database.deleteMessage(messageID);
  }

  async function checkIfFoundLandmark(landmark) {
    const { data: { user } } = await database.getUser(); //get the user
    const userId = user.id;
    const player = await database.getPlayerDetails(userId); // get the player's name etc.
    const landmarksFound = Object.keys(JSON.parse(player.landmarks_found));
    if (landmarksFound.includes(landmark)) {
      mapFunc.playerFoundLandmark(landmark, false);
    }
  }

  async function getCurrentLandmark() {
    const currentQuestion = await database.checkQuestionNumber();
    await database.getCurrentLandmark(currentQuestion).then(function (data) {
      setCurrentLandmark(data.toLowerCase());
      checkIfFoundLandmark(data.toLowerCase());
    })
  }


  async function getPlayers() {
    await database.getPlayers().then(function (results) {
      //compare sorts into order by score
      //only logged in players are returned
      setPlayers(results.data.sort(messagesFunc.compare))
    })
  }

  return (
    <>
      <Container fluid className="h-75">
        <Row className="h-100">
          <Col className="h-100" style={({ backgroundColor: "#0c1b39" })} md={3}>
            {!session ? "" : <Clues />}
          </Col>
          {!session ? <LoginPage /> : <MapContainer finders={finders} landmarkHasBeenFound={landmarkHasBeenFound} showTimer={showTimer} key={session.user.id} session={session} />}
          <Col className="h-100" style={({ backgroundColor: "#0c1b39" })} md={3}>
            {!session ? "" : playersArray.length ? <Leaderboard landmarkHasBeenFound={landmarkHasBeenFound} landmark={currentLandmark} players={playersArray} /> : null}
          </Col>
        </Row>
      </Container>
      {session ?
        firstRun ?
        <div className={fadeout ? "hidemessage message-container" : "showmessage message-container"} >
          {<Messages messages={[messages]} />}
        </div> : null
         : null
      }
    </>
  )
}


export default Home;