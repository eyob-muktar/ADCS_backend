/* eslint-disable no-undef */
const request = require('supertest');
const Food = require('../../models/foods');
const User = require('../../models/users');
const mongoose = require('mongoose');

let server;

describe('/foods', () => {
	beforeEach(() => { server = require('../../index'); });
	afterEach(async () => { 
		await server.close(); 
		await Food.remove({});
		await User.remove({});
	});

	describe('GET /', () => {
		it('should return all foods', async () => {
			await Food.collection.insertMany([
				{ name: 'pasta' },
				{ name: 'pasta2' }
			]);

			const res = await request(server).get('/foods');

			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2);
			expect(res.body.some(i => i.name === 'pasta' )).toBeTruthy();
			expect(res.body.some(i => i.name === 'pasta2' )).toBeTruthy();
		});

		it('should return an error message if there are no foods', async () => {
			const res = await request(server).get('/foods');

			expect(res.body).not.toBeNull();
		});
	});


	describe('GET /:id', () => {
		it('should return the specified food if valid id is given', async () => {
			const food = new Food({ name: 'pasta', price: 40 });
			await food.save();

			const res = await request(server).get('/foods/' + food._id);
            
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('name', food.name);
			expect(res.body).toHaveProperty('price', food.price);
		});

		it('should return 404 if invalid id is given', async () => {
        
			const res = await request(server).get('/foods/1');       
			expect(res.status).toBe(404);
		});

		it('should return 404 if the food with the given id is not found', async () => {
            
			const id = new mongoose.Types.ObjectId();
			const res = await request(server).get('/foods/' + id);

			expect(res.status).toBe(404);
		});
	});


	describe('POST /',  () => {

		let token;
		let name;
		let price;

		const exec = async () => {
			return await request(server)
				.post('/foods')
				.set('x-auth-token', token)
				.send({ name, price });
		};

		beforeEach(() => {
			const user = new User({
				name: 'user1', 
				email: 'user@mail.com', 
				password: 'asdfgh', 
				confirmPassword: 'asdfgh', 
				phoneNumber: '0987654321', 
				isAdmin: 'true'
			});
			user.save();

			token = user.generateAuthToken();
			name = 'food';
			price = '30'; 
		});

		it('should return 401 if client is not logged in', async () => {
			token = '';

			const res = await exec();

			expect(res.status).toBe(401);
		});

		it('should return 403 if client is not an admin', async () => {
            
			token = new User().generateAuthToken();

			const res = await exec();

			expect(res.status).toBe(403);
		});

		it('should return 400 if food input is invalid', async () => {
			name = '';
			price = '';
			const res = await exec();

			expect(res.status).toBe(400);
		});

		it('should save the food if food input is valid', async () => {
        
			await exec();

			const food = await Food.find({ name: 'food1' });

			expect(food).not.toBeNull();
		});

		it('should return the food if food input is valid', async () => {
          
			const res = await exec();

			expect(res.body).toHaveProperty('_id');
			expect(res.body).toHaveProperty('name', 'food');
		});
	});


	describe('PATCH /:id', () => {
		let food;
		let user;
		let newName;
		let newCategory;
		let newDescription;
		let newPrice;
		let id;
		let token;

		const exec = async () => {
			return await request(server)
				.patch('/foods/' + id)
				.send({
					name: newName,
					category: newCategory,
					description: newDescription,
					price: newPrice
				})
				.set('x-auth-token', token);
		};

		beforeEach(async () => {
			food = new Food({ name: 'food1', price: 30 });
			await food.save();

			user = new User({ name: 'user1', email: 'user@mail.com', password: 'asdfgh', confirmPassword: 'asdfgh', phoneNumber: '0987654321', isAdmin: 'true'});
			user.save();

			token = user.generateAuthToken();
			id = food._id;

			newName = 'food2';
			newCategory = 'lunch';
			newDescription = 'this is lunch';
			newPrice = 50;
		});
		it('should return 401 if the user is not logged in', async () => {
			token = '';
            
			const res = await exec();
			expect(res.status).toBe(401);
		});

		it('should return 403 if the user is not an admin', async () => {
			token = new User().generateAuthToken();
            
			const res = await exec();
			expect(res.status).toBe(403);
		});

		it('should return 404 if id is invalid', async () => {
			id = 1;
            
			const res = await exec();

			expect(res.status).toBe(404);
		});

		it('should return 404 if the food with the specified id was not found', async () => {
			id = mongoose.Types.ObjectId();
            
			const res = await exec();
			expect(res.status).toBe(404);
		});

		it('should update the food if input is valid', async () => {
            
			await exec();
			const updatedFood = await Food.findById(food._id);
			expect(updatedFood.name).toBe(newName);
			expect(updatedFood.category).toBe(newCategory);
			expect(updatedFood.description).toBe(newDescription);
			expect(updatedFood.price).toBe(newPrice);
            
		});

		it('should return the updated food if it is valid', async () => {
          
			const res = await exec();
			expect(res.body).toHaveProperty('_id');
			expect(res.body).toHaveProperty('name', newName);
		});

	});


	describe('DELETE /:id', () => {
		let food;
		let id;
		let token;

		const exec = async () => {
			return await request(server)
				.delete('/foods/' + id)
				.set('x-auth-token', token)
				.send();
		};

		beforeEach(async () => {
			food = new Food({ name: 'food1', price: 30 });
			await food.save();

			user = new User({ name: 'user1', email: 'user@mail.com', password: 'asdfgh', confirmPassword: 'asdfgh', phoneNumber: '0987654321', isAdmin: 'true'});
			user.save();

			token = user.generateAuthToken();
			id = food._id;
		});

		it('should return 401 if the user is not logged in', async () => {
			token = ''; 
			const res = await exec();
			expect(res.status).toBe(401);
		});

		it('should return 403 if the user is not an admin', async () => {
			token = new User().generateAuthToken();
			const res = await exec();
			expect(res.status).toBe(403);
		});

		it('should return 404 if id is invalid', async () => {
			id = 1;
			const res = await exec();
			expect(res.status).toBe(404);
		});

		it('should return 404 if the food with the specified id was not found', async () => {
			id = mongoose.Types.ObjectId(); 
			const res = await exec();
			expect(res.status).toBe(404);
		});

		it('should delete the food if input is valid', async () => {
			await exec();
			const foodInDb = await Food.findById(food._id);
			expect(foodInDb).toBeNull();
		});

		it('should return the deleted food if it is valid', async () => {
			const res = await exec();
			expect(res.body).toHaveProperty('_id', food._id.toHexString());
			expect(res.body).toHaveProperty('name', food.name);
		});

	});
});

