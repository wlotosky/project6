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
	componentDidMount() {
		firebase.auth().onAuthStateChanged( (user) => {
			if (user) {
				this.setState({
					user,
					loggedIn: true
				})
			}
		})
	}
	render() {
		const displayHomeNav = () => {
			if (this.state.loggedIn === true) {
				return (
					<nav className="mainNav">
						<h2 className="mainHeader">Where My Ballers At?</h2>
						<ul>
							<li>
								<Link to="/events">Events</Link>
							</li>
							<li>
								<Link to="/addNewEvent">Add New Event</Link>
							</li>
							<li>
								<Link to={`/user/${this.state.user.uid}`}>Profile</Link>
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
						<h1 className="mainHeader">Where My Ballers At?</h1>
						<button onClick={this.login} className="signIn-button">Login with Google</button>
					</main>
				)
			}	
		}
		return (
			<Router>
				<main>
					{displayHomeNav()}
					<Route path="/addNewEvent/" component={NewEventForm} />
					<Route exact path="/events/" component={EventsDisplay} />
					<Route path="/events/:event" component={Event} />
					<Route path="/user/:userId" component={UserPage} />
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