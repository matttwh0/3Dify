/*
This file creates the post form object, it defines the parameters 
of the object needed to create a photoscene for Autodesk API
 */
// npm install axios
import React, { Component } from "react";
import axios from 'axios';

class PostPhotoScene extends Component {
  URI = 'https://developer.api.autodesk.com/photo-to-3d/v1/photoscene'
  //constructor defining object for photoscene
  constructor(props) {
    super(props);

    this.state = {
      scenename: "",
      callback: "http://localhost:5173/",
      format: ["rcm"],
      scenetype: "object",
    };
  }
    headers = {
      'Content-Type': '',
      'Authorization': '',
    }

  //allows you to add text to textbox
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  //submit button logs object to console
  submitHandler = (e) => {
    e.preventDefault();
    console.log(this.state);

    axios.post(this.URI, this.state, { headers: this.headers})
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
  };


  render() {
    const { scenename } = this.state;
    return (
      //<div>PostPhotoScene</div>
      <div>
        <form onSubmit={this.submitHandler}>
          <div>
            <input
              className="bg-gray-100 text-black-500 p-2 m-4 w-50"
              type="text"
              placeholder ="photoscene name"
              name="scenename"
              value={scenename}
              onChange={this.changeHandler}
            />
          </div>
          <button
            className="bg-gray-400 text-black p-2 m-4 w-30 h-10"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default PostPhotoScene;
