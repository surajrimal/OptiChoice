document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('add-option');
    const optionsContainer = document.getElementById('options-container');
    const form = document.getElementById('option-form');
    const resultContainer = document.getElementById('result-container');
    const resetButton = document.getElementById('reset-form');
    const loadingSpinner = document.getElementById('loading-spinner');

    addButton.addEventListener('click', function() {

        
        const optionInputs = document.querySelectorAll('input[name="option"]');
        const enteredOptions = Array.from(optionInputs).map(input => input.value.trim());


        const optionInput = document.createElement('input');
        optionInput.type = 'text';
        optionInput.name = 'option';
        optionInput.classList.add('form-control', 'mb-2'); // Adding margin bottom for spacing
        optionInput.placeholder = 'Enter option';
        optionInput.required = true;

        

        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Add Description';
        toggleButton.classList.add('btn', 'btn-secondary', 'toggle-description');
        toggleButton.type = 'button';
        toggleButton.setAttribute('data-toggle', 'collapse');
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.setAttribute('aria-controls', `description-${optionsContainer.children.length + 1}`);
        toggleButton.dataset.target = `#description-${optionsContainer.children.length + 1}`;

        const newOptionContainer = document.createElement('div');
        newOptionContainer.classList.add('option', 'form-group');

        const inputGroup = document.createElement('div');
        inputGroup.classList.add('input-group');
        inputGroup.appendChild(optionInput);
        const inputGroupAppend = document.createElement('div');
        inputGroupAppend.classList.add('input-group-append');
        inputGroupAppend.appendChild(toggleButton);
        inputGroup.appendChild(inputGroupAppend);

        newOptionContainer.appendChild(inputGroup);

        const descriptionInput = document.createElement('textarea');
        descriptionInput.name = 'description';
        descriptionInput.classList.add('form-control', 'mt-2', 'description-input', 'collapse');
        descriptionInput.placeholder = 'Description for the option';
        descriptionInput.rows = 4;
        descriptionInput.id = `description-${optionsContainer.children.length + 1}`;

        newOptionContainer.appendChild(descriptionInput);

        // Insert new option container after the second option
        const contextFormGroup = document.querySelector('.context');
        optionsContainer.insertBefore(newOptionContainer, contextFormGroup);

        

    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);

        // Display loading spinner
        loadingSpinner.style.display = 'block';

        fetch('/result', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            // Hide loading spinner
            loadingSpinner.style.display = 'none';

            const dataSegments = data.split('\n');

            // Clear previous content in result container
            resultContainer.innerHTML = '';

            // Loop through dataSegments and create <p> elements for each segment
            dataSegments.forEach((segment,index) => {
                segment = segment.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                // Create a paragraph element
                const paragraph = document.createElement('p');
                
                if (index === 0) {
                    paragraph.innerHTML = `<strong><em>${segment}</em></strong>`;
                } else {
                    // Otherwise, set the inner HTML normally
                    paragraph.innerHTML = segment;
                }
                
                // Append the paragraph to the result container
                resultContainer.appendChild(paragraph);
            });
        })
        .catch(error => {
            // Hide loading spinner and display error message
            loadingSpinner.style.display = 'none';
            resultContainer.innerHTML = 'An error occurred while processing. Please try again.';
            console.error('Error:', error);
        });
    });

    resetButton.addEventListener('click', function() {
        // Clear result
        resultContainer.innerHTML = '';
    
        // Clear options, except for the first two
        const dynamicOptions = document.querySelectorAll('.option');
        for (let i = dynamicOptions.length - 1; i >= 2; i--) {
            optionsContainer.removeChild(dynamicOptions[i]);
        }
    
        // Reset form fields to initial state
        form.reset();
    });
});
