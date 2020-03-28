/* eslint-disable no-undef */
const request = require('supertest');
const Order = require('../../models/orders');
const User = require('../../models/users');

let server;

describe('/orders', () => {
	beforeEach(() => { server = require('../../index'); });
	afterEach(async () => { 
		await server.close(); 
		await Order.deleteMany({});
		await User.deleteMany({});
	});

	let token;
	let order;
	let totalPrice;
	let userTwo;
	let balance;
	let id;

	describe('POST /', () => {
        
		const exec = async () => {
			return await request(server)
				.post('/orders')
				.set('x-auth-token', token)
				.send({ userTwo, items, totalPrice });
		};

		beforeEach(() => {
			const user = new User({
				name: 'user1',
				email: 'user@mail.com', 
				password: 'asdfgh', 
				confirmPassword: 'asdfgh', 
				phoneNumber: '0987654321', 
				balance: 100
			});
			user.save();
			id = user._id;
			userTwo = {name: 'user1', phoneNumber: '0987654321'};
			token = user.generateAuthToken();
			balance = 100;
			totalPrice = 50;
			items = [{name: 'pasta', qty: 3}, {name: 'firfir', qty: 2}];
		});

		it('should return 400 if the total price exceeds the user balance', async () => {
			totalPrice = 120;

			const res = await exec();
			expect(res.status).toBe(400);
		});

		it('should save the order and deduct the price from user balance if everything is correct', async () => {
			const res = await exec();
			expect(res.status).toBe(200);
			const order = await Order.find({ 'user.name' : 'user1'});
			console.log(order);
			expect(order).not.toBeNull();

			const userTw = await User.findById(id);
			console.log(userTw);
			expect(userTw.balance).toEqual(balance - totalPrice);
		});

		it('should return the order if everything is correct', async (done) => {
			const res = await exec();
			expect(res.body).toHaveProperty('_id');
			expect(res.body.user).toMatchObject(userTwo);
			done();
		});

	});

	describe('GET /', () => {
        
		const exec = async () => {
			return await request(server)
				.get('/orders')
				.set('x-auth-token', token);
		};

		beforeEach(() => {
			const user = new User({ name: 'user1', email: 'user@mail.com', password: 'asdfgh', confirmPassword: 'asdfgh', phoneNumber: '0987654321', isAdmin: 'true'});
			user.save();

			token = user.generateAuthToken();
		});
        
		it('should return all orders', async () => {

			await Order.collection.insertMany([
				{
					user: {name: 'user1', phoneNumber: '0987654321'},
					items: [{name: 'pasta', qty: 3}, {name: 'firfir', qty: 2}],
					totalPrice: 50
				},
				{
					user: {name: 'user2', phoneNumber: '0982654321'},
					items: [{name: 'pasta', qty: 23}, {name: 'firfir', qty: 12}],
					totalPrice: 150
				}
			]);
    
			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2);
			expect(res.body.some(i => i.user.name === 'user1' )).toBeTruthy();
			expect(res.body.some(i => i.user.name === 'user2' )).toBeTruthy();
		});

		it('should return an error message if there are no items', async () => {
			const res = await exec();

			expect(res.body).not.toBeNull();
		});
	});

	describe('DELETE /:id', () => {
		
		const exec = async () => {
			return await request(server)
				.delete('/orders/' + id)
				.set('x-auth-token', token)
				.send();
		};

		beforeEach(async() => {
			order = new Order ({
				user: {name: 'user1', phoneNumber: '0987654321'},
				items: [{name: 'pasta', qty: 3}, {name: 'firfir', qty: 2}],
				totalPrice: 50
			});
			await order.save();

			user = new User({ name: 'user1', email: 'user@mail.com', password: 'asdfgh', confirmPassword: 'asdfgh', phoneNumber: '0987654321', isAdmin: 'true'});
			user.save();

			token = user.generateAuthToken();			
			id = order._id;
		});

		it('should delete the order if everything is correct', async () => {
			await exec();
			const orderInDb = await Order.findById(order.id);
			expect(orderInDb).toBeNull();
		});
	});

});