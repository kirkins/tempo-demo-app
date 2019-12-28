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
    return(
      <Modal
        size="lg"
        show={this.props.show}
        onHide={this.props.onHide}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            {this.props.user ? this.props.user.fullName : null}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ID: {this.props.user ? this.props.user.id : null}
          <br/>
          First: {this.props.user ? this.props.user.name.first : null}
          <br/>
          Last: {this.props.user ? this.props.user.name.last : null}
          <br/>
          Team: {this.props.user ? this.props.user.teams[0].name : null}
        </Modal.Body>
      </Modal>
    );
  }

}

export default DetailsModal;
