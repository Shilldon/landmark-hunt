import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import * as messagesFunc from '../utils/message-updates'





function Leaderboard(props) {
    const playersArray = props.players
    const currentLandmark = props.landmark
    const landmarkHasBeenFound = props.landmarkHasBeenFound;
    return (
        <>
            <Row className="leaderboard align-items-center mb-2">
                <Col md={12} className=" leaderboard-title align-items-center d-flex justify-content-center">Leaderboard</Col>
                <Row className="leaderboard-header ">
                    <Col md={3} className="d-flex justify-content-center">
                        Name
                    </Col>
                    <Col md={2} className="d-flex justify-content-center">
                        Score
                    </Col>
                    <Col md={7} className="d-flex justify-content-center">
                        Landmarks Found
                    </Col>
                </Row>

                {playersArray.map((player, index) => (
                    <Row key={index}>
                        <Col md={3} className="d-flex justify-content-center">
                            {player.name}
                        </Col>
                        <Col md={2} id={`${player.name.toLowerCase()}-score`} className="d-flex justify-content-center">
                            {player.score}
                        </Col>
                        <Col md={7} className="d-flex justify-content-center">
                            {Object.entries(JSON.parse(player.landmarks_found)).map(([landmark, medal]) => (                                                                                              
                                landmark !== currentLandmark ||  (landmark === currentLandmark && landmarkHasBeenFound === true) ? <img key={landmark} style={({ height: "20px" })} className={`${medal}-icon px-1`} src={`./images/icon-${landmark.replace(/ /g, "-")}.png`} alt={`${messagesFunc.titleCase(landmark)}`}></img>
                                    : null
                            ))}
                        </Col>
                    </Row>
                ))}

            </Row>

        </>
    )
}

export default Leaderboard;