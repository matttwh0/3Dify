import React, { Component, useState } from "react";
import axios from "axios";

export function PostFile(photoscene, setPhotoScene){
    const [postfile, setPostFile] = useState(null);
    const [error, setError] = useState(null);

    const URI = 'https://developer.api.autodesk.com/photo-to-3d/v1/file'

    const headers = {
        Authorization: `Bearer ${photoscene}`,
        "Content-type": 'application/x-www-form-urlencoded'
        };

    const body = new URLSearchParams({
        photosceneid: '',
        type: '',
        //plug image in here?
    });


}