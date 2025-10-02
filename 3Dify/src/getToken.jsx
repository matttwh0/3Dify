/* 
This gets the token ID to make a photoscene POST request
npm install js-based64
*/

import React, { Component } from "react";
import axios from "axios";

class GetToken extends Component {
  //TODO: use btoa()
  GetTokenURI = "https://developer.api.autodesk.com/authentication/v2/token";

  constructor(props) {
    super(props);
    this.originalString =
      "GAjgqsQ2Xk0HmDGljBblQ5oio0jEY5AXI87YNzJJG0iYQnxX:jpK99MVLblBZCQ1NSx4exKi49sy5mNZP8D8M30xc4AwflzAUWwnUP8RmTkdYlrot";
    this.encodedString = window.btoa(this.originalString);

    this.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization: `Basic ${this.encodedString}`,
    };
  }

  body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "data:read",
  });

  clickHandler = (e) => {
    e.preventDefault();
    console.log(this.body);

    axios
      .post(this.GetTokenURI, this.body, { headers: this.headers })
      .then((response) => {
        const token = response.data.access_token; //our token 
        console.log(`Token: ${token}`);
        this.setState({token}); //store token in state 'this.state.token'
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    return (
      <div>
        <form>
          <div>
            <button
              onClick={this.clickHandler}
              className="bg-gray-400 text-black p-2 m-4 w-30 h-20"
              type="submit"
            >
              Generate Token
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default GetToken;
