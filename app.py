from flask import Flask, render_template, request
from logic.logic import process_options
import logging
logging.basicConfig(filename='record.log', level=logging.DEBUG)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/result', methods=['POST'])
def result():
    # Retrieve options and descriptions from the form data
    options = request.form.getlist('option')
    descriptions = request.form.getlist('description')
    context = request.form.get('context')

    # Debugging: print the received data
    logging.info("Received options:", options)

    logging.info("Received descriptions:", descriptions)
    logging.info(context)

    # Check for duplicate options
    if len(set(options)) != len(options):
        return "Error: Duplicate options are not allowed!"
    if len(options)<2:
        return "It seems your message is incomplete. Could you provide the options you're asking about?"


    # Call the process_options function from logic.py
    # You can return a response to the client if needed
    return process_options(options, descriptions, context)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
