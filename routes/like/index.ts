import Route from '../../lib/route';
import HttpMethod from '../../lib/httpMethod';
import { verifyToken } from '../../validators/auth';
import Like from '../../controllers/likes';

const LIKE_URL = '/api/article/like';

const like: Route[] = [
    {
        path: LIKE_URL,
        method: HttpMethod.GET,
        middlewares: [verifyToken],
        controller: [Like.getLikesArticle]
    },
    {
        path: LIKE_URL,
        method: HttpMethod.POST,
        middlewares: [verifyToken],
        controller: [Like.likeArticle]
    },
    {
        path: LIKE_URL,
        method: HttpMethod.DELETE,
        middlewares: [verifyToken],
        controller: [Like.unLikeArticle]
    }
];

export default like;