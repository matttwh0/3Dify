import React, { Component, useState } from "react";
import axios from "axios";

//make sure to hide client secret and ID when finished 
export function TestGetToken(){

    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);

    const getTokenURI = "https://developer.api.autodesk.com/authentication/v2/token";
    const originalString = "GAjgqsQ2Xk0HmDGljBblQ5oio0jEY5AXI87YNzJJG0iYQnxX:jpK99MVLblBZCQ1NSx4exKi49sy5mNZP8D8M30xc4AwflzAUWwnUP8RmTkdYlrot";
    const encodedString = window.btoa(originalString);
    
    //headers are 
    const headers = {
            "Content-Type": "application/x-www-form-urlencoded", //'urlencoded' lets us know how to format the body: URLSearchParams
            Accept: "application/json",
            Authorization: `Basic ${encodedString}`,
        };
    
    //body parameters must be url encoded 
    const body = new URLSearchParams({
        grant_type: "client_credentials",
        scope: "data:read",
    });

    //handles post request when button is clicked
    async function handleClick(e){ //e is the event
        e.preventDefault(); //stop form submit reload

        try{
            //sends post request and adds it to state
            const res = await axios.post(getTokenURI, body, {headers: headers});
            setToken(res.data.access_token);
            console.log(`full response: ${res.data.access_token}`);
        }
        catch (err){
            setError(err?.response?.data || err.message);
            console.error(err);
        }
        }
    
    //create <Token/> tag to pass value
    function Token({token, setToken}){
        return (
        <div>
            <p className = "text-blue-600">{token ? `Token: ${token}` : 'No token yet'}</p>
            <button className = "text-blue-600"onClick={() => setToken('new value')}>Change token</button>
        </div>
        );
    }

    return(
        <div>
            <form>
                <div>
                <Token token = {token} setToken = {setToken}/>
                    <button
                    onClick = {handleClick}
                    className="bg-gray-400 text-black p-2 m-4 w-30 h-20"
                    type = "button"
                    >
                    Generate Token Test
                    </button>
                </div>
            </form>
        </div>
    );
}



export function TestPostForm( {token, setToken} ){
    <p className = "text-blue-600" > `{`token: ${token}`}`</p>
    return(
        console.log('test post form working')
    );
}