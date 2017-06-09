import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Link, 
	Route
} from 'react-router-dom';

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

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

class NewEventForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			location: '',
			date: '',
			time: ''
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	handleSubmit(event) {
		event.preventDefault();
		this.props.handleSubmit({
			name: this.state.name,
			location: this.state.location,
			date: this.state.date,
			time: this.state.time
		});
		this.setState({
			name: '',
			location: '',
			date: '',
			time: ''
		})
	}
	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<h2>Add New Event</h2>
				<label htmlFor="name">Name</label>
				<input value={this.state.name} onChange={this.handleChange} name="name" type="text"/>

				<label htmlFor="location">Location</label>
				<input value={this.state.location} onChange={this.handleChange} name="location" type="text"/>

				<label htmlFor="date">Date</label>
				<input value={this.state.date} onChange={this.handleChange} name="date"type="date"/>

				<label htmlFor="time">Time</label>
				<input value={this.state.time} onChange={this.handleChange} name="time"type="text"/>

				<input type="submit" value="Submit"/>
			</form>
		)
	}
}

class Events extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<ul>
				{this.props.eventList.map( (event) => {
					return (
						<li key={event.key}>
							<h3>{event.event.location}</h3>
							<h4>{event.event.date}</h4>
							<h4>{event.event.time}</h4>
							<p>{event.event.name}</p>
						</li>
					)
				})}
			</ul>
		)
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
						<NewEventForm name={this.state.name} location={this.state.location} date={this.state.date} time={this.state.time} handleChange={this.handleChange} handleSubmit={this.handleSubmit}/>
						<Link to="/events">Go to Events</Link>
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
					<Route exact path="/events" render={ () => <Events eventList={this.state.events} />}/>
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
				const user = result.user
				this.setState({
					user,
					loggedIn: true
				})
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