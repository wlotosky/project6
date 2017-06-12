import React from 'React';
import GoogleMapReact from 'google-map-react';

class GoogleMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			center: {lat:43.6701646, long: -79.3867391},
			lat: 43.6701646, 
			long: -79.3867391,
			zoom: 15
		}
	}
	render() {
		return (
			<div>
				<GoogleMapReact defaultCenter={`{lat:${this.state.lat}, lng:${this.state.long}`} defaultZoom={this.state.zoom} >
				</GoogleMapReact>
			</div>
		)
	}
}

export default GoogleMap 