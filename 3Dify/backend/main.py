from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/video_request", methods=["POST"])

@app.route("/")
def helloWorld():
    return "hello,cross-origin world!"