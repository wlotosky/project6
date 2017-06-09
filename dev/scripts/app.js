import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Link, 
	Route
} from 'react-router-dom';
import NewEventForm from './newEventForm.js'

var config = {
	apiKey: "AIzaSyAIqYoctbM99MIr6El8zRHGwg-s6FCBFoM",
	authDomain: "sports-meet-up.firebaseapp.com",
	databaseURL: "https://sports-meet-up.firebaseio.com",
	projectId: "sports-meet-up",
	storageBucket: "sports-meet-up.appspot.com",
	messagingSenderId: "297580513675"
};
firebase.initializeApp(config);

const eventListRef = firebase.database().ref('/events');
const userListRef = firebase.database().ref('/users');

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

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
						<Link to={`/events/${event.key}`}>
							<li key={event.key} className="event-listItem">
								<h3>{event.event.location}</h3>
								<h4>{event.event.date}</h4>
								<h4>{event.event.time}</h4>
								<p>{event.event.name}</p>
								<button onClick={ () => handleClick(`/events/${event.key}/attendees/`)}>I'm attending</button>
							</li>
						</Link>
					)
				})}
			</ul>
		)
	}
	handleClick(path) {
		const attendeeRef = firebase.database().ref(path);
		attendeeRef.push({[this.state.user.uid]:this.state.user.displayName})
	}
}

class Event extends React.Component {
	constructor(props) {
		super(props);
	}
	displayEvent() {

	}
	render() {
		<li key={event.key} className="event-listItem">
			<h3>{event.event.location}</h3>
			<h4>{event.event.date}</h4>
			<h4>{event.event.time}</h4>
			<p>{event.event.name}</p>
		</li>
	}
}

class App extends React.Component {
	constructor () {
		super(); 
		this.state = {
			user: null,
			loggedIn: false,
			events: []
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}
	render() {
		const displayEvents = () => {
			if (this.state.loggedIn === true) {
				return (
					<main>
						<button onClick={this.logout}>Log Out</button>
						<Link to="/events">Go to Events</Link>
						<Link to="/addNewEvent">Go to Add New Event Page</Link> 
					</main>	
				)
			} else {
				return (
					<main>
						<button onClick={this.login}>Login</button>
					</main>
				)
			}	
		}
		return (
			<Router>
				<main>
					<h1>Where My Ballers At?</h1>
					{displayEvents()}
					<Route exact path="/addNewEvent" render={ () => <NewEventForm handleSubmit={this.handleSubmit} userId={this.state.user.uid}/>} />
					<Route exact path="/events" render={ () => <EventsDisplay eventList={this.state.events} user={this.state.user} />}/>
					<Route exact path="/events/:event" render={ () => <Event eventInfo={this.state.events}/>} />
				</main>	
			</Router>
		)
	}
	componentDidMount() {
		firebase.auth().onAuthStateChanged( (user) => {
			if (user) {
				this.setState({
					user,
					loggedIn: true
				})

				const userId = user.userId
				
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
	login () {
		firebase.auth().signInWithPopup(provider)
			.then( (result) => {
				const user = result.user;
				const uniqueUserId = result.user.uid;
				this.setState({
					user,
					loggedIn: true
				});
				userListRef.push(
					uniqueUserId: {
						events: {}
					});
			});
	}
	logout () {
		auth.signOut()
			.then( () => {
				this.setState({
					user: null,
					loggedIn: false
				})
			});
	}
	handleSubmit(formData) {
		eventListRef.push(formData);
	}
}

ReactDOM.render(<App/>, document.getElementById('app'));