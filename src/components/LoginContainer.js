import React, { useState } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form'

import supabase from '../utils/supabase'




export default function LoginPage() {
  const [name, setEmail] = useState('Emma')
  const [password, setPassword] = useState('')


  const items = ["Beth", "Debbie", "Emma", "Gemma", "Jules", "Lauren", "Michal", "Rebecca", "Sarah B", "Sarah P", "Sophia"];

  const handleLogin = async (event) => {
    event.preventDefault()
    let email = name.toLowerCase() + "@imlandmark.com";
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.log(error)
      document.getElementById("password-error").style.display="block";
    }
    else {
      document.getElementById("password-error").style.display="none";

    }
  }

  return (

    <Col md={7} className="p-0">
      <Row style={({ height: "20%" })} className="d-flex align-items-center">
        <Col md={12} className="d-flex justify-content-center">
          <span style={({ fontSize: "2em", color: "#0c1b39", fontWeight: "500" })}>Log In To Access Map</span>
        </Col>
      </Row>
      <Row style={({ height: "60%" })} className="d-flex align-items-center">
        <Col md={{ span: 6, offset: 3 }}>


          <Dropdown className="mb-3">
            <Dropdown.Toggle variant="success">Select Player</Dropdown.Toggle>
            <Dropdown.Menu>
              {items.map((item,index) => (
                <Dropdown.Item key={index} onClick={() => setEmail(item)}>
                  {item}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
            <div className="mt-3">Log in as: {name}</div>
          </Dropdown>
          <Form.Group>

          <Form.Label>Password</Form.Label>

            <Form.Control
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div style={({height: "1vh"})}><span id="password-error" style={({display:"none", color:"red"})}>Wrong password</span></div>
          </Form.Group>
          <Button onClick={handleLogin} className="mt-5 button-submit" variant="outline-secondary">
            Log In
          </Button>
        </Col>
      </Row>
    </Col>




  )
}


