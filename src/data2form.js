/**
 * Data2Form - A utility to populate HTML form fields with data.
 * 
 * @param {HTMLElement} form_element - The form element to populate.
 * @returns {Object} - An object with methods to fill the form and adjust settings.
 */
const Data2Form = (form_element) => {
    // Default settings
    let settings = {
        throwOnMissingField: true,
        throwOnUnsupportedType: true,
        throwOnFileError: true,
        throwOnInvalidSelectOption: true,
    };

    // Supported input types
    let supportedTypes = ['checkbox', 'color', 'date', 'email', 'file', 'hidden', 'month', 'number', 'password', 'radio', 'range', 'search', 'tel', 'text', 'time', 'url', 'week', 'select-one', 'datetime-local'];

    // Check if jQuery is available
    let hasJQuery = ('undefined' != typeof window.jQuery);

    // Callback for specific type
    let callbacks = {}

    /**
     * Get input field by name.
     * 
     * @param {String} name - The name of the input field.
     * @returns {Object} - An object indicating existence, type, and nodes of the field.
     */
    function getInputField(name) {
        let fields = form_element.querySelectorAll(`[name="${name}"]`);
        if (fields.length < 1) {
            return {
                exists: false
            };
        }
        return {
            exists: true,
            type: fields[0].type,
            nodes: fields
        };
    }

    /**
     * Fill a file input field.
     * 
     * @param {HTMLElement} field - The file input field.
     * @param {String} value - The value to set (must be an empty string).
     * @returns {Boolean} - True if successfully set.
     */
    function fillFile(field, value) {
        if (value !== '') {
            if (settings.throwOnFileError) throw `Field '${field.name}' only supports empty string`;
            return false;
        }
        return true;
    }

    /**
     * Fill checkbox fields.
     * 
     * @param {NodeList} fields - The list of checkbox input elements.
     * @param {String} values - A comma-separated string of values to set.
     * @returns {Boolean} - True if successfully set.
     */
    function fillCheckbox(fields, values) {
        let filledAny = false;
        values = values.split(',');
        for (let field of fields) {
            let checked = (values.includes(field.value)) ? true : false;
            field.checked = checked;
            if (checked) filledAny = true;
        }
        return filledAny;
    }

    /**
     * Fill radio fields.
     * 
     * @param {NodeList} fields - The list of radio input elements.
     * @param {String} value - The value to set.
     * @returns {Boolean} - True if successfully set.
     */
    function fillRadio(fields, value) {
        let filledAny = false;
        for (let field of fields) {
            let checked = (value == field.value) ? true : false;
            field.checked = checked;
            if (checked) filledAny = true;
        }
        return filledAny;
    }

    /**
     * Fill a generic input field.
     * 
     * @param {HTMLElement} field - The input field to set.
     * @param {String} value - The value to set.
     * @returns {Boolean} - True if successfully set.
     */
    function fillField(field, value) {
        field.value = value;
        return true;
    }

    /**
     * Fill a select field.
     * 
     * @param {HTMLElement} field - The select element.
     * @param {String} value - The value to set.
     * @returns {Boolean} - True if successfully set.
     */
    function fillSelect(field, value) {
        let optionExists = Array.from(field.options).some(option => option.value === value);
        if (!optionExists) {
            if (settings.throwOnInvalidSelectOption) throw `Field '${key}' does not have select option value '${value}'`;
            return false;
        }
        field.value = value;
        if (hasJQuery) {
            $(field).trigger('change');
        }
        return true;
    }

    return {
        /**
         * Fill the form with data.
         * 
         * @param {Object} data - An object containing key-value pairs of form data.
         * @returns {Boolean} - True when done.
         */
        fill(data) {
            let result = {
                success: true,
                errors: []
            };

            for (let key in data) {
                if (!data.hasOwnProperty(key)) {
                    continue;
                }

                let input = getInputField(key);
                if (!input.exists) {
                    let error = `Field '${key}' does not exist`;
                    result.success = false;
                    result.errors.push(error);
                    if (settings.throwOnMissingField) console.error(error);
                    continue;
                }

                if (!supportedTypes.includes(input.type)) {
                    let error = `Field '${key}' type not supported`;
                    result.success = false;
                    result.errors.push(error);
                    if (settings.throwOnUnsupportedType) console.error(error);
                    continue;
                }

                try {
                    let filled;
                    switch (input.type) {
                        case 'file':
                            filled = fillFile(input.nodes[0], data[key]);
                            break;
                        case 'checkbox':
                            filled = fillCheckbox(input.nodes, data[key]);
                            break;
                        case 'radio':
                            filled = fillRadio(input.nodes, data[key]);
                            break;
                        case 'select-one':
                            filled = fillSelect(input.nodes[0], data[key]);
                            break;
                        default:
                            filled = fillField(input.nodes[0], data[key]);
                            break;
                    }
                    if (filled && callbacks[input.type]) {
                        callbacks[input.type](input.nodes[0], data[key]);
                    }
                } catch (error) {
                    result.errors.push(error);
                    result.success = false;
                    console.error(error);
                }
            }

            return result;
        },
        /**
         * Adjust settings
         * 
         * @param {String} key - The setting key to adjust.
         * @param {Boolean} value - The value to set for the specified setting.
         */
        setting(key, value) {
            if (key == 'strict') {
                for (let i in settings) {
                    settings[i] = value;
                }
            }
            settings[key] = value;
        },
        /**
         * Register a callback function to be executed after a specific input type is filled.
         * 
         * @param {String} type - The input type to callback after fill.
         * @param {Function} fn - The callback function.
         */
        callbackAfterFill(type, fn) {
            if (typeof fn === 'function') {
                callbacks[type] = fn;
            } else {
                throw new Error('Callback must be a function');
            }
        }
    }
}