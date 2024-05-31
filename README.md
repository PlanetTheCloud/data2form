# Data2Form
Data2Form is a JavaScript library designed to fill form inputs from object. Provides error handling and callback functionality.

## Features
- Supports multiple input types: `checkbox`, `color`, `date`, `email`, `file`, `hidden`, `month`, `number`, `password`, `radio`, `range`, `search`, `tel`, `text`, `time`, `url`, `week`, `select-one` and `datetime-local`.
- Error handling for missing fields, unsupported types, file input errors, and invalid select options.
- Will trigger `change` event if jQuery is present for select inputs.
- Ability to register callbacks to execute after filling specific input types.

## Getting Started

To use Data2Form, include the `data2form.min.js` script in your HTML file:

```html
<script src="data2form.min.js"></script>
```

or use jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/PlanetTheCloud/data2form/dist/data2form.min.js"></script>
```

## Usage

Initialize with form element:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    let form = document.querySelector('#myForm');
    let d2f = Data2Form(form);
});
```

Then call the `fill` method:

```javascript
let formData = {
    'username': 'john_doe',
    'email': 'john@example.com',
    'subscribe': 'yes',
    'gender': 'male',
    'country': 'US'
};

let result = d2f.fill(formData);

if (result.success) {
    console.log('Form filled successfully!');
} else {
    console.error('Errors occurred while filling the form:', result.errors);
}
```

## Adjusting Settings

The following settings are available: 

- `throwOnMissingField` (default `true`)
- `throwOnUnsupportedType` (default `true`)
- `throwOnFileError` (default `true`)
- `throwOnInvalidSelectOption` (default `true`)

To change them, call the `setting` method:

```javascript
d2f.setting('throwOnMissingField', false);
d2f.setting('throwOnUnsupportedType', false);

// Use 'strict' to set every value in settings at once.
d2f.setting('strict', false);
```

## Register Callbacks

Register a callback function to be executed after a specific input type is filled:

```javascript
d2f.callbackAfterFill('text', (field, value) => {
    console.log(`Text field '${field.name}' was filled with value '${value}'`);
});
```

## Examples

Please see the [examples](https://github.com/PlanetTheCloud/data2form/tree/main/examples) folder.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
