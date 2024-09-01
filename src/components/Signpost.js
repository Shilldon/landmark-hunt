import { useEffect, useState } from "react";

import Row  from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function Signpost(props) {
    const [counter, setCounter] = useState(props.counter);    
    useEffect(() => {
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    
      });
return (
    <div id="next-question-countdown">
    <Row className="h-50 d-flex align-items-center" >
        <Col className="mx-2 h-50" md={12}>
            Next Question
        </ Col>
    </ Row>
    <Row className="h-50 h-50">
        <Col md={2} className="mx-2 px-0 d-flex justify-content-end h-100" id="countdown-number">
            {props.counter}
        </Col>
        <Col md={3} className="px-0 d-flex justify-content-start h-100">
            miles
        </Col>
    </Row>
</div>
)
}

export default Signpost