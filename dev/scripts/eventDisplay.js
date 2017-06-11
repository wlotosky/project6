import React from 'react';
import {Link} from 'react-router-dom';
import firebase from 'firebase';
import _ from 'underscore';

const eventListRef = firebase.database().ref('/events');

class EventsDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {},
			loggedIn: false,
			name: '',
			events: []
		}
		this.handleClick = this.handleClick.bind(this);
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
			<ul className="event-list">
				{this.state.events.map( (event) => {
					return (
						<li key={event.key} className="event-listItem">
							<h3>{event.event.location}</h3>
							<h4>{event.event.date}</h4>
							<h4>{event.event.time}</h4>
							<p>{event.event.name}</p>
							<button onClick={ () => this.handleClick(`/events/${event.key}/attendees/`)}>I'm attending</button>
							<Link to={`/events/${event.key}`}>	
								<button>Go to Event Page</button>
							</Link>
						</li>	
					)
				})}
			</ul>
		)
	}
	componentDidMount() {
		firebase.auth().onAuthStateChanged( (user) => {
			if (user) {
				this.setState({
					user,
					loggedIn: true
				}) 
				eventListRef.on('value', (snapshot) => {
					const events = snapshot.val();
					const currentEvents = [];
					for(let key in events) {
						currentEvents.push({
							key: key,
							event: events[key]
						});
					}
					this.setState({
						events: currentEvents
					})
				});	
			} else {
				this.setState({
					user: null,
					loggedIn: false
				})
			}
		})
	}
	handleClick(path) {
		// pushing to attendees list in the event page
		const attendeeRef = firebase.database().ref(path);
		attendeeRef.once('value', (snapshot) => {
			let attendeesList = snapshot.val()
			console.log(attendeesList);
			if (attendeesList === null) {
				attendeeRef.push({
					id: this.state.user.uid,
					name: this.state.user.displayName
				});
			} else {
				const attendeeIds = _.pluck(attendeesList, 'id') 

				console.log(attendeeIds);

				if (attendeeIds.includes(this.state.user.uid)) {
					console.log(`You're already attending`);
				} else {
					attendeeRef.push({
						id: this.state.user.uid,
						name: this.state.user.displayName
					});
				}
			}
		});
		// push to users/user/events
		const usersEventsListRef = firebase.database().ref(`/users/${this.state.user.uid}`)
		usersEventsListRef.push({
			name: this.state.user.displayName
			// events: {

			// }
		})
	}
}

export default EventsDisplay