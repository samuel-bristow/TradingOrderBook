import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";

import Orders from "./components/Orders";
import HomePage from "./components/HomePage";
import Trade from "./components/Trade";
import Header from "./components/Header";
import ErrorPage from "./components/ErrorPage"
import Login from "./components/Login";
import ManageOrders from "./components/ManageOrders"
import TickerFeed from "./components/TickerFeed"

const SERVICE_URL = "http://localhost:8080/orderbook/";


class App extends React.Component {

  state = {
    user: {
      email: "",
      password: ""
    },

    existingUser: {
      email: "",
      password: ""
    },
    userId: 1,
    loginError: false,
    loginMessage: "",
    loginStatus: false
  }

  componentWillMount() {


    let emailCookie = this.getCookie("email");
    let passwordCookie = this.getCookie("password");
    let idCookie = this.getCookie("id");

    if (emailCookie != "" && passwordCookie != "" && idCookie != "") {
      console.log("Cookies loaded");
      this.setState({ loginStatus: true })
    }


  }


  handleChange = (event) => {
    let inputName = event.target.name;
    let inputValue = event.target.value;
    let newUser = this.state.user;

    if (newUser.hasOwnProperty(inputName)) {
      newUser[inputName] = inputValue;
      this.setState({ user: newUser });
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();


    fetch(SERVICE_URL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, body: JSON.stringify(this.state.user),
    })
      .then((response) => response.json())
      .then((data) => { this.login(data) })
      .catch((error) => {
        console.log("Login error")
        this.setState({ loginError: true });
      });

    if (this.state.loginError) {
      this.setState({ loginMessage: "Email and/or password is incorect" });
    }

  }

  login = (data) => {
    console.log("Welcome!");

    this.setState({ existingUser: data, loginStatus: true, userId: data.userId })

    this.setCookie("email", this.state.user.email, 1);
    this.setCookie("password", this.state.user.password, 1);
    this.setCookie("id", this.state.userId, 1);


  }

  redirectOnLogin = () => {
    console.log("redirecting");
    return (
      !this.state.loginStatus ? <Login message={this.state.loginMessage} user={this.state.user} handleChange={this.handleChange} handleSubmit={this.handleSubmit} /> :
        <Redirect to="/homepage" />
    )
  }

  setCookie = (cname, cvalue, exdays) => {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  getCookie = (cname) => {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  logout = () => {
    this.setState({ loginStatus: false });

    this.setCookie("email", "", 1);
    this.setCookie("password", "", 1);
    this.setCookie("id", "", 1);
  }

  render() {
    return (

      <div className="App">
        <Router>
          <Header />
          <div className="middle-container">
            <Row noGutters>
              <Col xs={12} md={10}>
                <Switch>
                  <Route exact path="/login">
                    {this.redirectOnLogin}
                  </Route>
                  <Route exact path="/homepage">
                    {this.state.loginStatus ? <HomePage /> : <Redirect to="/login" />}
                  </Route>
                  <Route path="/trades/:symbol">
                    {this.state.loginStatus ? <Trade /> : <Redirect to="/login" />}
                  </Route>
                  <Route path="/trades">
                    {this.state.loginStatus ? <Trade /> : <Redirect to="/login" />}
                  </Route>
                  <Route path="/mytrades">
                    {this.state.loginStatus ? <Trade user={this.state.userId} /> : <Redirect to="/login" />}
                  </Route>
                  <Route path="/orders/:symbol">
                    {this.state.loginStatus ? <Orders user={this.state.userId} /> : <Redirect to="/login" />}
                  </Route>
                  <Route path="/orders">
                    {this.state.loginStatus ? <Orders user={this.state.userId} /> : <Redirect to="/login" />}
                  </Route>
                  <Route path="/myorders">
                    {this.state.loginStatus ? <ManageOrders user={this.state.userId} /> : <Redirect to="/login" />}
                  </Route>
                  <Route path="/error/:errorcode">
                    <ErrorPage />
                  </Route>
                  <Route exact path="/">
                    <Redirect to="/homepage"></Redirect>
                  </Route>
                </Switch>
              </Col>
              <Col md={2} className='d-md-block d-none'>
                <TickerFeed />
              </Col>
            </Row>
          </div>
          {this.state.loginStatus ?
            <Button onClick={this.logout} className="btn-style logout-btn">
              Log out
        </Button> : ""}
        </Router>
      </div>

    );
  }
}

export default App;
