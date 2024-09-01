import { useEffect, useState } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import ClueInput from './ClueForm.js';
import * as database from '../utils/database-query.js';


function Clues() {

    async function requestHint(event) {
        event.preventDefault();
        returnHint(event.target.id.replace("hint-",""));
    }

    const [cluesArray, setClues] = useState([]);

    useEffect(() => {
        getClues();
    }, []);

    const rows = [];
    for (let i = 0; i < cluesArray.length; i++) {
        rows.push(
            <Row key={i}>
                <Col className="clue" md={{ span: 8, offset: 1 }}>{cluesArray[i]}</Col>
                <Col className="clue-mark" md={1}>
                    <span id={`clue-mark-${i+1}`} className="material-symbols-outlined">

                    </span>
                </Col>
            </Row>
        )
        rows.push(
            <Row className="mb-1" key={i + 10}>
                <Col md={{ span: 10, offset: 1 }}>
                    <ClueInput index={i} />
                </Col>
            </Row>
        )
        rows.push(
            <Row className="mb-1" key={i + 100}>
                <Col md={({ span: 4, offset: 1 })}>Letters:<span id={`letters-${i+1}`}> ?</span></Col>
                <Col md={7}><span id={`word-${i+1}`}></span></Col>
            </Row>
        )
        rows.push(
            <Row className="mb-3" key={i + 1000}>
                <Col md={{ span: 2, offset: 1 }}>
                    <Button onClick={requestHint} className="button-submit" variant="outline-secondary" key={`hint-${i + 1}`} id={`hint-${i + 1}`}>
                        Hint?
                    </Button>
                </Col>
            </Row>
        )
    }

    async function getClues() {
        let questionNumber = await database.checkQuestionNumber();
        await database.getClues(questionNumber).then(function (results) {
            setClues(results.split(","));
        });
    }

    async function  returnHint(clueNumber) {
        let questionNumber = await database.checkQuestionNumber();
        await database.getAnswers(questionNumber).then(function(results) {
            let answerArray = results.split(",");
            let answer = answerArray[parseInt(clueNumber)-1];
            checkHintsUsed(answer,clueNumber);
        })
    }

    async function checkHintsUsed(answer,clueNumber) {
        const { data: { user } } = await database.getUser()
            await database.getPlayerDetails(user.id).then(function(data){
                let hintsUsedArray = data.hints_used.split(',');
                let hintsUsed = parseInt(hintsUsedArray[parseInt(clueNumber)-1]);
                let score = parseInt(data.score);
                switch(hintsUsed) {
                    case 0:
                        document.getElementById(`letters-${clueNumber}`).innerHTML = ` ${answer.length}`;
                        hintsUsedArray[parseInt(clueNumber)-1] = hintsUsed+1;
                        score=score-5;
                        updateUserHintsUsed(user.id,hintsUsedArray.toString(),score)
                    break;
                    case 1:
                        let word = `${answer[0].toUpperCase()}`;
                        for(let i=1;i<answer.length;i++) {
                            word = word+" _";
                        }
                        document.getElementById(`word-${clueNumber}`).innerHTML = word;
                        hintsUsedArray[parseInt(clueNumber)-1] = hintsUsed+1;
                        score=score-5;
                        updateUserHintsUsed(user.id,hintsUsedArray.toString(),score)    
                    break;       
                    default:
                        let currentWord = document.getElementById(`word-${clueNumber}`).innerHTML;
                        currentWord = currentWord.replace(/\s/g, "");
                        let blankSpaces = getAllIndexes(currentWord,"_") 
                        if(blankSpaces.length>0) {
                            let index = blankSpaces[Math.floor(Math.random()*blankSpaces.length)];
                            let letter = answer[index];
                            let currentWordArray = currentWord.split("")
                            currentWordArray[index] = letter;
                            currentWord = currentWordArray.join(" ");                          
                            document.getElementById(`word-${clueNumber}`).innerHTML = currentWord;
                            hintsUsedArray[parseInt(clueNumber)-1] = hintsUsed+1;
                            score=score-5;
                            updateUserHintsUsed(user.id,hintsUsedArray.toString(),score)                        }
                    break;                                            
                }
            })
        
    }

    function getAllIndexes(arr, val) {
        var indexes = [], i = -1;
        while ((i = arr.indexOf(val, i+1)) !== -1){
            indexes.push(i);
        }
        return indexes;
    }

    async function updateUserHintsUsed(user,hintsUsed,score) {
        if(score < 0 ) { score = 0 }
        await database.updateHintsUsed(user,hintsUsed,score).then(function(data) {
            console.log(data)
        })        
    }

    return (
        <Row className="clues h-100 d-flex justify-content-center align-items-center">
            <Col className="align-items-center" md={12}>
                <Row className=" align-items-center mb-2">
                    <Col className="clue-title align-items-center d-flex justify-content-center" md={12}>Clues</Col>
                </Row>
                {rows}
            </Col>
        </Row>

    );
}

export default Clues;