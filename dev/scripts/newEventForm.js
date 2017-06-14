import React from 'react';
import firebase from './firebase.js';
import GoogleMap from './googleMap.js';

const eventListRef = firebase.database().ref('/events');

class NewEventForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			location: '',
			date: '',
			time: '',
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentDidMount() {
		firebase.auth().onAuthStateChanged( (user) => {
			if (user) {
				this.setState({
					user,
					loggedIn: true,
					name: user.displayName
				})
			} else {
				this.setState({
					user: null,
					loggedIn: false
				})
			}
		})	
	}
	render() {
		return (
			<form onSubmit={this.handleSubmit} className="componentSection">
				<h2 className="sectionHeader">Add New Event</h2>

				<div className="inputsHolder">
					<div className="inputHolder">
						<input value={this.state.location} onChange={this.handleChange} name="location" type="text" placeholder="Christie Pits" />
						<label htmlFor="location">Location</label>
					</div>

					<div className="inputHolder">
						<input value={this.state.date} onChange={this.handleChange} name="date" type="date"/>
						<label htmlFor="date">Date</label>
					</div>

					<div className="inputHolder">
						<input value={this.state.time} onChange={this.handleChange} name="time" type="time"/>
						<label htmlFor="time">Time</label>
					</div>
				</div>

				<input type="submit" value="Create Event"/>
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
		})
		this.setState({
			location: '',
			date: '',
			time: ''
		})
	}
}

export default NewEventForm