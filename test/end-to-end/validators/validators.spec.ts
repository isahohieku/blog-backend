import supertest from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { User, UserI } from '../../../models/user';

import server from '../../../server';
import httpCodes from '../../../constants/http-status-codes';
import responseCodes from '../../../constants/response-codes';

const app = new server().app;
const request = supertest(app);

let user: UserI;

describe('test validators', (): void => {
    let sandbox: sinon.SinonSandbox;
    before(async (): Promise<void> => {
        user = await User.findOne({ email: 'johndoe@email.com' });
        sandbox = sinon.createSandbox();
        sandbox.stub(jwt, 'verify').callsArgWith(2, null, user);
    });

    after((): void => {
        sandbox.restore();
    });
    it('/api/user - update user with invalid params', (done): void => {
        const data = { wrongParam: 'wrong param' };
        request
            .put('/api/user')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer Auth`)
            .expect(httpCodes.FORBIDDEN)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.have.property('code').to.equal(responseCodes.INVALID_PARAMS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.FORBIDDEN);
                expect(body).to.have.property('message').not.to.equal('');
                return done();
            });
    });

    it('/api/user - update user password with invalid params', (done): void => {
        const data = { wrongParam: 'wrong param' };
        request
            .post('/api/user/change-password')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer Auth`)
            .expect(httpCodes.FORBIDDEN)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.have.property('code').to.equal(responseCodes.INVALID_PARAMS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.FORBIDDEN);
                expect(body).to.have.property('message').not.to.equal('');
                return done();
            });
    });

    it('/api/user - forget user password with invalid params', (done): void => {
        const data = { wrongParam: 'wrong param' };
        request
            .post('/api/user/forgot-password')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer Auth`)
            .expect(httpCodes.FORBIDDEN)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.have.property('code').to.equal(responseCodes.INVALID_PARAMS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.FORBIDDEN);
                expect(body).to.have.property('message').not.to.equal('');
                return done();
            });
    });

    it('/api/user - Resetpassword with invalid params', (done): void => {
        const data = { wrongParam: 'wrong param' };
        request
            .post('/api/user/reset-password')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer Auth`)
            .expect(httpCodes.FORBIDDEN)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.have.property('code').to.equal(responseCodes.INVALID_PARAMS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.FORBIDDEN);
                expect(body).to.have.property('message').not.to.equal('');
                return done();
            });
    });
});
