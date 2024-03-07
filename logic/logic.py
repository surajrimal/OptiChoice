import requests
import logging

def process_options(options, descriptions, context):
    """
    Process the user input options and descriptions.
    """
    options_statement = " and ".join(options)

    # Check each description individually
    description_statements = []
    for option, description in zip(options, descriptions):
        if description.strip():  # Check if description is not empty
            description_statements.append(f"The option {option} has this description {description}")

    # Construct prompt based on whether descriptions are present
    if description_statements:
        descriptions_statement = ". ".join(description_statements)
        prompt = f"What is the best option among these options: {options_statement}. {descriptions_statement}. Please answer exactly one among {options_statement}. Provide shortest answer as possible. After that in next paragraph also provide one line logic behind this answer."
    else:
        prompt = f"What is the best option among these options: {options_statement}. Please answer exactly one among {options_statement}. Provide shortest answer as possible. After that in next paragraph also provide one line logic behind this answer."
    if context:
        prompt = prompt + " The context is "+ context
    return ai_logic(prompt)



    # You can perform further processing here as needed

def ai_logic(prompt):
    logging.info(prompt)

        
    url = "http://0.0.0.0:10000/v1/chat/completions"
    body = {
        #"model": "gpt-3.5-turbo-16k",
        "model": "gpt-4",
        "stream": False,
        "messages": [
            {"role": "assistant", "content": prompt}
        ]
    }
    json_response = requests.post(url, json=body).json().get('choices', [])

    for choice in json_response:
        print(choice)
        return choice.get('message', {}).get('content', '')
