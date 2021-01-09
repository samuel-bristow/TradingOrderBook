
import React from "react";

import { Form, Button } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router";
import LoginForm from "./LoginForm";

const SERVICE_URL = "http://localhost:8080/orderbook/";

class Login extends React.Component {


    render() {


        return (
            <Container className="App-main-container login-container">
                <LoginForm message={this.props.message} user={this.props.user} handleChange={this.props.handleChange} handleSubmit={this.props.handleSubmit} />
            </Container>


        );
    }
}

export default withRouter(Login);
