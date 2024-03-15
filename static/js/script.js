document.addEventListener('DOMContentLoaded', function() {
    const addMoreButton = document.getElementById('add-more-options');
    const optionsContainer = document.getElementById('options-container');
    const form = document.getElementById('option-form');
    const resultContainer = document.getElementById('result-container');
    const resetButton = document.getElementById('reset-form');
    const loadingSpinner = document.getElementById('loading-spinner');

    addMoreButton.addEventListener('click', function() {
        const optionInput = document.createElement('input');
        optionInput.type = 'text';
        optionInput.name = 'option';
        optionInput.classList.add('form-control', 'mb-2');
        optionInput.placeholder = 'Enter Additional Option';
        optionInput.required = true;

        const toggleButton = document.createElement('button');
        toggleButton.textContent = '+';
        toggleButton.classList.add('btn', 'btn-secondary', 'toggle-description');
        toggleButton.type = 'button';
        toggleButton.setAttribute('data-toggle', 'collapse');
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.setAttribute('aria-controls', `description-${optionsContainer.children.length + 1}`);
        toggleButton.dataset.target = `#description-${optionsContainer.children.length + 1}`;
        toggleButton.addEventListener('click', toggleExpansion);

        const removeButton = document.createElement('button');
        removeButton.innerHTML = '&times;';
        removeButton.classList.add('btn', 'btn-danger', 'remove-option');
        removeButton.type = 'button';
        removeButton.addEventListener('click', removeOption);

        const newOptionContainer = document.createElement('div');
        newOptionContainer.classList.add('option', 'form-group');

        const inputGroup = document.createElement('div');
        inputGroup.classList.add('input-group');
        inputGroup.appendChild(optionInput);
        const inputGroupAppend = document.createElement('div');
        inputGroupAppend.classList.add('input-group-append');
        inputGroupAppend.appendChild(toggleButton);
        inputGroupAppend.appendChild(removeButton);
        inputGroup.appendChild(inputGroupAppend);

        newOptionContainer.appendChild(inputGroup);

        const descriptionInput = document.createElement('textarea');
        descriptionInput.name = 'description';
        descriptionInput.classList.add('form-control', 'mt-2', 'description-input', 'collapse');
        descriptionInput.placeholder = 'Description for the additional option.';
        descriptionInput.rows = 4;
        descriptionInput.id = `description-${optionsContainer.children.length + 1}`;

        newOptionContainer.appendChild(descriptionInput);

        // Insert the new option container after the second option
        const addMoreButtonParent = addMoreButton.parentNode;
        addMoreButtonParent.insertBefore(newOptionContainer, addMoreButton);

    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        loadingSpinner.style.display = 'block';

        fetch('/result', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            loadingSpinner.style.display = 'none';
            resultContainer.innerHTML = '';
            const dataSegments = data.split('\n');
            dataSegments.forEach((segment,index) => {
                segment = segment.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                const paragraph = document.createElement('p');
                if (index === 0) {
                    paragraph.innerHTML = `<strong><em>${segment}</em></strong>`;
                } else {
                    paragraph.innerHTML = segment;
                }
                resultContainer.appendChild(paragraph);
            });
        })
        .catch(error => {
            loadingSpinner.style.display = 'none';
            resultContainer.innerHTML = 'An error occurred while processing. Please try again.';
            console.error('Error:', error);
        });
    });

    resetButton.addEventListener('click', function() {
        resultContainer.innerHTML = '';
        const dynamicOptions = document.querySelectorAll('.option');
        for (let i = dynamicOptions.length - 1; i >= 2; i--) {
            optionsContainer.removeChild(dynamicOptions[i]);
        }
        form.reset();
    });

    function toggleExpansion(event) {
        const button = event.target;
        button.textContent = button.textContent === '+' ? '-' : '+';
    }

    function removeOption(event) {
        const optionContainer = event.target.closest('.option');
        optionsContainer.removeChild(optionContainer);
    }
    
    // Add event listeners to the existing toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-description');
    toggleButtons.forEach(button => {
        button.addEventListener('click', toggleExpansion);
    });
});
