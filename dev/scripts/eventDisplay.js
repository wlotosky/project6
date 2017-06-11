import React from 'react';
import {Link} from 'react-router-dom';

class EventsDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: this.props.user
		}
		this.handleClick = this.handleClick.bind(this);
	}
	render() {
		return (
			<ul className="event-list">
				{this.props.eventList.map( (event) => {
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
	handleClick(path) {
		const attendeeRef = firebase.database().ref(path);
		attendeeRef.once('value', (snapshot) => {
			let attendeesList = snapshot.val()
			console.log(attendeesList);
			for (let key in attendeesList) {
				console.log(attendeesList[key])
				if ([key] !== this.state.user.uid) {
					attendeeRef.push({[this.state.user.uid]:this.state.user.displayName});
				} else {
					console.log('your already going')
				}
			}
		});
	}
}

export default EventsDisplay