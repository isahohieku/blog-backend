import supertest from 'supertest';
import server from '../../../server';
import { expect } from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { User, UserI } from '../../../models/user';
import { ArticleI, Article } from '../../../models/articles';
import { TagI, Tag } from '../../../models/tags';
import httpCodes from '../../../constants/http-status-codes';
import responseCodes from '../../../constants/response-codes';
import { validRegistrationDetails } from '../../mock-data/user';

const app = new server().app;
const request = supertest(app);

let user: UserI;
let article: ArticleI;
let savedTag: TagI;

describe('test liking an article - /api/likes', (): void => {
    let sandbox: sinon.SinonSandbox;
    before(async (): Promise<void> => {
        user = await new User({ ...validRegistrationDetails }).save();
        savedTag = await new Tag({ title: 'Test', author: user.id }).save();
        const data: Partial<ArticleI> = {
            body: 'testing', title: 'Just testing',
            tags: [savedTag.id], slug: 'just-testing',
            author: user.id
        };
        const newArticle = new Article(data);
        article = await newArticle.save();
        sandbox = sinon.createSandbox();
        sandbox.stub(jwt, 'verify').callsArgWith(2, null, user);
    });

    after(async (): Promise<void> => {
        await Article.findOneAndDelete({ _id: article.id });
        await Tag.findOneAndDelete({ _id: savedTag.id });
        await User.findOneAndDelete({ _id: user.id });
        sandbox.restore();
    });

    it('/api/article/like - All articles liked', (done): void => {
        request
            .get('/api/article/like')
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

    it('/api/article/like - Like an article', (done): void => {
        request
            .post(`/api/article/like?article=${article.id}`)
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

    it('/api/article/like - An article a user liked', (done): void => {
        request
            .get(`/api/article/like?article=${article.id}`)
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

    it('/api/article/like - Like an article already liked', (done): void => {
        request
            .post(`/api/article/like?article=${article.id}`)
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

    it('/api/article/like - unlike an article', (done): void => {
        request
            .delete(`/api/article/like?article=${article.id}`)
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

    it('/api/article/like - unlike an article not liked', (done): void => {
        request
            .delete(`/api/follows?article=${article.id}`)
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