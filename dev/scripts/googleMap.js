import React from 'React';

class GoogleMap extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="map-container">
				<input  id="search-box" type="text" placeholder="Search Box"/>
				<div id="map"></div>
			</div>
		)
	}
	componentDidMount() {

		const initMap = () => {
			let map = new google.maps.Map(document.getElementById('map'), {
				center: new google.maps.LatLng(43.6701646, -79.3867391),
				zoom: 15
			});

			// const searchBox = () => {

			// 	var userOrigin = new google.maps.places.Autocomplete(
			// 		(document.getElementById('search-box')),
			// 		{types: ['geocode']});
			// }

			// searchBox();

			let input = document.getElementById('search-box');

			let searchBox = new google.maps.places.SearchBox(input);
			// maps.controls[google.maps.ControlsPosition.TOP_LEFT].push(input);

			// map.addListener('bounds_changed', () => {
			// 	searchBox.setBounds(map.getBounds());
			// });

			// let markers = [];

			// searchBox.addListener('places_changed', () => {
			// 	let places = searchBox.getPlaces();

			// 	if (places.length == 0) {
			// 		return;
			// 	}

			// 	markers.forEach( (marker) => {
			// 		marker.setMap(null);
			// 	});

			// 	markers = [];

			// 	let bounds = new google.maps.LatLngBounds();

			// 	places.forEach( (place) => {
			// 		if (!place.geometry) {
			// 			console.log("Returned place contains no geometry");
			// 			return;
			// 		}

			// 		var icon = {
		 //            	url: place.icon,
		 //            	size: new google.maps.Size(71, 71),
		 //            	origin: new google.maps.Point(0, 0),
		 //            	anchor: new google.maps.Point(17, 34),
		 //            	scaledSize: new google.maps.Size(25, 25)
		 //            };

		 //            // Create a marker for each place.
		 //            markers.push(new google.maps.Marker({
		 //            	map: map,
		 //            	icon: icon,
		 //            	title: place.name,
		 //            	position: place.geometry.location
		 //            }));

		 //            if (place.geometry.viewport) {
		 //            	// Only geocodes have viewport.
		 //            	bounds.union(place.geometry.viewport);
		 //            } else {
		 //            	bounds.extend(place.geometry.location);
		 //            }
			// 	}); 
			// });


		}
		initMap();

	}
}

export default GoogleMap