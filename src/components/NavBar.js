import React, { Component } from 'react';
import {Typeahead} from 'react-bootstrap-typeahead';
import { Navbar, Form, FormControl, Button } from 'react-bootstrap';

class NavBar extends Component {

  state = {
    selected: null
  }

  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Tempo Demo</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Typeahead
            onChange={(selected) => {
              this.setState({selected});
              if(selected.length === 1) this.props.showUser(selected[0]);
            }}
            options={this.props.users}
            selected={this.state.selected}
            labelKey="fullName"
          />
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default NavBar;
