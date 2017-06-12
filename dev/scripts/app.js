import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Link, 
	Route
} from 'react-router-dom';
import _ from 'underscore';
import firebase from './firebase.js';
import NewEventForm from './newEventForm.js';
import EventsDisplay from './eventDisplay.js';
import Event from './event.js';
import UserPage from './userPage.js';

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
		const displayHomeNav = () => {
			if (this.state.loggedIn === true) {
				return (
					<nav>
						<ul>
							<li>
								<Link to="/events">Go to Events</Link>
							</li>
							<li>
								<Link to="/addNewEvent">Go to Add New Event Page</Link>
							</li>
							<li>
								<Link to={`/${this.state.user.uid}`}>Go to Your Profile Page</Link>
							</li>
							<li>
								<button onClick={this.logout}>Log Out</button>
							</li>
						</ul>
					</nav>
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
					{displayHomeNav()}
					<Route exact path="/addNewEvent" component={NewEventForm} />
					<Route exact path="/events/" component={EventsDisplay} />
					<Route path="/events/:event" component={Event} />
					<Route path="/:userId" component={UserPage} />
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
				}, () => {
					userListRef.once('value', (snapshot) => {
						const userList = snapshot.val();
						if (userList === null) {
							userListRef.push({
								id: user.uid,
								name: user.displayName
							});
						} else {
							const userIds = _.pluck(userList, 'id');

							if (userIds.includes(this.state.user.uid)) {
								console.log('user has already signed in before')
							} else {
								userListRef.push({
									id: user.uid,
									name: user.displayName
								});
							}
						}
					});
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
}

ReactDOM.render(<App/>, document.getElementById('app'));