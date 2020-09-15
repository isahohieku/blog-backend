import { Request, Response, NextFunction } from 'express';
import { Favourite, FavouriteI } from '../../models/favourites';
import { pickToken, verifyTok } from '../../utils/auth';
import { UserI } from '../../models/user';
import sendSuccess from '../../responses/success';
import CustomError from '../../responses/error/custom-error';
import httpCodes from '../../constants/http-status-codes';
import responseCodes from '../../constants/response-codes';

class FavouriteService {
    public constructor() { }

    public async getfavouriteArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { article } = req.query;

            const token: string = pickToken(req);
            const user: Partial<UserI> = verifyTok(null, null, token);

            const result = article ? await Favourite.findOne({ article, author: user.id })
                : await Favourite.find({ author: user.id });

            sendSuccess(res, 'controller:likes', result);
        } catch (e) {
            next(e);
        }
    }

    public async favouriteArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { article } = req.query;

            const token: string = pickToken(req);
            const user: Partial<UserI> = verifyTok(null, null, token);

            const favourite = await Favourite.findOne({ article, author: user.id });

            if (!favourite) {
                const query = new Favourite();
                query.author = user.id;
                query.article = article;

                const result = await query.save();

                sendSuccess(res, 'controller:favourite', result);
                return;
            }

            throw new CustomError(responseCodes.FORBIDDEN, 'Article is already your favourite', httpCodes.FORBIDDEN);

        } catch (e) {
            next(e);
        }
    }

    public async unFavouriteArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { article } = req.query;

            const token: string = pickToken(req);
            const user: Partial<UserI> = verifyTok(null, null, token);

            const favourite = await Favourite.findOne({ article, author: user.id });

            if (favourite) {
                const result = await Favourite.findOneAndDelete({ author: user.id });

                sendSuccess(res, 'controller:favourite', result);
                return;
            }

            throw new CustomError(responseCodes.FORBIDDEN, 'Article is already your favourite', httpCodes.FORBIDDEN);

        } catch (e) {
            next(e);
        }
    }
}

export default new FavouriteService();