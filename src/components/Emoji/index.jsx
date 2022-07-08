import React, { Component } from 'react'
import json from "./emojis.json";
import './style.css'
export class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emojiIndex: 0,
        }
        this.onEmojiSelect = this.onEmojiSelect.bind(this)
    }
    createSvgHeading = () => {
        return json && json.map((item, index) =>
            <button className={`emoji-panel__btn ${this.state.emojiIndex === index ? 'active' : ''}`} key={index} onClick={() => this.setState({ emojiIndex: index })}>{this.createSvg(item.unicode, item.title)}</button >
        )
    }

    createSvgBody = (index) => {
        return json && json[index].emojis.map((item, index) =>
            <button className="emoji-panel__btn" key={index} onClick={() => this.onEmojiSelect(item)}>{this.createSvg(item.unicode, item.title)}</button>
        )
    }

    createSvg (unicode, title) {
        return (
            <svg width="25" height="25">
                <use href={`/sprite.svg#${unicode}`}>
                    <title>{title}</title>
                </use>
            </svg>)
    }
    onEmojiSelect = (item) => {
        this.props.onEmojiClick(item.char)
      }
    render() {
        return (
            <div className={`emoji-panel ${this.props.class}`}>
                <div className="emoji-panel__heading">
                    {this.createSvgHeading()}
                </div>
                <div className="emoji-panel__body">
                    {this.createSvgBody(this.state.emojiIndex)}
                </div>
            </div>
        )
    }
}

export default index