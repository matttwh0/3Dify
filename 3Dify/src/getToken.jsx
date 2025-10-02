/* 
This gets the token ID to make a photoscene POST request
npm install js-based64
*/

import React, { Component } from "react";

class GetToken extends Component {
  //TODO: use btoa()
  GetTokenURI = "https://developer.api.autodesk.com/authentication/v2/token";

  constructor(props) {
    super(props);
    this.originalString =
      "GAjgqsQ2Xk0HmDGljBblQ5oio0jEY5AXI87YNzJJG0iYQnxX:jpK99MVLblBZCQ1NSx4exKi49sy5mNZP8D8M30xc4AwflzAUWwnUP8RmTkdYlrot";
    this.encodedString = window.btoa(this.originalString);

    this.state = {
      first_name: "Matthew",
      last_name: "Tran",
      user_email: "matttran2004@gmail.com",
    };
  }

  headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic" + this.encodedString,
  };

   clickHandler = (e) => {
    e.preventDefault();
    console.log(this.state);

    axios.post(this.GetTokenURI)
  }
  render() {
    const { scenename } = this.state;
    return (
      <div>
        <form>
          <div>
            <button 
            onClick = {this.clickHandler}
            className="bg-gray-400 text-black p-2 m-4 w-30 h-20"
            type = "submit">Generate Token
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default GetToken;
