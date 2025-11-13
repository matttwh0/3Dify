from flask import Flask, jsonify, request, Blueprint

#create blueprint to be registered in main
video_submit_bp = Blueprint("video_submit", __name__, template_folder="templates")

@video_submit_bp.route("/video_request", methods=["POST"])

def video_request():

    """Handles the upload of a file"""
    d = {}
    try:
        file = request.files['file'] #named 'file' in message.jsx

        filename = file.filename
        print(f"Uploading file {filename}")

        file_bytes = file.read()
        #file_content = BytesIO(file_bytes).readlines()
        #print(file_content)
        d['status'] = 1
        d['filename'] = filename

    except Exception as e:
        print(f"Couldn't upload file {e}")
        d['status'] = 0

    return jsonify(d)
