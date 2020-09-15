import { Request, Response, NextFunction } from 'express';
import { ArticleI, Article } from '../../models/articles';
import sendSuccess from '../../responses/success';
import httpCodes from '../../constants/http-status-codes';
import responseCodes from '../../constants/response-codes';
import responseMessages from '../../constants/response-messages';
import { pickToken, verifyTok } from '../../utils/auth';
import { UserI } from '../../models/user';
import CustomError from '../../responses/error/custom-error';

class ArticleService {
    public constructor() { }

    public async getArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id, slug, author } = req.query;
            let result: ArticleI | ArticleI[];

            if (id) {
                result = await Article.findOne({ _id: id });
            }

            if (author) {
                result = await Article.find({ author }).populate('favourites');
            }

            if (slug) {
                result = await Article.aggregate(
                    [
                        {
                            '$match': {
                                'title': new RegExp(slug as string, 'i')
                            }
                        }
                    ]
                );
            }

            if (!id && !slug && !author) {
                result = await Article.find({});
            }

            sendSuccess(res, 'controller:article', result);
        } catch (e) {
            next(e);
        }
    }

    public async addArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: Partial<ArticleI> = req.body;
            const token: string = pickToken(req);
            const user: Partial<UserI> = verifyTok(req, res, token);
            data.author = user.id;

            const article = new Article(data);

            const result = await article.save();

            sendSuccess(res, 'controller:article', result);

        } catch (e) {
            next(e);
        }
    }

    public async updateArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: Partial<ArticleI> = req.body;
            const token: string = pickToken(req);
            const user: Partial<UserI> = verifyTok(req, res, token);

            const article: ArticleI = await Article.findOne({_id: data.id});

            if (!article) {
                throw new CustomError(responseCodes.NOT_FOUND,
                    responseMessages.RESOURCE_NOT_FOUND('Article'), httpCodes.NOT_FOUND);
            }

            if (article.author !== user.id) {
                throw new CustomError(responseCodes.FORBIDDEN,
                    'You have no privilege to modify this article', httpCodes.FORBIDDEN);
            }

            const params = {};

            Object.getOwnPropertyNames(data).forEach((item): void => params[item] = data[item]);
            console.log(params);
            return;
            const result = await article.updateOne(article, params);

            sendSuccess(res, 'controller:article', result);

        } catch (e) {
            next(e);
        }
    }
}

export default new ArticleService();