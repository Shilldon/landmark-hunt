import Container from "react-bootstrap/esm/Container"
import Row from "react-bootstrap/esm/Row"
import Col from "react-bootstrap/esm/Col"

function Messages(props) {
    let messages = props.messages;
    return (
        <Container style={({ height: "100%", width: "100%" })}>
            <>
                <Row style={({ height: "10%" })}>
                    <Col md={12} style={({ height: "100%", backgroundColor: "0c1b39" })}>

                    </Col>
                </Row>
                <Row style={({ height: "80%" })}>

                    <Col md={12} style={({ height: "100%", border: "4px solid #0c1b39", backgroundColor: "white" })}>
                        <>

                            {messages[0].map((message, index) => (


                                <p key={index}> {message}</p>


                            ))}
                        </>
                    </Col>
                </Row>

                <Row style={({ height: "10%" })}>
                    <Col md={12} style={({ height: "100%", backgroundColor: "0c1b39" })}>

                    </Col>
                </Row>
            </>

        </Container>
    )
}

export default Messages;