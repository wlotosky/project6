import React from 'react';

class HeroImage extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>
				<div className="heroImage">
					<h1 className="mainHeader">Where My Ballers At?</h1>
					<p>Organize basketball with your friends</p>
				</div>
				<footer>
					<p>Created by William Lotosky &copy; 2017</p>
				</footer>
			</div>
		)
	}
}

export default HeroImage