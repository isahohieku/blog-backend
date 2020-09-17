import { Request, Response, NextFunction } from 'express';
import { pickToken, verifyTok } from '../../utils/auth';
import { CommentLikes, CommentLikesI } from '../../models/comment-likes';
import { CommentDislikesI, CommentDislikes } from '../../models/comment-dislike';
import { UserI } from '../../models/user';
import sendSuccess from '../../responses/success';
import CustomError from '../../responses/error/custom-error';
import httpCodes from '../../constants/http-status-codes';
import responseCodes from '../../constants/response-codes';

class CommentsLikeService {
    public constructor() { }

    public async getCommentsLiked(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { comment } = req.body;

            const token: string = pickToken(req);
            const user: Partial<UserI> = verifyTok(null, null, token);

            let result: CommentLikesI | CommentLikesI[] = comment ?
                await CommentLikes.findOne({ comment, author: user.id })
                : await CommentLikes.find({ author: user.id });

            sendSuccess(res, 'controller:commentlike', result);

        } catch (e) {
            next(e);
        }
    }

    public async getCommentsDisliked(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { comment } = req.body;

            const token: string = pickToken(req);
            const user: Partial<UserI> = verifyTok(null, null, token);

            let result: CommentDislikesI | CommentDislikesI[] = comment ?
                await CommentDislikes.findOne({ comment, author: user.id })
                : await CommentDislikes.find({ author: user.id });

            sendSuccess(res, 'controller:commentlike', result);

        } catch (e) {
            next(e);
        }
    }

    public async like(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { comment } = req.query;

            const token: string = pickToken(req);
            const user: Partial<UserI> = verifyTok(null, null, token);

            const commentLike: CommentLikesI = await CommentLikes.findOne({ comment, author: user.id });


            if (!commentLike) {
                const query = new CommentLikes();
                query.author = user.id;
                query.comment = comment;

                const result = await query.save();

                sendSuccess(res, 'controller:commentlike', result);
                return;
            }

            throw new CustomError(responseCodes.FORBIDDEN, 'Already liked comment', httpCodes.FORBIDDEN);
        } catch (e) {
            next(e);
        }
    }

    public async unLike(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { comment } = req.query;

            const token: string = pickToken(req);
            const user: Partial<UserI> = verifyTok(null, null, token);

            const like: CommentLikesI = await CommentLikes.findOne({ comment, author: user.id });


            if (like) {
                const result = await CommentLikes.findOneAndDelete({ _id: like.id });

                sendSuccess(res, 'controller:commentlike', result);
                return;
            }

            throw new CustomError(responseCodes.FORBIDDEN, 'You\'ve not liked this comment', httpCodes.FORBIDDEN);
        } catch (e) {
            next(e);
        }
    }

    public async dislike(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { comment } = req.query;

            const token: string = pickToken(req);
            const user: Partial<UserI> = verifyTok(null, null, token);

            const commentDislike: CommentDislikesI = await CommentDislikes.findOne({ comment, author: user.id });


            if (!commentDislike) {
                const query = new CommentDislikes();
                query.author = user.id;
                query.comment = comment;

                const result = await query.save();

                sendSuccess(res, 'controller:commentlike', result);
                return;
            }

            throw new CustomError(responseCodes.FORBIDDEN, 'Already disliked comment', httpCodes.FORBIDDEN);
        } catch (e) {
            next(e);
        }
    }

    public async unDislike(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { comment } = req.query;

            const token: string = pickToken(req);
            const user: Partial<UserI> = verifyTok(null, null, token);

            const dislike: CommentDislikesI = await CommentDislikes.findOne({ comment, author: user.id });

            if (dislike) {
                const result = await CommentDislikes.findOneAndDelete({ _id: dislike.id });

                sendSuccess(res, 'controller:commentlike', result);
                return;
            }

            throw new CustomError(responseCodes.FORBIDDEN, 'You\'ve not disliked this comment', httpCodes.FORBIDDEN);
        } catch (e) {
            next(e);
        }
    }
}

export default new CommentsLikeService();