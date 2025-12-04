from flask import Flask, Blueprint, jsonify
from flask_cors import CORS
#from blueprints.video_submit import video_submit_bp 
#from blueprints.post_photoscene import post_photoscene_bp
from blueprints.kiri import kiri_bp
app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        ]
    }
})

#register blueprints 
app.register_blueprint(kiri_bp)
#app.register_blueprint(video_submit_bp)
#app.register_blueprint(post_photoscene_bp)

@app.route("/")
def helloWorld():
    return "hello world"

if __name__ == "__main__":
    app.run(debug=True)

    #curl -X POST http://127.0.0.1:5000/kiri_api
