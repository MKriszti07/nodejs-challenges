const request = require('supertest');
const nock = require('nock');
const { app } = require('../app');
const { BASE_URL } = require('../externalApi');

describe('GET /api/weather', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    test('returns mocked weather data', async () => {
        const scope = nock(BASE_URL)
            .get('/weather')
            .query({ city: 'Berlin' })
            .reply(200, { temperatureC: 22, condition: 'Sunny' });

        const res = await request(app).get('/api/weather?city=Berlin');

        expect(res.statusCode).toBe(200);
        expect(res.body.ok).toBe(true);
        expect(res.body.data).toEqual({
            city: 'Berlin',
            temperatureC: 22,
            condition: 'Sunny'
        });

        scope.done(); // asserts the mock was actually hit
    });

    test('handles upstream failure', async () => {
        const scope = nock(BASE_URL)
            .get('/weather')
            .query({ city: 'Paris' })
            .reply(500, { error: 'oops' });

        const res = await request(app).get('/api/weather?city=Paris');

        expect(res.statusCode).toBe(502);
        expect(res.body.ok).toBe(false);

        scope.done();
    });
});