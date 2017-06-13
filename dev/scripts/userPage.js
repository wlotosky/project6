import React from 'react';
import {Link} from 'react-router-dom';
import firebase from 'firebase';

const userEventsRef = firebase.database().ref('/users');

class UserPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			userId: '',
			user: null,
			userEvents: [],
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
		const userEventsRef = firebase.database().ref('/users');

		userEventsRef.once('value', (snapshot) => {
			const users = snapshot.val();
			const userEventList = [];
			console.log(users);

			for (let key in users) {
				console.log(users, key, users[key])
				if (users[key].id === this.state.user.uid) {
					const events = users[key].events
					for (let key in events) {
						userEventList.push(events[key])
					}
				}
			}
			this.setState({
				userEvents: userEventList
			})
		});
	}
	render() {
		return (
			<ul className="event-list" className="componentSection">
				{this.state.userEvents.map( (event) => {
					console.log(event)
					return (
						<li key={event.key} className="event-listItem">
							<h3>{event.event.location}</h3>
							<h4>{event.event.date}</h4>
							<h4>{event.event.time}</h4>
							<p>{event.event.name}</p>
							<Link to={`/events/${event.key}`}>	
								<button>View Event Page</button>
							</Link>
						</li>
					)
				})}
			</ul>
		)
	}
}

export default UserPage