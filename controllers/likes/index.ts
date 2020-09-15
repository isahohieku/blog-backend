import { Request, Response, NextFunction } from 'express';
import { ArticleLikes } from '../../models/article-likes';
import { pickToken, verifyTok } from '../../utils/auth';
import { UserI } from '../../models/user';
import sendSuccess from '../../responses/success';
import CustomError from '../../responses/error/custom-error';
import httpCodes from '../../constants/http-status-codes';
import responseCodes from '../../constants/response-codes';
import responseMessages from '../../constants/response-messages';

class LikeService {
    public constructor() { }

    public async getLikesArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { article } = req.query;

            const token: string = pickToken(req);
            const user: Partial<UserI> = verifyTok(null, null, token);

            const result = article ? await ArticleLikes.findOne({ article, author: user.id })
                : await ArticleLikes.find({ author: user.id });

            sendSuccess(res, 'controller:likes', result);
        } catch (e) {
            next(e);
        }
    }

    public async likeArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { article } = req.query;

            const token: string = pickToken(req);
            const user: Partial<UserI> = verifyTok(null, null, token);

            const like = await ArticleLikes.findOne({ article, author: user.id });


            if (!like) {
                const query = new ArticleLikes();
                query.author = user.id;
                query.article = article;

                const result = await query.save();

                sendSuccess(res, 'controller:likes', result);
                return;
            }

            throw new CustomError(responseCodes.FORBIDDEN, 'Already liked this article', httpCodes.FORBIDDEN);
        } catch (e) {
            next(e);
        }
    }

    public async unLikeArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { article } = req.query;

            const token: string = pickToken(req);
            const user: Partial<UserI> = verifyTok(null, null, token);

            const like = await ArticleLikes.findOne({ article, author: user.id });


            if (like) {
                const result = await ArticleLikes.findOneAndDelete({ _id: like.id });

                sendSuccess(res, 'controller:likes', result);
                return;
            }

            throw new CustomError(responseCodes.FORBIDDEN, 'You\'ve not liked this article', httpCodes.FORBIDDEN);
        } catch (e) {
            next(e);
        }
    }
}

export default new LikeService();