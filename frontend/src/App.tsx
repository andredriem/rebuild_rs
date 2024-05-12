import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row, Tooltip } from 'react-bootstrap';
import { Map } from './components/Map';
import { Topic } from './components/Topic';

function App() {
  // The app is set at at maximum height (100vh),
  // there are two main components the map and the sidebar
  // they are in a grid system, the sidebar gets 1/4 of the width
  // and the map gets 3/4
  return <>
    <Container fluid={true} style={{ height: '100vh', margin: 0, padding: 0, marginTop: '20px'}}>
      <Row>
        <Col xs={3}>
          <div>
            <Topic />
          </div>
        </Col>
        <Col xs={9}>
          <Map />
        </Col>
      </Row>

    </Container>
  </>

}

export default App;
