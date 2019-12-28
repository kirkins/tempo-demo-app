import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';

class TeamCard extends Component {
  render() {
    let leadName = null;
    if(this.props.lead) {
      leadName = this.props.lead.hasOwnProperty("name") ? this.props.lead.name.first + " " + this.props.lead.name.last : null;
    }
    const showTeam = () => {
      this.props.showTeam(this.props.team)
    }
    return (
      <Card key={this.props.team.id}>
        <Card.Body>
          <Card.Title>{this.props.team.name}</Card.Title>
          <p className="card-text"><b>Team Lead:</b> { leadName }</p>
          <p className="card-text">{ this.props.team.members ? this.props.team.members.length : 0 } members</p>
          <Button
            onClick={showTeam}
            disabled={!this.props.showTeam}
            variant="primary"
          >
            More Info
          </Button>
        </Card.Body>
      </Card>
    )
  }
}

export default TeamCard;
