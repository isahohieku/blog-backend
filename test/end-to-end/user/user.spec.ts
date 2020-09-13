import dotEnv from 'dotenv';
dotEnv.config();
import supertest from 'supertest';
import path from 'path';
import server from '../../../server';
import { expect } from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { userData, invalidToken } from '../../mock-data/user';
import EmailService from '../../../lib/email';
import { User, UserI } from '../../../models/user';
import httpCodes from '../../../constants/http-status-codes';
import responseCodes from '../../../constants/response-codes';
import CustomError from '../../../responses/error/custom-error';

const app = new server().app;
const request = supertest(app);

let user: UserI;

describe('test user data processing - /api/user', (): void => {
    it('/api/user - With missing token', (done): void => {
        request
            .get('/api/user')
            .set('Accept', 'application/json')
            .expect(httpCodes.UNAUTHORIZED)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.have.property('code').to.equal(responseCodes.MISSING_TOKEN);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.UNAUTHORIZED);
                expect(body).to.have.property('message').not.to.equal('');
                return done();
            });
    });


    it('/api/user - Valid user detail with invalid token', (done): void => {
        request
            .get('/api/user')
            .set('Accept', 'application/json')
            .set('Authorization', invalidToken)
            .expect(httpCodes.UNAUTHORIZED)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.be.an('object');
                expect(body).to.have.property('code').to.equal(responseCodes.UNAUTHORIZED);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.UNAUTHORIZED);
                expect(body).to.have.property('message').not.to.equal('');

                return done();
            }).timeout(10000);
    });

    describe('User endpoint - /api/user', (): void => {

        let sandbox: sinon.SinonSandbox;
        before(async (): Promise<void> => {
            user = await User.findOne({ email: 'johndoe@email.com' });

            sandbox = sinon.createSandbox();
            sandbox.stub(jwt, 'verify').callsArgWith(2, null, user);
            sandbox.stub(EmailService, 'sendEmail').resolves(true);
        });

        after((): void => {
            sandbox.restore();
        });

        it('/api/user - Update user but email does not exist', (done): void => {
            const data = { bio: 'I am a boy', id: '5f5defeed9548a81ca0a1e0f' };
            request
                .put(`/api/user`)
                .send(data)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer Auth`)
                .expect(httpCodes.NOT_FOUND)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.NOT_FOUND);
                    expect(body).to.have.property('statusCode').to.equal(httpCodes.NOT_FOUND);
                    expect(body).to.have.property('message').not.to.equal('');

                    return done();
                });
        });

        it('/api/user - update user profile', (done): void => {
            const data = { bio: 'I am a boy', id: user.id };

            request
                .put('/api/user')
                .set('Accept', 'application/json')
                .send(data)
                .set('Authorization', `Bearer Auth`)
                .expect(httpCodes.SUCCESS)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                    expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                    expect(body).to.have.property('message').not.to.equal('');

                    return done();
                });
        });

        it('/api/user - get users', (done): void => {
            request
                .get('/api/user')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer Auth`)
                .expect(httpCodes.SUCCESS)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                    expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                    expect(body).to.have.property('message').to.equal('');

                    return done();
                });
        });

        it('/api/user - get users a specific user', (done): void => {
            request
                .get(`/api/user?id=${user.id}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer Auth`)
                .expect(httpCodes.SUCCESS)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                    expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                    expect(body).to.have.property('message').to.equal('');

                    return done();
                });
        });

        it('/api/user - update user password', (done): void => {
            const data = { oldPassword: 'password', newPassword: 'password' };
            request
                .post(`/api/user/change-password`)
                .send(data)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer Auth`)
                .expect(httpCodes.SUCCESS)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                    expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                    expect(body).to.have.property('message').not.to.equal('');

                    return done();
                });
        });

        it('/api/user - update user with wrong password', (done): void => {
            const data = { oldPassword: 'passwords', newPassword: 'password' };
            request
                .post(`/api/user/change-password`)
                .send(data)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer Auth`)
                .expect(httpCodes.FORBIDDEN)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.FORBIDDEN);
                    expect(body).to.have.property('statusCode').to.equal(httpCodes.FORBIDDEN);
                    expect(body).to.have.property('message').not.to.equal('');

                    return done();
                });
        });

        it('/api/user - update user avatar', (done): void => {
            request
                .post(`/api/user/avatar`)
                .set('Accept', 'application/json')
                .field("Content-Type", "multipart/form-data")
                .attach(process.env['AVATAR'], path.resolve(__dirname, '../../../', "uploads/test.jpg"))
                .set('Authorization', `Bearer Auth`)
                .expect(httpCodes.SUCCESS)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                    expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                    expect(body).to.have.property('message').not.to.equal('');

                    return done();
                });
        }).timeout(10000);

        it('/api/user - Forgot Password but email does not exist', (done): void => {
            const data = { email: `${user.email}sd` };
            request
                .post(`/api/user/forgot-password`)
                .send(data)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer Auth`)
                .expect(httpCodes.NOT_FOUND)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.NOT_FOUND);
                    expect(body).to.have.property('statusCode').to.equal(httpCodes.NOT_FOUND);
                    expect(body).to.have.property('message').not.to.equal('');

                    return done();
                });
        });

        it('/api/user - Forgot Password', (done): void => {
            const data = { email: `${user.email}` };
            request
                .post(`/api/user/forgot-password`)
                .send(data)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer Auth`)
                .expect(httpCodes.SUCCESS)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    user = body.data;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                    expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                    expect(body).to.have.property('message').not.to.equal('');

                    return done();
                });
        });

        it('/api/user - Reset Password but email does not exist', (done): void => {
            const data = { email: `${user.email}sd`, token: user.forgotPasswordToken, password: 'password' };
            request
                .post(`/api/user/reset-password`)
                .send(data)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer Auth`)
                .expect(httpCodes.NOT_FOUND)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.NOT_FOUND);
                    expect(body).to.have.property('statusCode').to.equal(httpCodes.NOT_FOUND);
                    expect(body).to.have.property('message').to.equal('');

                    return done();
                });
        });

        it('/api/user - Reset Password but incorrect token', (done): void => {
            const data = { email: user.email, token: `${user.forgotPasswordToken}s`, password: 'password' };
            request
                .post(`/api/user/reset-password`)
                .send(data)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer Auth`)
                .expect(422)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.BAD_REQUEST);
                    expect(body).to.have.property('statusCode').to.equal(422);
                    expect(body).to.have.property('message').not.to.equal('');

                    return done();
                });
        });

        it('/api/user - Reset Password', (done): void => {
            const data = { email: `${user.email}`, token: user.forgotPasswordToken, password: 'password' };
            request
                .post(`/api/user/reset-password`)
                .send(data)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer Auth`)
                .expect(httpCodes.SUCCESS)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                    expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                    expect(body).to.have.property('message').not.to.equal('');

                    return done();
                });
        }).timeout(5000);

        it('/api/user - Confirm but email does not exist', (done): void => {
            const data = { email: `${user.email}sd`, verificationToken: user.verificationToken };
            request
                .put(`/api/user/confirm-email`)
                .send(data)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer Auth`)
                .expect(httpCodes.UNAUTHORIZED)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.USER_NOT_FOUND);
                    expect(body).to.have.property('statusCode').to.equal(httpCodes.UNAUTHORIZED);
                    expect(body).to.have.property('message').not.to.equal('');

                    return done();
                });
        });

        it('/api/user - Confirm email but invalid verification code', (done): void => {
            const data = { email: user.email, verificationToken: `${user.verificationToken}sd` };
            request
                .put(`/api/user/confirm-email`)
                .send(data)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer Auth`)
                .expect(401)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.INVALID_TOKEN);
                    expect(body).to.have.property('statusCode').to.equal(401);
                    expect(body).to.have.property('message').not.to.equal('');

                    return done();
                });
        });

        it('/api/user - Confirm email', (done): void => {
            const data = { email: user.email, verificationToken: user.verificationToken };
            request
                .put(`/api/user/confirm-email`)
                .send(data)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer Auth`)
                .expect(httpCodes.SUCCESS)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                    expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                    expect(body).to.have.property('message').not.to.equal('');

                    return done();
                });
        });

        it('/api/user - Request verification email but email not in request body', (done): void => {
            request
                .post(`/api/user/request-verification`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer Auth`)
                .expect(httpCodes.FORBIDDEN)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.FORBIDDEN);
                    expect(body).to.have.property('statusCode').to.equal(httpCodes.FORBIDDEN);
                    expect(body).to.have.property('message').not.to.equal('');

                    return done();
                });
        });

        it('/api/user - Request verification email but email does not exist', (done): void => {
            const data = { email: `${user.email}sd` };
            request
                .post(`/api/user/request-verification`)
                .send(data)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer Auth`)
                .expect(httpCodes.UNAUTHORIZED)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.USER_NOT_FOUND);
                    expect(body).to.have.property('statusCode').to.equal(httpCodes.UNAUTHORIZED);
                    expect(body).to.have.property('message').not.to.equal('');

                    return done();
                });
        });

        it('/api/user - Request verification email but email verified', (done): void => {
            const data = { email: user.email };
            request
                .post(`/api/user/request-verification`)
                .send(data)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer Auth`)
                .expect(httpCodes.FORBIDDEN)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.FORBIDDEN);
                    expect(body).to.have.property('statusCode').to.equal(httpCodes.FORBIDDEN);
                    expect(body).to.have.property('message').not.to.equal('');

                    return done();
                });
        });

        // it('/api/user - Confirm email', (done): void => {
        //     const data = { email: user.email, verificationToken: user.verificationToken };
        //     request
        //         .put(`/api/user/confirm-email`)
        //         .send(data)
        //         .set('Accept', 'application/json')
        //         .set('Authorization', `Bearer Auth`)
        //         .expect(httpCodes.SUCCESS)
        //         .end((err, res): void => {
        //             expect(err).to.be.null;
        //             const { body } = res;
        //             expect(body).to.be.an('object');
        //             expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
        //             expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
        //             expect(body).to.have.property('message').not.to.equal('');

        //             return done();
        //         });
        // });
    });

    describe('User enpoint - /api/user', (): void => {
        let sandbox: sinon.SinonSandbox;
        before(async (): Promise<void> => {
            user = await User.findOne({ email: 'johndoe@email.com' });
            const newLogin = { ...user };
            newLogin._id = '5f5defeed9548a81ca0a1e0e';
            sandbox = sinon.createSandbox();
            sandbox.stub(jwt, 'verify').callsArgWith(2, null, newLogin);
        });

        after((): void => {
            sandbox.restore();
        });

        it('/api/user - update user profile without privilege', (done): void => {
            const data = { bio: 'I am a boy', id: user.id };
            request
                .put('/api/user')
                .set('Accept', 'application/json')
                .send(data)
                .set('Authorization', `Bearer Auth`)
                .expect(httpCodes.FORBIDDEN)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.FORBIDDEN);
                    expect(body).to.have.property('statusCode').to.equal(httpCodes.FORBIDDEN);
                    expect(body).to.have.property('message').not.to.equal('');

                    return done();
                });
        });


        it('/api/user - update user avatar but user not found', (done): void => {
            request
                .post(`/api/user/avatar`)
                .set('Accept', 'application/json')
                .field("Content-Type", "multipart/form-data")
                .attach(process.env['AVATAR'], path.resolve(__dirname, '../../../', "uploads/test.jpg"))
                .set('Authorization', `Bearer Auth`)
                .expect(httpCodes.NOT_FOUND)
                .end((err, res): void => {
                    expect(err).to.be.null;
                    const { body } = res;
                    expect(body).to.be.an('object');
                    expect(body).to.have.property('code').to.equal(responseCodes.NOT_FOUND);
                    expect(body).to.have.property('statusCode').to.equal(httpCodes.NOT_FOUND);
                    expect(body).to.have.property('message').not.to.equal('');

                    return done();
                });
        }).timeout(10000);
    });
});