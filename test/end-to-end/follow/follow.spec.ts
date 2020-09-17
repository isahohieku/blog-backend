import supertest from 'supertest';
import server from '../../../server';
import { expect } from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { User, UserI } from '../../../models/user';
import httpCodes from '../../../constants/http-status-codes';
import responseCodes from '../../../constants/response-codes';

const app = new server().app;
const request = supertest(app);

let user: UserI;
let anotherUser: UserI;

describe('test following an author - /api/follows', (): void => {
    let sandbox: sinon.SinonSandbox;
    before(async (): Promise<void> => {
        user = await User.findOne({ email: 'johndoe@email.com' });
        const newUser: Partial<UserI> = new User({
            email: 'testinguser@email.com',
            password: 'password', fullName: 'Testing User'
        });
        anotherUser = await newUser.save();
        sandbox = sinon.createSandbox();
        sandbox.stub(jwt, 'verify').callsArgWith(2, null, user);
    });

    after(async (): Promise<void> => {
        await User.findOneAndDelete({ _id: anotherUser.id });
        sandbox.restore();
    });

    it('/api/follows - All follows', (done): void => {
        request
            .get('/api/follows')
            .set('Authorization', 'Bearer Auth')
            .set('Accept', 'application/json')
            .expect(httpCodes.SUCCESS)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                expect(body).to.have.property('data').to.be.an('array');
                expect(body).to.have.property('message').to.equal('');
                return done();
            });
    });

    it('/api/follow - Follow an author', (done): void => {
        request
            .post(`/api/follows?author=${anotherUser.id}`)
            .set('Authorization', 'Bearer Auth')
            .set('Accept', 'application/json')
            .expect(httpCodes.SUCCESS)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                expect(body).to.have.property('message').to.equal('');
                return done();
            });
    });

    it('/api/follows - An author a user follows', (done): void => {
        request
            .get(`/api/follows?following=${anotherUser.id}`)
            .set('Authorization', 'Bearer Auth')
            .set('Accept', 'application/json')
            .expect(httpCodes.SUCCESS)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                expect(body).to.have.property('data').to.be.an('object');
                expect(body).to.have.property('message').to.equal('');
                return done();
            });
    });

    it('/api/follow - Follow an author already followed', (done): void => {
        request
            .post(`/api/follows?author=${anotherUser.id}`)
            .set('Authorization', 'Bearer Auth')
            .set('Accept', 'application/json')
            .expect(httpCodes.FORBIDDEN)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.have.property('code').to.equal(responseCodes.FORBIDDEN);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.FORBIDDEN);
                expect(body).to.have.property('message').not.to.equal('');
                return done();
            });
    });

    it('/api/follow - Unfollow an author', (done): void => {
        request
            .delete(`/api/follows?author=${anotherUser.id}`)
            .set('Authorization', 'Bearer Auth')
            .set('Accept', 'application/json')
            .expect(httpCodes.SUCCESS)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                expect(body).to.have.property('message').to.equal('');
                return done();
            });
    });

    it('/api/follow - unFollow an author not followed', (done): void => {
        request
            .delete(`/api/follows?author=${anotherUser.id}`)
            .set('Authorization', 'Bearer Auth')
            .set('Accept', 'application/json')
            .expect(httpCodes.FORBIDDEN)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.have.property('code').to.equal(responseCodes.FORBIDDEN);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.FORBIDDEN);
                expect(body).to.have.property('message').not.to.equal('');
                return done();
            });
    });
    
});