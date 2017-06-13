import React from 'React';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

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
				<GoogleMapReact 
					defaultCenter={this.state.center} 
					defaultZoom={this.state.zoom} >

					<AnyReactComponent/>

				</GoogleMapReact>
			</div>
		)
	}
}

export default GoogleMap