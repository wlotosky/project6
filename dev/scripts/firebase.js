import firebase from 'firebase';

var config = {
	apiKey: "AIzaSyAIqYoctbM99MIr6El8zRHGwg-s6FCBFoM",
	authDomain: "sports-meet-up.firebaseapp.com",
	databaseURL: "https://sports-meet-up.firebaseio.com",
	projectId: "sports-meet-up",
	storageBucket: "sports-meet-up.appspot.com",
	messagingSenderId: "297580513675"
};
firebase.initializeApp(config);

export default firebase