import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Link, 
	Route
} from 'react-router-dom';
import firebase from './firebase.js'
import NewEventForm from './newEventForm.js'
import EventsDisplay from './eventDisplay.js'
import Event from './event.js'

const eventListRef = firebase.database().ref('/events');
const userListRef = firebase.database().ref('/users');

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

class App extends React.Component {
	constructor () {
		super(); 
		this.state = {
			user: null,
			loggedIn: false,
			events: {},
			singleEvent: {}
		}
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
					<Route exact path="/addNewEvent" component={NewEventForm} />
					<Route exact path="/events/" component={EventsDisplay} />
					<Route path="/events/:event" component={Event} />
				</main>	
			</Router>
		)
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
				userRef.once('value', (snapshot) => {
					const userList = snapshot.val();
					for (let key in userList) {
						if (userList[key].id === this.state.user.uid) {

						} 
						// else if () {

						// }
					}
				});
				userRef.push({
					id: user.uid,
					name: user.displayName
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
}

ReactDOM.render(<App/>, document.getElementById('app'));