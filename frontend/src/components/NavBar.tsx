// NavBar.js
import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { LoginLoggoutButton } from './LoginLogoutButton';

function NavBar() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/" style={{ marginLeft: '20px' }}>
        <img
          src="/logo192.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="Logo"
        />
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
