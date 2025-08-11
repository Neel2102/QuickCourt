import React from "react";
import { assets } from "../assets/assets";
import "../CSS/Header.css"

const Header = () => {
    return (
    <>
        <div className="header">
            <img src={assets.header_img} alt="" className="profile-pic"/>
            <h1 className="heading">
                Hey Developer 
                <img src={assets.hand_wave} alt="" className="wave-icon"/>
            </h1>

            <h2 className="title">
                welcome to our app
            </h2>
            <p className="description">
                let's start with a quick product tour and we will have you up and running in no time!
            </p>

            <button className="get-started-button">get started</button>
        </div>
    </>
    )
}

export default Header;