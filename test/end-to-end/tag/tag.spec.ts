import supertest from 'supertest';
import server from '../../../server';
import { expect } from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { User, UserI } from '../../../models/user';
import { TagI, Tag } from '../../../models/tags';
import httpCodes from '../../../constants/http-status-codes';
import responseCodes from '../../../constants/response-codes';

const app = new server().app;
const request = supertest(app);

let user: UserI;
let tag: TagI;

describe('test liking an article - /api/likes', (): void => {
    let sandbox: sinon.SinonSandbox;
    before(async (): Promise<void> => {
        user = await new User({ email: 'testuser@email.com', fullName: 'Test User', password: 'pass' }).save();

        sandbox = sinon.createSandbox();
        sandbox.stub(jwt, 'verify').callsArgWith(2, null, user);
    });

    after(async (): Promise<void> => {
        await User.findOneAndDelete({ _id: user.id });
        await Tag.findOneAndDelete({ _id: tag._id });
        sandbox.restore();
    });

    it('/api/tag - create a tag', (done): void => {
        const data = { tag: 'Testing' };
        request
            .post(`/api/tag`)
            .set('Authorization', 'Bearer Auth')
            .set('Accept', 'application/json')
            .send(data)
            .expect(httpCodes.SUCCESS)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                tag = body.data;
                expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                expect(body).to.have.property('message').to.equal('');
                return done();
            });
    });

    it('/api/tag - create a tag that already exist', (done): void => {
        const data = { tag: 'Testing' };
        request
            .post(`/api/tag`)
            .set('Authorization', 'Bearer Auth')
            .set('Accept', 'application/json')
            .send(data)
            .expect(httpCodes.FORBIDDEN)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.have.property('code').to.equal(responseCodes.RESOURCE_EXIST);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.FORBIDDEN);
                expect(body).to.have.property('message').not.to.equal('');
                return done();
            });
    });

    it('/api/tag - get all tags', (done): void => {
        request
            .get('/api/tag')
            .set('Authorization', 'Bearer Auth')
            .set('Accept', 'application/json')
            .expect(httpCodes.SUCCESS)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                expect(body).to.have.property('message').to.equal('');
                expect(body).to.have.property('data').to.be.an('array');
                return done();
            });
    });

    it('/api/tag - search tags based on term', (done): void => {
        request
            .get(`/api/tag?term=in`)
            .set('Authorization', 'Bearer Auth')
            .set('Accept', 'application/json')
            .expect(httpCodes.SUCCESS)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                expect(body).to.have.property('message').to.equal('');
                expect(body).to.have.property('data').to.be.an('array');
                return done();
            });
    });

    it('/api/tag - get tag by id', (done): void => {
        request
            .get(`/api/tag?id=${tag._id}`)
            .set('Authorization', 'Bearer Auth')
            .set('Accept', 'application/json')
            .expect(httpCodes.SUCCESS)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                expect(body).to.have.property('message').to.equal('');
                expect(body).to.have.property('data').to.be.an('object');
                return done();
            });
    });

});