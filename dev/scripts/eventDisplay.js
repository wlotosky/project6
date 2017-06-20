import React from 'react';
import {Link} from 'react-router-dom';
import firebase from 'firebase';
import _ from 'underscore';
import moment from 'moment';
import GoogleMap from './googleMap.js';

const eventListRef = firebase.database().ref('/events');
const userListRef = firebase.database().ref('/users');
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
	render() {
		return (
			<section>
				<h2 className="sectionHeader">Events</h2>
				<ul className="event-list" >
					{this.state.events.map( (event) => {
						return (
							<li key={event.key} className="event-listItem">
								<h3>{event.event.location}</h3>
								<h4>{`${event.event.date.month} ${event.event.date.day}, ${event.event.date.year}`}</h4>
								<h4>{event.event.time}</h4>
								<button onClick={ () => this.handleClick(`/events/${event.key}/attendees/`, event)} className="attend-button">I'm attending</button>
								<div className="listItem-bottom">
									<p>{event.event.name}</p>
									<Link to={`/events/${event.key}`}>	
										<button>+</button>
									</Link>
								</div>
							</li>
						)
					})}
				</ul>
			</section>	
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
					currentEvents.map( (event) => {
						let dateArray = event.event.date.split('-', 3);
						let dateString = dateArray.join('');
						let timeArray = event.event.time.split(':', 2);
						let timeString = timeArray.join('');
						let dateTimeString = dateString + timeString;
						let dateNumber = parseInt(dateTimeString);
						return event.event.date = dateNumber;
					});

					let sortedEvents = currentEvents.sort(function(a, b) {
						return a.event.date - b.event.date;
					});
					sortedEvents.map( (event) => {
						let dateString = event.event.date.toString();
						let year = dateString.slice(0, 4);
						let almostMonth = dateString.slice(4, 6);
						let month = months[parseInt(almostMonth) - 1];
						let day = parseInt(dateString.slice(6, 8));
						let date = {
							year,
							month,
							day 
						}
						event.event.date = date
					});
					this.setState({
						events: currentEvents
					})
				})
			} else {
				this.setState({
					user: null,
					loggedIn: false
				})
			}
		})
	}
	handleClick(path, event) {
		// pushing to attendees list in the event page
		const attendeeRef = firebase.database().ref(path);
		attendeeRef.once('value', (snapshot) => {
			let attendeesList = snapshot.val()
			if (attendeesList === null) {
				attendeeRef.push({
					id: this.state.user.uid,
					name: this.state.user.displayName
				});
			} else {
				const attendeeIds = _.pluck(attendeesList, 'id') 

				if (attendeeIds.includes(this.state.user.uid)) {

				} else {
					attendeeRef.push({
						id: this.state.user.uid,
						name: this.state.user.displayName
					});
				}
			}
		});
		// push to users/user/events
		userListRef.once('value', (snapshot) => {
			const users = snapshot.val();
			for (let key in users) {
				console.log(key, users[key], event)
				if (users[key].id === this.state.user.uid) {
					const userEventsRef = firebase.database().ref(`/users/${key}/events/`)
					userEventsRef.push(event);
				}
			}
		});
	}
	sortEventsByDate() {
		eventListRef.on('value', (snapshot) => {
			const events = snapshot.val();
			const currentEvents = [];
			for(let key in events) {
				currentEvents.push({
					key: key,
					event: events[key]
				});
			}
			currentEvents.map( (event) => {
				let dateArray = event.event.date.split('-', 3);
				let dateString = dateArray.join('');
				let dateNumber = parseInt(dateString);
				console.log(dateString, dateNumber);
				return event.event.date = dateNumber;
			});

			let sortedEvents = currentEvents.sort(function(a, b) {
				return a.event.date - b.event.date;
			});
			converDateToText(sortedEvents);
		})
	}
	convertDateToText(sortedEvents) {
		sortedEvents.map( (event) => {
			let dateString = event.event.date.toString();
			let year = dateString.slice(0, 4);
			let almostMonth = dateString.slice(4, 6);
			let month = months[parseInt(almostMonth) - 1];
			let day = parseInt(dateString.slice(6, 8));
			let date = {
				year,
				month,
				day 
			}
			event.event.date = date
		});
		this.setState({
			events: currentEvents
		})
	}
}

export default EventsDisplay