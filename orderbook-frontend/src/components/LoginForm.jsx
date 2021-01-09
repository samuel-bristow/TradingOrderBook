
import React from "react";

import { Form, Button } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";





class Login extends React.Component {


    render() {

        const { login, handleChange, handleSubmit } = this.props;

        return (
            <Form onSubmit={handleSubmit} className="login-form">
                <Form.Group controlId="formBasicEmail">
                    <Form.Label className="login-label">Email address</Form.Label>
                    <Form.Control name="email" onChange={handleChange} value={this.props.user.email} type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                        {this.props.message}
                    </Form.Text>

                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label className="login-label">Password</Form.Label>
                    <Form.Control name="password" value={this.props.user.password} onChange={handleChange} type="password" placeholder="Password" />


                </Form.Group>

                <Button type="submit" className="btn-style" style={{width:"50%"}}>
                    Submit
                </Button>
            </Form>

        );
    }
}

export default Login;
