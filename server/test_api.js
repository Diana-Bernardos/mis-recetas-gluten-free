const axios = require('axios');
const API_KEY = '015a1a0e4c914d2d91f460240a17f54';

console.log('Testing API Key:', API_KEY);

axios.get('https://api.spoonacular.com/recipes/complexSearch', {
    params: {
        apiKey: API_KEY,
        query: 'pasta',
        number: 1
    }
})
.then(res => {
    console.log('Success! Status:', res.status);
    console.log('Data:', res.data);
})
.catch(err => {
    console.error('Error! Status:', err.response ? err.response.status : 'Unknown');
    console.error('Message:', err.message);
    if (err.response) console.error('Response:', err.response.data);
});
