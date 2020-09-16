import Route from '../../lib/route';
import HttpMethod from '../../lib/httpMethod';
import { verifyToken } from '../../validators/auth';
import Comment from '../../controllers/comment-like';

const COMMENT_URL = '/api/comments';

const route: Route[] = [
    {
        path: `${COMMENT_URL}/likes`,
        method: HttpMethod.GET,
        middlewares: [verifyToken],
        controller: [Comment.getCommentsLiked]
    },
    {
        path: `${COMMENT_URL}/dislikes`,
        method: HttpMethod.GET,
        middlewares: [verifyToken],
        controller: [Comment.getCommentsDisliked]
    },
    {
        path: `${COMMENT_URL}/like`,
        method: HttpMethod.POST,
        middlewares: [verifyToken],
        controller: [Comment.like]
    },
    {
        path: `${COMMENT_URL}/like`,
        method: HttpMethod.DELETE,
        middlewares: [verifyToken],
        controller: [Comment.unLike]
    },
    {
        path: `${COMMENT_URL}/dislike`,
        method: HttpMethod.POST,
        middlewares: [verifyToken],
        controller: [Comment.dislike]
    },
    {
        path: `${COMMENT_URL}/undislike`,
        method: HttpMethod.DELETE,
        middlewares: [verifyToken],
        controller: [Comment.unDislike]
    }
];

export default route;