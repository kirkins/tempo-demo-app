import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

class DetailsModal extends Component {

  state = {
    mode: "user",
    data: {}
  }

  constructor(props){
    super(props);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount () {
    this.setState({
      show: this.props.show,
      mode: this.props.mode,
      data: this.props.data
    });
  }

  closeModal () {
    this.setState({show: false});
  }

  render () {
    let teamList;
    if(this.props.team) {
      let showUser = (user) => this.props.showUser(user);
      teamList = this.props.team.members.map((m) =>
                         <li onClick={() => showUser(m)}>{m ? m.fullName : null}</li>
                       );
    }

    return(
      <Modal
        size="lg"
        show={this.props.show}
        onHide={this.props.onHide}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            {this.props.team ? this.props.team.name : null}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b>Lead: {this.props.lead ? this.props.lead.fullName : null}</b>
          {teamList}
        </Modal.Body>
      </Modal>
    );
  }

}

export default DetailsModal;
