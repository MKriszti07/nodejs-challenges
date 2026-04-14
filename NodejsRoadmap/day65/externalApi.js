require('dotenv').config();

const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'https://example-weather.test';

async function getWeather(city) {
    const resp = await axios.get(`${BASE_URL}/weather`, {
        params: { city }
    });

    // normalize the response shape for your app
    return {
        city,
        temperatureC: resp.data.temperatureC,
        condition: resp.data.condition
    };
}

module.exports = { getWeather, BASE_URL };