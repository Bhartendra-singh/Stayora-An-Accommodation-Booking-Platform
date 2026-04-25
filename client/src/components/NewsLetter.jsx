import React from "react";
import { assets } from "../assets/assets";
import Title from "./Title";
const NewsLetter=() =>{
    return(
        <div className="flex flex-col items-center max-w-5xl lg:w-full 
        rounded-2xl px-4 py-12 md:py-16 mx-2 lg:mx-auto my-30 
        bg-gray-900 text-white">

            <Title title="Stay Inspired" 
                subTitle="Join our newsletter and be the first to discover new destinations,exclusive offers, and travel inspiration."/>
            
                <div className="flex fllex-col md:flex-row items-center justify-center gap-4 mt-6">

                    <input type="text" className="bg-transparent outline-none rounded-full px-4 h-full flex-1" placeholder="Enter your email address"/>
                    <button className="bg-indigo-600 text-white rounded-full h-11 mr-1 px-8 flex items-center justify-center">
                        Subscribe
                        <img src={assets.arrowIcon} alt="arrow-icon" className="w-3.5 invert group-hover:translate-x-1 transition-all"/>
                    </button>
                </div>
                <p className="text-gray-500 mt-6 text-xs text-center">
                    By subscribing, you agree to our Privacy Policy and consent to receive updates.
                </p>
            </div>
    )
}
export default NewsLetter;