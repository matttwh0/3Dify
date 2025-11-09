import React, { Component, useState } from "react";
import axios from "axios";
import {PostFile} from "./PostFile";
export function PhotoScene( {token, setToken} ){
    const [photoScene, setPhotoScene] = useState(null);
    const [error, setError] = useState(null);
    const photoSceneURI = 'https://developer.api.autodesk.com/photo-to-3d/v1/photoscene';

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/x-www-form-urlencoded',
        Accept: "application/json"
    };

    const body = new URLSearchParams({
        scenename: 'testphotoscene',
        scenetype: 'object',
        format: 'rcm',
    });

    async function handleClick(e){
        e.preventDefault();

        try{
            //TODO: grab photoscene id and pass to token 
            const res = await axios.post(photoSceneURI, body, {headers: headers});
            setPhotoScene(res.data.photosceneid);
            console.log(`full response: ${res}`);
            console.log("Status:", res.data.photosceneid);
            console.log("Response data:", res.data);
        }
        catch(err) {
            setError(err?.response?.data || err.message);
            console.error(err);
        }
    }

    return(
        <div>
        <p className = "text-blue-600" > `{`token real: ${token}`}`</p>
        <form>
            <div>
                <button
                onClick={handleClick}
                className = "bg-gray-400 text-black p-3 m-4 w-30 h-20"
                type = "button"
                >
                Create PhotoScene
                </button>
            </div>
        </form>
        <PostFile photoScene = {photoScene} setPhotoSCene = {setPhotoScene}/>
        </div>
    );
}





//this is for creating custom scenenames, not important but could be good for testing
    //event when user creates photoscene name in textbox
    // async function handleSubmit(e){
    //     e.preventDefault();
    // <form>
    //         <div>
    //         <input
    //         className="bg-gray-100 text-black-500 p-2 m-4 w-50"
    //         type = "text"
    //         placeholder = "photoscene name"
    //         name = "scenename"
    //         onChange={handleSubmit}
    //         />
    //         </div>
    //     </form>
    // }