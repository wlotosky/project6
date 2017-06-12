import React from 'react';
import firebase from './firebase.js'

class Event extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			location: '',
			date: '',
			time: '',
			attendees: [],
			user: {}
		}
	}
	componentDidMount() {
		firebase.auth().onAuthStateChanged( (user) => {
			if (user) {
				this.setState({
					user,
					loggedIn: true
				}) 
			}
		})
		const event = this.props.match.params.event;
		const singleEventRef = firebase.database().ref(`events/${event}`);

		singleEventRef.on('value',(snapshot) => {
			const event = snapshot.val();
			const attendeesList = event.attendees;
			const attendees = [];
			console.log(attendeesList);
			for (let key in attendeesList) {
				console.log(key, attendeesList[key]);
				attendees.push({
					key: attendeesList[key].key,
					name: attendeesList[key].name
				});
			}
			this.setState({
				location: event.location,
				date: event.date,
				time: event.time,
				name: event.name,
				attendees
			})	
		});
	}
	render() {
		return (
			<div>
				<h3>{this.state.location}</h3>
				<p>Created by: {this.state.name}</p>
				<h4>{this.state.date}</h4>
				<h4>{this.state.time}</h4>
				<h3>Attendees:</h3>
				<ul>
					{this.state.attendees.map( (attendee) => {
						return (
							<li key={attendee.key}>{attendee.name}</li>
						)
					})}
				</ul>
			</div>
		)
	}
}

export default Event