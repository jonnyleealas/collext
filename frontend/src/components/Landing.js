import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import superagent from 'superagent';
import { Redirect } from 'react-router-dom';



export default class LogIn extends Component {

	state = {
		logIn: false,
		token: localStorage.getItem("token")
	};

	responseGoogle = (response) => {
		let token = response.tokenObj.id_token;
		superagent.get(`http://localhost:3331/oauth`)
			.query({ "code": token })
			.then(res => {
				if (res.status == 200) {
					this.login(res.body.token);
				}
			}).catch(e => e);
	}
	login = (token) => {
		this.setState({ 
			logIn: true ,
			token: token,
		});
		localStorage.setItem("token", token);
	}
	render(){
		if (!this.state.logIn) {
			return (
				<GoogleLogin
					clientId="910868958603-nq90rpf6943b5s04jaggao8brvn3g5m3.apps.googleusercontent.com"
					buttonText="Login"
					onSuccess={this.responseGoogle}
					onFailure={this.responseGoogle}
				/>
			)
		}
		if (this.state.logIn) {
			return <Redirect to="/notifications"/>
			}
	}
}