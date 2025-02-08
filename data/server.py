from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import os
import subprocess
import json

app = Flask(__name__)

# Allow CORS for all routes
CORS(app)

@app.route('/generate-map', methods=['POST'])
def generate_map():
    data = request.get_json()
    # Assuming data contains necessary information to run query_route.py
    # Save data to a temporary file if needed
    with open('input_data.json', 'w') as f:
        json.dump(data, f)
    
    # Run the query_route.py script
    start = data.get("start")
    end = data.get("end")
    print("Server:", start, end)
    result = subprocess.run(['python', 'query_route.py', start, end], capture_output=True, text=True)
    print("Result:", result)

    if result.returncode != 0:
        return jsonify({'error': 'Failed to generate map', 'details': result.stderr}), 500
    
    # Read the generated safe_route_map.html file
    with open('safe_route_map.html', 'r') as f:
        html_content = f.read()
    
    return html_content

if __name__ == '__main__':
    app.run(debug=True)
