from flask import Flask, jsonify, request
from flask_cors import CORS
from io import BytesIO

app = Flask(__name__)
CORS(app)

@app.route("/video_request", methods=["POST"])
def video_request():
    """Handles the upload of a file"""
    d = {}
    try:
        file = request.files['file']

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

@app.route("/")
def helloWorld():
    return "hello,cross-origin world!"

if __name__ == "__main__":
    app.run(debug=True)