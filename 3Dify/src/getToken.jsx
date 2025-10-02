/* 
This gets the token ID to make a photoscene POST request
npm install js-based64
*/

import React, { Component } from 'react'

class getToken extends Component {
//TODO: use btoa()
autodeskURI = 'https://developer.api.autodesk.com/photo-to-3d/v1/photoscene'
originalString = "GAjgqsQ2Xk0HmDGljBblQ5oio0jEY5AXI87YNzJJG0iYQnxX:jpK99MVLblBZCQ1NSx4exKi49sy5mNZP8D8M30xc4AwflzAUWwnUP8RmTkdYlrot"
encodedString = encode(originalString);

  render() {
    return (
      <div>getToken</div>
    )
  }
}

export default getToken