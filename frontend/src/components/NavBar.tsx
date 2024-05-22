// NavBar.js
import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { LoginLoggoutButton } from './LoginLogoutButton';

function NavBar() {
  return (
    <Navbar bg="light" expand="lg" style={{ zIndex: 1001 }}>
      <Navbar.Brand href="/" style={{ marginLeft: '20px', display: 'flex', alignItems: 'center' }}>
        <img
          src={process.env.PUBLIC_URL + "/logo192.png"}
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="Logo"
        />
        <span className='font-weight-bold'  style={{ marginLeft: '10px' }}>Reconstrói RS</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          <Nav.Link href="/forum/latest">Forum</Nav.Link>
          <Nav.Link href="/forum/t/topico-para-feedbackl/14">Feedback</Nav.Link>
          <LoginLoggoutButton />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
