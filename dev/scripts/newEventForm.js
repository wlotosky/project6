import React from 'react';
import firebase from './firebase.js';

const eventListRef = firebase.database().ref('/events');

class NewEventForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			location: '',
			date: '',
			time: '',
			user: null,
			loggedIn: false
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentWillMount() {
		firebase.auth().onAuthStateChanged( (user) => {
			if (user) {
				this.setState({
					user,
					loggedIn: true,
					name: user.displayName
				})
			}	
		})	
	}
	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<h2>Add New Event</h2>

				<label htmlFor="location">Location</label>
				<input value={this.state.location} onChange={this.handleChange} name="location" type="text"/>

				<label htmlFor="date">Date</label>
				<input value={this.state.date} onChange={this.handleChange} name="date"type="date"/>

				<label htmlFor="time">Time</label>
				<input value={this.state.time} onChange={this.handleChange} name="time"type="text"/>

				<input type="submit" value="Submit"/>
			</form>
		)
	}
	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	handleSubmit(event) {
		event.preventDefault();
		eventListRef.push({
			name: this.state.name,
			location: this.state.location,
			date: this.state.date,
			time: this.state.time,
			attendees: {
				[this.state.user.uid]: this.state.name
			}

		})
		this.setState({
			name: '',
			location: '',
			date: '',
			time: ''
		})
	}
}

export default NewEventForm