import React from 'react';
import {Link} from 'react-router-dom';
import firebase from 'firebase';

const userEventsRef = firebase.database().ref('/users');
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
				userEventsRef.on('value', (snapshot) => {
					const users = snapshot.val();
					const userEventList = [];
					console.log(users);

					for (let key in users) {
						console.log(key, users[key])
						if (users[key].id === this.state.user.uid) {
							const events = users[key].events
							for (let key in events) {
								userEventList.push(events[key]);
								console.log(events[key]);
							}
							this.setState({
								userEvents: userEventList
							})
						} 
					}
				});
			}
		})	
	}
	render() {
		return (
			<section>
				<h2 className="sectionHeader">Your Events</h2>
				<ul className="event-list" >
					{this.state.userEvents.map( (event) => {
						console.log(event)
						return (
							<li key={event.key} className="event-listItem">
								<h3>{event.event.location}</h3>
								<h4>{`${event.event.date.month} ${event.event.date.day}, ${event.event.date.year}`}</h4>
								<h4>{event.event.time}</h4>
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
}

export default UserPage