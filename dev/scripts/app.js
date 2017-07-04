import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	NavLink as Link, 
	Route
} from 'react-router-dom';
import _ from 'underscore';
import firebase from './firebase.js';
import HeroImage from './heroImage.js';
import NewEventForm from './newEventForm.js';
import EventsDisplay from './eventDisplay.js';
import Event from './event.js';
import UserPage from './userPage.js';

const eventListRef = firebase.database().ref('/events');
const userListRef = firebase.database().ref('/users');

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const Hamburger = ({ modalToggle, modal }) => {
	if (modal) {
		return <a href="#" onClick={modalToggle} className="hamburger">X</a>
	} else {
		return <a href="#" onClick={modalToggle} className="hamburger">&#9777;</a>
	}
}

class App extends React.Component {
	constructor () {
		super(); 
		this.state = {
			user: null,
			loggedIn: false,
			events: {},
			singleEvent: {},
			modal: false
		}
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.modalToggle = this.modalToggle.bind(this);
		this.modalRemove = this.modalRemove.bind(this);
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
		const modalClass = 'modal';
		const displayHomeNav = () => {
			if (this.state.loggedIn === true) {
				return (
						<nav className="mainNav">
							<div className="logoBox">
								<Link to="/" >
									<i className="fa fa-dribbble" aria-hidden="true"></i>
								</Link>	
							</div>

							<ul className={this.state.modal ? modalClass : null}>
								<li onClick={this.modalRemove}>
									<Link to="/addNewEvent" activeClassName="activeLink" >Add New Event</Link>
								</li>
								<li onClick={this.modalRemove}>
									<Link to="/events" activeClassName="activeLink">Events</Link>
								</li>
								<li onClick={this.modalRemove}>
									<Link to={`/user/${this.state.user.uid}`} activeClassName="activeLink" >Profile</Link>
								</li>
								<li onClick={this.modalRemove}>
									<button onClick={this.logout}>Log Out</button>
								</li>
							</ul>
							<Hamburger className="hamburger" modalToggle={this.modalToggle} modal={this.state.modal}/>
						</nav>
				)
			} else {
				return (
						<nav className="mainNav">
							<div className="logoBox">
								<Link to="/" >
									<i className="fa fa-dribbble" aria-hidden="true"></i>
								</Link>	
							</div>
							<ul className={this.state.modal ? modalClass : null} >
								<li onClick={this.modalRemove}>
									<button onClick={this.login} className="signIn-button">Login</button>
								</li>
							</ul>
							<Hamburger className="hamburger" modalToggle={this.modalToggle} modal={this.state.modal}/>
						</nav>
				)
			}
		}
		return (
			<Router>
				<main>
					{displayHomeNav()}
					<Route exact path="/" component={HeroImage} />
					<Route path="/addNewEvent/" component={NewEventForm} />
					<Route exact path="/events/" component={EventsDisplay} />
					<Route exact path="/events/:event" component={Event} />
					<Route path="/user/:userId" component={UserPage} />
					<footer>
						<p>Created by William Lotosky &copy; 2017</p>
					</footer>
				</main>	
			</Router>
		)
	}
	login() {
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

							} else {
								userListRef.push({
									id: user.uid,
									name: user.displayName
								});
							}
						}
					});
				})
			})
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
	modalToggle() {
		this.setState({
			modal: !this.state.modal
		});
	}
	modalRemove() {
		this.setState({
			modal: false
		})
	}
}

ReactDOM.render(<App/>, document.getElementById('app'));