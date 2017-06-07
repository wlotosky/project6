import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	NavLink as Link,
	Route
} from 'react-router-dom';

var config = {
	apiKey: "AIzaSyAIqYoctbM99MIr6El8zRHGwg-s6FCBFoM",
	authDomain: "sports-meet-up.firebaseapp.com",
	databaseURL: "https://sports-meet-up.firebaseio.com",
	projectId: "sports-meet-up",
	storageBucket: "sports-meet-up.appspot.com",
	messagingSenderId: "297580513675"
};
firebase.initializeApp(config);

const eventListRef = firebase.database().ref('/events');

class NewEventForm extends React.Component {
	constructor () {
		super(); 
		this.state = {
			name: '',
			location: '',
			date: '',
			time: '',
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	handleSubmit(event) {
		event.preventDefault();
		eventListRef.push()
	}
	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<h2>Add New Event</h2>
				<label htmlFor="name"></label>
				<input value={this.state.name} onChange={this.handleChange} name="fullName" type="text"/>

				<label htmlFor="location"></label>
				<input value={this.state.location} onChange={this.handleChange} name="location" type="text"/>

				<label htmlFor="date"></label>
				<input value={this.state.date} onChange={this.handleChange} name="date"type="date"/>

				<label htmlFor="time"></label>
				<input value={this.state.time} onChange={this.handleChange} name="time"type="text"/>
			</form>
		)
	}
}

class NewEvent extends React.Component {
	render() {
		return (

		)
	}
}

class App extends React.Component {
	render() {
		return (
			<main>
				<NewEventForm/>
			</main>
		)
	}
}

ReactDOM.render(<App/>, document.getElementById('app'));

// class NewUserSignIn extends React.Component {
// 	constructor() {
// 		super();
// 		this.state = {
// 			email: '',
// 			password: ''
// 		}
// 		this.handleInputChange = this.handleInputChange.bind(this);
// 		this.handleSubmit = this.handleSubmit.bind(this);
// 	}
// 	handleInputChange(event) {
// 		const target = event.target;
// 		const name = target.name;
// 		const value = target.value;
// 		this.setState({
// 			[name]: value
// 		})
// 	}
// 	handleSubmit(event) {
// 		event.preventDefault();
// 		console.log(this.state.email, this.state.password);
// 	}
// 	render() {
// 		return (
// 			<form id="newUser" onSubmit={this.handleSubmit}>
// 				<h2>New User</h2>
// 				<label>E-mail:</label>
// 				<input name="email" type="email" value={this.state.email} onChange={this.handleInputChange}/>
// 				<label>Password:</label>
// 				<input name="password" type="password" value={this.state.password} onChange={this.handleInputChange}/>
// 				<input type="submit" value="Submit" />
// 			</form>
// 		);
// 	}
// }
