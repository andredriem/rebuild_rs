import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Container, Row, Tooltip } from 'react-bootstrap';
import { Map } from './components/Map';
import { Topic } from './components/Topic';
import { LoginModal } from './components/LoginModal';
import { LoginData, useLoginData, useShowLoginModal } from './states';

function App() {
  // The app is set at at maximum height (100vh),
  // there are two main components the map and the sidebar
  // they are in a grid system, the sidebar gets 1/4 of the width
  // and the map gets 3/4

  const { loginData, setLoginData } = useLoginData();
  const { setShowLoginModal } = useShowLoginModal();
  const [loginCheck, setLoginCheck] = React.useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const response = await fetch('/forum/session/current.json');

      let data = null;
      try {
        data = await response.json();
      } catch (error) {
        console.log(`Failed to parse response: ${error}`);
        setLoginCheck(true);
        return;
      }
      if (response.ok) {
        console.log('Logged in')
        console.log(data);
        const newLoginData: LoginData = {
          username: data.current_user.username,
          avatarTemplate: data.current_user.avatar_template,
          email: data.current_user.email,
          userId: data.current_user.id
        }

        console.log('newLoginData', newLoginData);
        setLoginData(newLoginData);
      } else {
        setLoginCheck(true);
      }
      setLoginCheck(true);
    }
    checkLogin();
  }, [loginCheck]);

  if (!loginCheck) {
    return <div>Loading...</div>
  }

  const handleLogoutRequest = async () => {
    if (loginData === null || loginData.username === null) {
      return;
    }
    const username = loginData.username;

    // http://localhost:4200/forum/session/a11 (last part is loginData.username)
    console.log(`/forum/session/${username}/delete_session.json`);
    const response = await fetch(`/forum/session/${username}/delete_session`, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });


    let data: any = null;
    try{
      data = await response.json();
    } catch (error) {
      console.log(`Failed to parse response: ${error}`);
      return;
    }
    if (response.ok) {
      setLoginData(null);
    } else {
      console.log(`Failed to logout: ${data.error}`);
    }
  }

  let loginLoggoutButton = <></>;
  if (loginData) {
    loginLoggoutButton = <Button
      variant="link"
      onClick={handleLogoutRequest}
    >
      Logout
    </Button>
  } else {
    loginLoggoutButton = <Button
      variant="link"
      onClick={() => setShowLoginModal(true)}
    >
      Login
    </Button>
  }



  return <>
    <Container fluid={true} style={{ height: '100vh', marginLeft: 20, padding: 0 }}>
      <LoginModal />
      <Row>
        <Col xs={5}>
          <Row>
            <Topic />
          </Row>
          <Row>
            {loginLoggoutButton}
          </Row>
        </Col>
        <Col xs={7}>
          <Map />
        </Col>
      </Row>

    </Container>
  </>

}

export default App;
