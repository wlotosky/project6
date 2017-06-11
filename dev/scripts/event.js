import React from 'react';

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
		const singleEventRef = firebase.database().ref(`events/${this.props.match.params.event}`);
		const event = this.props.match.params.event;

		singleEventRef.on('value',(snapshot) => {
			const event = snapshot.val();
			const attendeesList = event.attendees;
			const attendees = [];
			console.log(attendeesList);
			for (let key in attendeesList) {
				let singleAttendee = attendeesList[key]
				for (let key in singleAttendee) {
						attendees.push({[key]:singleAttendee[key]});
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
						<p>{attendee}</p>
					)
				})}
			</div>
		)
	}
}

export default Event