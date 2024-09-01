import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import supabase from '../utils/supabase'
import * as database from '../utils/database-query'


async function signOut() {
    const data = await database.getUser();
    await supabase
        .from("players")
        .update({ "logged_in": false })
        .eq("user_id", data.data.user.id).then(function () {
            supabase.auth.signOut()
        })
}


function LogoutButton() {
    return (
        <Button onClick={signOut} style={({margin:"5px 0 5px 0"})} className="button-submit" variant="outline-secondary">
            Log Out
        </Button>
    )
}

function Top() {

    const [session, setSession] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])


    return (
        <Container className="h-25" fluid>
            <Row style={({ height: "20%" })}>
                <Col md={12} className="h-100 d-flex justify-content-end" style={({ backgroundColor: "#0c1b39" })}>
                    {!session ? <></> : <LogoutButton />}
                </Col>
            </Row>
            <Row style={({ height: "30%" })}>
                <Col md={4} className="h-100 d-flex justify-content-end align-items-center">
                    <img alt="logo" className="h-100" src="./images/im-logo.png"></img>
                </Col>
                <Col md={({span:"4"})} className="h-100 d-flex justify-content-center align-items-center" style={({ fontSize: "3em", color: "#0c1b39", fontWeight: "500" })}>
                    <span>IM Landmark Hunt</span></Col>
            </Row>
            <Row className="h-50 align-items-end" >
                <Col className="h-100" md={2} style={({ backgroundColor: "#0c1b39", borderRadius: "100% 0 0 0" })}></Col>
                <Col className="h-100 d-flex justify-content-center align-items-center" md={8} style={({ backgroundColor: "#0c1b39" })}>
                    <span className="clue-message"></span>
                </Col>
                <Col className="h-100" md={2} style={({ backgroundColor: "#0c1b39" })}></Col>
            </Row>
        </Container>
    )
}

export default Top;