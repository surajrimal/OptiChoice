from flask import Flask, render_template, request
from logic.logic import process_options
import logging
logging.basicConfig(filename='record.log', level=logging.DEBUG)

app = Flask(__name__)

# Dictionary to store processed inputs and their results
processed_results = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/termsofservice')
def terms_of_service():
    return render_template('termsofservice.html')

@app.route('/privacy')
def privacy_policy():
    return render_template('privacy.html')

@app.route('/result', methods=['POST'])
def result():
    global processed_results

    # Retrieve options and descriptions from the form data
    options = request.form.getlist('option')
    descriptions = request.form.getlist('description')
    context = request.form.get('context')

    # Debugging: print the received data
    logging.info("Received options:")
    logging.info(options)

    logging.info("Received descriptions:")
    logging.info(descriptions)
    logging.info(context)

    # Check if the same input has been processed before
    input_key = tuple(options + descriptions + [context])
    if input_key in processed_results:
        # Return the cached result
        return processed_results[input_key]

    # Check for duplicate options
    if len(set(options)) != len(options):
        return "Error: Duplicate options are not allowed!"
    if len(options) < 2:
        return "It seems your message is incomplete. Could you provide the options you're asking about?"

    # Call the process_options function only if the input is not cached
    result = process_options(options, descriptions, context)

    # Cache the result
    processed_results[input_key] = result

    return result

if __name__ == '__main__':
    app.run(debug=True, port=5001)
