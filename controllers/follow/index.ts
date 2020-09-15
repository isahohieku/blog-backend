import { Request, Response, NextFunction } from 'express';
import { pickToken, verifyTok } from '../../utils/auth';
import { Following } from '../../models/follow';
import { UserI } from '../../models/user';
import sendSuccess from '../../responses/success';
import CustomError from '../../responses/error/custom-error';
import httpCodes from '../../constants/http-status-codes';
import responseCodes from '../../constants/response-codes';
import responseMessages from '../../constants/response-messages';

class LikeService {
    public constructor() { }

    public async getAuthorsFollowed(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { following } = req.query;

            const token: string = pickToken(req);
            const user: Partial<UserI> = verifyTok(null, null, token);

            let result = following ? await Following.findOne({ following, author: user.id })
                : await Following.find({ author: user.id });

            sendSuccess(res, 'controller:follow', result);

        } catch (e) {
            next(e);
        }
    }

    public async followAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { author } = req.query;

            const token: string = pickToken(req);
            const user: Partial<UserI> = verifyTok(null, null, token);

            const following = await Following.findOne({ following: author, author: user.id });


            if (!following) {
                const query = new Following();
                query.author = user.id;
                query.following = author;

                const result = await query.save();

                sendSuccess(res, 'controller:follow', result);
                return;
            }

            throw new CustomError(responseCodes.FORBIDDEN, 'Already following author', httpCodes.FORBIDDEN);
        } catch (e) {
            next(e);
        }
    }

    public async unFollowAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { author } = req.query;

            const token: string = pickToken(req);
            const user: Partial<UserI> = verifyTok(null, null, token);

            const like = await Following.findOne({ following: author, author: user.id });


            if (like) {
                const result = await Following.findOneAndDelete({ _id: like.id });

                sendSuccess(res, 'controller:follow', result);
                return;
            }

            throw new CustomError(responseCodes.FORBIDDEN, 'You\'ve not followed this author', httpCodes.FORBIDDEN);
        } catch (e) {
            next(e);
        }
    }
}

export default new LikeService();