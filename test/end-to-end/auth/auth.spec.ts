import supertest from 'supertest';
import { expect } from 'chai';
import server from '../../../server';
import {
    validRegistrationDetails
} from '../../mock-data/user';
import { User } from '../../../models/user';
import httpCodes from '../../../constants/http-status-codes';
import responseCodes from '../../../constants/response-codes';
import responseMessages from '../../../constants/response-messages';

const app = new server().app;
const request = supertest(app);

let id: string;

describe('test authentication process - /api/auth/', (): void => {

    it('/api/auth/ - Valid registration detail', (done): void => {
        request
            .post('/api/auth/')
            .send(validRegistrationDetails)
            .set('Accept', 'application/json')
            .expect(httpCodes.SUCCESS)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.be.an('object');
                expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                expect(body).to.have.property('message').not.to.equal('');

                const { data } = body;
                id = data.id;

                expect(data).to.have.property('fullName').not.to.equal(null);
                expect(data).to.have.property('id').to.be.a('string');
                expect(data).to.have.property('email').not.to.equal(null);

                return done();
            });
    }).timeout(10000);

    it('/api/auth/ - Valid but existing registration detail', (done): void => {
        request
            .post('/api/auth/')
            .send(validRegistrationDetails)
            .set('Accept', 'application/json')
            .expect(httpCodes.FORBIDDEN)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.be.an('object');
                expect(body).to.have.property('code').to.equal(responseCodes.USER_EXIST);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.FORBIDDEN);
                expect(body).to.have.property('message').not.to.equal('');

                return done();
            });
    });

    it('/api/auth/ - InValid registration detail', (done): void => {
        const invalidSignupDetail = {
            fullName: 0,
            email: 'hellothere',
            password: 'pass'
        };

        request
            .post('/api/auth/')
            .send(invalidSignupDetail)
            .set('Accept', 'application/json')
            .expect(httpCodes.FORBIDDEN)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.be.an('object');
                expect(body).to.have.property('code').to.equal(responseCodes.INVALID_PARAMS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.FORBIDDEN);
                expect(body).to.have.property('message').not.to.equal('');

                return done();
            });
    });

    it('/api/auth/login - Valid login detail', (done): void => {
        delete validRegistrationDetails.fullName;
        request
            .post('/api/auth/login')
            .send(validRegistrationDetails)
            .set('Accept', 'application/json')
            .expect(httpCodes.SUCCESS)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.be.an('object');
                expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                expect(body).to.have.property('message').to.equal('');

                const { data } = body;

                expect(data).to.have.property('fullName').not.to.equal(null);
                expect(data).to.have.property('id').to.be.a('string');
                expect(data).to.have.property('email').not.to.equal(null);
                expect(data).to.have.property('token').not.to.equal(null);

                return done();
            });
    });

    it('/api/auth/login - Invalid login detail - Wrong password', (done): void => {
        delete validRegistrationDetails.fullName;
        validRegistrationDetails.password = 'pass';
        request
            .post('/api/auth/login')
            .send(validRegistrationDetails)
            .set('Accept', 'application/json')
            .expect(422)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.be.an('object');
                expect(body).to.have.property('code').to.equal(responseCodes.WRONG_CREDENTIALS);
                expect(body).to.have.property('statusCode').to.equal(422);
                expect(body).to.have.property('message').not.to.equal('');

                return done();
            });
    });

    it('/api/auth/login - Invalid login detail: invalid email', (done): void => {
        const invalidEmail = validRegistrationDetails;
        invalidEmail.email = 'heythere';
        request
            .post('/api/auth/login')
            .send(invalidEmail)
            .set('Accept', 'application/json')
            .expect(httpCodes.FORBIDDEN)
            .end(async (err, res): Promise<void> => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.be.an('object');
                expect(body).to.have.property('code').to.equal(responseCodes.INVALID_PARAMS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.FORBIDDEN);
                expect(body).to.have.property('message').not.equal('');

                await User.findByIdAndDelete(id);

                return done();
            });
    }).timeout( 10000);

    it('/api/auth/login - Invalid login detail: non existing user', (done): void => {
        const invalidEmail = {
            email: 'isahohieku@nonexisting.com',
            password: 'password'
        };
        request
            .post('/api/auth/login')
            .send(invalidEmail)
            .set('Accept', 'application/json')
            .expect(httpCodes.NOT_FOUND)
            .end(async (err, res): Promise<void> => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.be.an('object');
                expect(body).to.have.property('code').to.equal(responseCodes.USER_NOT_FOUND);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.NOT_FOUND);
                expect(body).to.have.property('message').not.equal('');

                await User.findByIdAndDelete(id);

                return done();
            });
    }).timeout(10000);

    it('/api/auth/login - User not found', (done): void => {
        const loginWithWrongPassword = {
            email: 'johndoe@email.com',
            password: 'pass'
        };

        request
            .post('/api/auth/login')
            .send(loginWithWrongPassword)
            .set('Accept', 'application/json')
            .expect(httpCodes.NOT_FOUND)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.be.an('object');
                expect(body).to.have.property('code').to.equal(responseCodes.USER_NOT_FOUND);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.NOT_FOUND);
                expect(body).to.have.property('message').not.equal('');

                return done();
            });
    }).timeout(5000);
});