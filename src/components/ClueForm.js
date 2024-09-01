import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';


import * as database from '../utils/database-query.js';
import * as map from '../utils/map-events.js';

async function zoomMap(questionNumber) {
    await database.getCoords(questionNumber).then(function(results) {
           map.RecenterMap(results.coords,results.zoom, results.radius,results.landmark,JSON.parse(results.geojson),results.clue);
    })

}


function ClueInput({ index }) {
    const [guess, setGuess] = useState("");

    const submitGuess = (event) => {
        event.preventDefault();
        checkAnswer(index + 1);
        
    }

    async function checkAnswer(clueNumber) {
        let questionNumber = await database.checkQuestionNumber();
        const { data: { user } } = await database.getUser();
        const userId = user.id;
        //let score = await database.getScore(userId);

        await database.getAnswers(questionNumber).then(function (results) {
            let answerArray = results.split(',');
            let answer = answerArray[clueNumber - 1];
            if (guess.replace(/ /g, '').toLowerCase() === answer.toLowerCase()) {
                document.getElementById(`clue-mark-${clueNumber}`).innerHTML = "check";
                document.getElementById(`clue-input-${clueNumber}`).setAttribute("disabled","true")
                document.getElementById(`guess-${clueNumber}`).setAttribute("disabled","true")
                document.getElementById(`hint-${clueNumber}`).setAttribute("disabled","true")
                document.getElementById(`clue-mark-${clueNumber}`).classList.add("correct");
                let correctAnswers = document.getElementsByClassName("correct").length
                //score = score+10;
                database.setScore(userId,10);
                if(correctAnswers === 3) {
                    zoomMap(questionNumber);
                }
            }
            else {
                document.getElementById(`clue-mark-${clueNumber}`).innerHTML = "close";
            }
        });
    }  

    return (
        <>
            <InputGroup className="mb-3">

                <Form.Control
                    id={`clue-input-${index+1}`}
                    placeholder="Enter guess"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                />
                <Button onClick={submitGuess} className="button-submit" variant="outline-secondary" id={`guess-${index + 1}`}>
                    Submit
                </Button>
            </InputGroup>

        </>
    )
}

export default ClueInput;
