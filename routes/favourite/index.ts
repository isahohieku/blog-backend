import Route from '../../lib/route';
import HttpMethod from '../../lib/httpMethod';
import { verifyToken } from '../../validators/auth';
import Like from '../../controllers/favorite';

const FAVOURITE_URL = '/api/article/favourite';

const like: Route[] = [
    {
        path: FAVOURITE_URL,
        method: HttpMethod.GET,
        middlewares: [verifyToken],
        controller: [Like.getfavouriteArticles]
    },
    {
        path: FAVOURITE_URL,
        method: HttpMethod.POST,
        middlewares: [verifyToken],
        controller: [Like.favouriteArticle]
    },
    {
        path: FAVOURITE_URL,
        method: HttpMethod.DELETE,
        middlewares: [verifyToken],
        controller: [Like.unFavouriteArticle]
    }
];

export default like;