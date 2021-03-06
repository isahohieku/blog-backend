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
import { CommentI } from '../../../models/comments';
import { validRegistrationDetails } from '../../mock-data/user';

const app = new server().app;
const request = supertest(app);

let user: UserI;
let article: ArticleI;
let comment: CommentI;
let savedTag: TagI;

describe('test comment article - /api/article/comment', (): void => {
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

    it('/api/comments - All comments articles by a user', (done): void => {
        request
            .get('/api/comments')
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

    it('/api/comment - comment an article', (done): void => {
        const data: Partial<CommentI> = { article: article.id, body: 'You are right' };
        request
            .post('/api/comments')
            .set('Authorization', 'Bearer Auth')
            .set('Accept', 'application/json')
            .send(data)
            .expect(httpCodes.SUCCESS)
            .end((err, res): void => {
                expect(err).to.be.null;
                const { body } = res;
                comment = body.data;
                expect(body).to.have.property('code').to.equal(responseCodes.SUCCESS);
                expect(body).to.have.property('statusCode').to.equal(httpCodes.SUCCESS);
                expect(body).to.have.property('message').to.equal('');
                return done();
            });
    });

    it('/api/comments - get comment of an articles by a user', (done): void => {
        request
            .get(`/api/comments?article=${article.id}`)
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

    it('/api/comment - update comment on an article', (done): void => {
        const data: Partial<CommentI> = { id: comment.id, body: 'You are right, it got updated' };
        request
            .put('/api/comments')
            .set('Authorization', 'Bearer Auth')
            .set('Accept', 'application/json')
            .send(data)
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

    describe('test comments likes and dislikes', (): void => {
        it('/api/comments/likes - get likes', (done): void => {
            request
                .get('/api/comments/likes')
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

        it('/api/comments/dislikes - get dislikes', (done): void => {
            request
                .get('/api/comments/dislikes')
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

        it('/api/comments/likes - like a comment', (done): void => {
            request
                .post(`/api/comments/like?comment=${comment.id}`)
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

        it('/api/comments/dislikes - dislike a comment', (done): void => {
            request
                .post(`/api/comments/dislike?comment=${comment.id}`)
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

        it('/api/comments/likes - unlike a comment', (done): void => {
            request
                .delete(`/api/comments/like?comment=${comment.id}`)
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

        it('/api/comments/dislike - undislike a comment', (done): void => {
            request
                .delete(`/api/comments/dislike?comment=${comment.id}`)
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
    });

    it('/api/comment - delete comment on an article', (done): void => {
        request
            .delete(`/api/comments?id=${comment.id}`)
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

});