from flask import Flask, request, jsonify
from flask_cors import CORS
from deep_translator import GoogleTranslator

app = Flask(__name__)
CORS(app)

@app.route("/translate", methods=["POST"])
def translate():
    data = request.get_json()
    text = data.get("q", "")
    source = data.get("source", "en")
    target = data.get("target", "ko")
    try:
        translated_text = GoogleTranslator(source=source, target=target).translate(text)
        return jsonify({"translatedText": translated_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=3001, debug=True)
