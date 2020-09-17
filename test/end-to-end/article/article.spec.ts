import supertest from 'supertest';
import server from '../../../server';
import { expect } from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { User, UserI } from '../../../models/user';
import httpCodes from '../../../constants/http-status-codes';
import responseCodes from '../../../constants/response-codes';
import { ArticleI, Article } from '../../../models/articles';
import { TagI, Tag } from '../../../models/tags';

const app = new server().app;
const request = supertest(app);

let user: UserI;
let article: ArticleI;
let tagSample: TagI[];

describe('test user data processing - /api/article', (): void => {
    let sandbox: sinon.SinonSandbox;
    before(async (): Promise<void> => {
        user = await User.findOne({ email: 'johndoe@email.com' });
        tagSample = await Tag.find({});
        sandbox = sinon.createSandbox();
        sandbox.stub(jwt, 'verify').callsArgWith(2, null, user);
    });

    after(async (): Promise<void> => {
        await Article.findOneAndDelete({ _id: article.id });
        sandbox.restore();
    });

    it('/api/article - All articles by a user', (done): void => {
        request
            .get('/api/article')
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

    it('/api/article - Add article', (done): void => {
        const data: Partial<ArticleI> = {
            body: 'testing', title: 'Just testing',
            tags: [tagSample[0].id], slug: 'just-testing'
        };
        request
            .post('/api/article')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer Auth')
            .send(data)
            .expect(httpCodes.SUCCESS)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                article = body.data;
                expect(body).to.be.an('object');
                expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);

                done();
            });
    });

    it('/api/article - get articles by a slug', (done): void => {
        request
            .get(`/api/article?slug=${article.slug}`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer Auth')
            .expect(httpCodes.SUCCESS)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                expect(body).to.have.property('data').to.be.an('array');
                expect(body).to.have.property('message').to.equal('');
                done();
            });
    });

    it('/api/article - get articles by a author', (done): void => {
        request
            .get(`/api/article?author=${user.id}`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer Auth')
            .expect(httpCodes.SUCCESS)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                expect(body).to.have.property('data').to.be.an('array');
                expect(body).to.have.property('message').to.equal('');
                done();
            });
    });

    it('/api/article - update articles', (done): void => {
        // console.log('Article', article);
        const data: Partial<ArticleI> = {
            body: 'testing update',
            id: article.id
        };
        request
            .put('/api/article')
            .set('Authorization', 'Bearer Auth')
            .set('Accept', 'application/json')
            .send(data)
            .expect(httpCodes.SUCCESS)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                expect(body).to.have.property('data').to.be.an('object');
                expect(body).to.have.property('message').to.equal('');
                done();
            });
    });

});