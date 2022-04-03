import React from 'react'
import './style.css'
export class index extends React.Component {
	render() {
		return (
			<div className="friend-suggest">
				<div className="header">
				<span>Do you know ...</span>
				</div>
				<div className="friend-sug">
					<div className="sug-card">
						<div className="sug-card-top">
							<img src="https://cdn.pixabay.com/photo/2022/02/12/13/29/desert-7008952_960_720.jpg" alt="" />
						</div>
						<div className="sug-card-bottom">
							<span>Erwan</span>
							<small>11k friends</small>
							<button>Add</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default index