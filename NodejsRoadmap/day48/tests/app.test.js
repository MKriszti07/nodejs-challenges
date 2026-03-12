const request = require('supertest');
const app = require('../app');

describe('Items API', () => {
    it('GET /items should return list of items', async () => {
        const res = await request(app).get('/items');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('POST /items should create a new item when name is provided', async () => {
        const res = await request(app)
            .post('/items')
            .send({ name: 'New Item' });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.name).toBe('New Item');
    });

    it('POST /items should return 400 when name is missing', async () => {
        const res = await request(app)
            .post('/items')
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Name is required');
    });
});