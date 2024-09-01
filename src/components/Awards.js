import Row from "react-bootstrap/esm/Row"
import Col from "react-bootstrap/esm/Col"
function Awards(props) {
    const finders = props.finders;
    return (
        <Row className="w-100" style={({zIndex:"5", position:"absolute"})}> 
            {finders.map((finder, index) => (
                <Col key={index} md={4}>
                    <Row>
                        <Col className="d-flex justify-content-center medal-container" md={12}>
                        {index === 0 ? 
                            <img alt="trophy" src="./images/gold.png"></img> : 
                        index === 1 ? 
                        <img alt="trophy" src="./images/silver.png"></img> : 
                        <img alt="trophy" src="./images/bronze.png"></img>}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex justify-content-center"  md={12}>
                            <span className="award">{finder}</span>
                        </Col>
                    </Row>
                </Col>
            ))}

        </Row>
    )
}

export default Awards;