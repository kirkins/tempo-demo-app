import React, { Component } from "react";
import { ProgressBar, CardColumns, Container, Row } from "react-bootstrap";
import axios from "axios";
import NavBar from "./../components/NavBar";
import TeamCard from "./../components/TeamCard";
import TeamModal from "./../components/TeamModal";
import UserModal from "./../components/UserModal";

const initialState = {
  teams: [],
  users: [],
  userDetails: {},
  loading: true,
  teamOpen: false,
  selectedTeam: null,
  selectedUser: null
}

class Teams extends Component {

  async getTeams () {
    return await axios({
      method: "get",
      url: "https://tempo-exercises.herokuapp.com/rest/v1/teams"
    }).then((response) => {
      this.setState({
        teams: response.data,
        loading: false
      });
    }, (error) => {
      console.log(error);
    });
  };

  async getUsers () {
    return await axios({
      method: "get",
      url: "https://tempo-exercises.herokuapp.com/rest/v1/users"
    }).then((response) => {
      this.setState({
        users: response.data,
        loading: false
      });
    }, (error) => {
      console.log(error);
    });
  };

  async getTeamMembers () {
    let teams = this.state.teams;
    return await teams.forEach((t, i) => {
      let teamMembers = this.state.users.filter((u) => {
        return u.teamId === t.id;
      });
      teams[i].members = teamMembers;
    });
    this.setState({teams: teams});
  };

  async getUserDetails () {
    let leads = [];
    await this.state.teams.forEach(async (t, i) => {
      let u = {};
      u.userId = t.teamLead;
      if(t.teamLead) leads.push(u);
    });

    // make sure leads download first
    let users = [...leads, ...this.state.users];
    
    const uniqueUsers = [...new Set(users.map(u => u.userId))];
    let userDetails = {};
    //await uniqueUsers.forEach(async (u, i) => {
    for (const u of uniqueUsers) {
      if(!this.state.userDetails[u]) {
        await axios({
          method: "get",
          url: "https://tempo-exercises.herokuapp.com/rest/v1/users/" + u
        }).then((response) => {
          let update = this.state.userDetails;
          update[u] = response.data;
          update[u].fullName = response.data.name.first + " " + response.data.name.last;
          update[u].teams = this.state.teams.filter((t) => {
            return t.id === response.data.team;
          });
          this.setState({userDetails: update});
        }, (error) => {
          console.log(error);
        });
      }
    }
    this.populateTeamData();
  };

  async populateTeamData () {
    let teams = this.state.teams;
    let userDetails = this.state.userDetails;
    await teams.forEach(async (t, i) => {
      await t.members.forEach((m, j) => {
        t.members[j] = userDetails[m.userId];
      });
      teams[i] = t;
      this.setState({teams: teams});
    });
  }

  saveData () {
    localStorage.setItem("appState", JSON.stringify(this.state));
  }

  hideTeam () {
    this.setState({teamOpen: false});
  }

  hideUser () {
    this.setState({userOpen: false});
  }

  showTeam (team) {
    this.setState({
      selectedTeam: team,
      teamOpen: true
    });
  }

  showUser (user) {
    this.setState({
      selectedUser: user,
      userOpen: true
    });
  }

  loadingMessage (progress) {
    if(progress > 99) {
      return "";
    } else if(progress > 90) {
      return "almost done";
    } else if(progress > 75) {
      return "not sure what I think of use of modals here";
    } else if(progress > 55) {
      return "was expecting some members on multiple teams but it wasn't the case";
    } else if(progress > 35) {
      return "if I did it again would load by team and enable buttons as they completed";
    } else if(progress > 20) {
      return "slow but only once, as saves to localstorage";
    } else if(progress > 10) {
      return "can search now but not all users show yet";
    } else if(progress > 5) {
      return "requesting user data for each user";
    } else if(progress > 1) {
      return "getting team leads and member count";
    } else {
      return "getting teams";
    }
  }

  constructor(props){
    super(props);
    this.state = localStorage.getItem("appState") ? JSON.parse(localStorage.getItem("appState")) : initialState;
    this.getTeams = this.getTeams.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.getTeamMembers = this.getTeamMembers.bind(this);
    this.getUserDetails = this.getUserDetails.bind(this);
    this.populateTeamData = this.populateTeamData.bind(this);
    this.saveData = this.saveData.bind(this);
    this.hideTeam = this.hideTeam.bind(this);
    this.hideUser= this.hideUser.bind(this);
    this.showTeam = this.showTeam.bind(this);
    this.showUser = this.showUser.bind(this);
  }

  async componentDidMount() {
    window.addEventListener("beforeunload", this.saveData);
    await Promise.all([
      this.getTeams(),
      this.getUsers()
    ]);
    await Promise.all([
      this.getTeamMembers(),
      this.getUserDetails()
    ]);
  }

  componentWillUnmount() {
    this.saveData();
  }

  render () {
    let progress = Object.keys(this.state.userDetails).length/500 * 100;
    const teamList = this.state.teams.map((t) => 
                       <TeamCard
                         team={t}
                         lead={this.state.userDetails[t.teamLead]}
                         showTeam={progress === 100 ? this.showTeam : null}
                       />
                     );
    const loading = <p>loading</p>
    const usersArray = Object.entries(this.state.userDetails).map(( [k, v] ) => ( v ))
    return(
      <div>
        <NavBar
          users={usersArray}
          showUser={this.showUser}
        />
          <Container>
            <br/>
            <ProgressBar className={progress === 100 ? "hidden" : ""} width={100} now={progress} />
            <center className={progress === 100 ? "hidden" : ""}><h3>{ this.loadingMessage(progress) }</h3></center>
            <br/>
            <Row>
              <CardColumns>{teamList}</CardColumns>
            </Row>
            <TeamModal
              show={this.state.teamOpen}
              team={this.state.selectedTeam}
              lead={this.state.selectedTeam ? this.state.userDetails[this.state.selectedTeam.teamLead] : null}
              onHide={this.hideTeam}
              showUser={this.showUser}
            />
            <UserModal
              show={this.state.userOpen}
              user={this.state.selectedUser}
              onHide={this.hideUser}
            />
          </Container>
      </div>
    )
  }
}

export default Teams;
