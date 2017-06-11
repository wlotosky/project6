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
			attendees: []
		}
	}
	componentWillMount() {
		const event = this.props.match.params.event;
		const singleEventRef = firebase.database().ref(`events/${event}`);

		singleEventRef.on('value',(snapshot) => {
			const event = snapshot.val();
			const attendeesList = event.attendees;
			const attendees = [];
			console.log(attendeesList);
			for (let key in attendeesList) {
				console.log(key, attendeesList[key]);
				let singleAttendee = attendeesList[key]
				for (let key in singleAttendee) {
						attendees.push({
							key: key,
							attendee: singleAttendee[key]
						});
					}
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
				<h4>{this.state.date}</h4>
				<h4>{this.state.time}</h4>
				<p>{this.state.name}</p>
				{this.state.attendees.map( (attendee) => {
					return (
						<p key={attendee.key}>{attendee.attendee}</p>
					)
				})}
			</div>
		)
	}
}

export default Event