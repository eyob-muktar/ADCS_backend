/* eslint-disable no-undef */
/* eslint-disable indent */
const request = require('supertest');
const User = require('../../models/users');

let server;

describe('/forgotPassword', () => {
	beforeEach(() => { server = require('../../index'); });
	afterEach(async () => {
		await server.close();
		await User.remove({});
	});

	describe('POST /', () => {

		let user;
		let email;

		const exec = async () => {
			return await request(server)
				.post('/forgotPassword')
				.send({ email });
        };
        
        beforeEach(() => {
            user = new User ({
                name: 'user1', 
				email: 'user@mail.com', 
				password: 'asdfgh', 
				confirmPassword: 'asdfgh', 
				phoneNumber: '0987654321'
            });
            user.save();

            email = 'user@mail.com';
        });

        it('should return 404 if the email is not found', async () => {
            email = 'user1@mail.com';

            const res = await exec();

            expect(res.status).toBe(404);

        });
        
		it('should update resetPasswordToken with a random byte', async () => {
            
            const res = await exec();

            const updatedUser = await User.findById(user._id);

            expect(updatedUser.resetPasswordToken).not.toBeNull();
            expect(updatedUser.resetPasswordExpiry).not.toBeNull();
            expect(res.status).toBe(200);
		});
	});
});