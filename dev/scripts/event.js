import React from 'react';
import firebase from './firebase.js'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
			const newDate = event.date;
			let dateArray = newDate.split('-', 3);
			let dateString = dateArray.join('');
			let year = dateString.slice(0, 4);
			let almostMonth = dateString.slice(4, 6);
			let month = months[parseInt(almostMonth) - 1];
			let day = parseInt(dateString.slice(6, 8));
			let date = {
				year,
				month,
				day 
			}
			const attendeesList = event.attendees;
			const attendees = [];
			for (let key in attendeesList) {
				attendees.push({
					key: attendeesList[key].key,
					name: attendeesList[key].name
				});
			}
			this.setState({
				location: event.location,
				date,
				time: event.time,
				name: event.name,
				attendees
			})	
		});
	}
	render() {
		return (
			<div>
				<div className="wrapper">
					<div className="componentSection singleEvent">
						<h3>{this.state.location}</h3>
						<p className="creator">Created by: {this.state.name}</p>
						<h4>{`${this.state.date.month} ${this.state.date.day}, ${this.state.date.year}`}</h4>
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
				</div>
			</div>
		)
	}
}

export default Event