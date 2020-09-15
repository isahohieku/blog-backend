import Route from '../../lib/route';
import HttpMethod from '../../lib/httpMethod';
import { verifyToken } from '../../validators/auth';
import Follow from '../../controllers/follow';

const LIKE_URL = '/api/follows';

const follow: Route[] = [
    {
        path: LIKE_URL,
        method: HttpMethod.GET,
        middlewares: [verifyToken],
        controller: [Follow.getAuthorsFollowed]
    },
    {
        path: LIKE_URL,
        method: HttpMethod.POST,
        middlewares: [verifyToken],
        controller: [Follow.followAuthor]
    },
    {
        path: LIKE_URL,
        method: HttpMethod.DELETE,
        middlewares: [verifyToken],
        controller: [Follow.unFollowAuthor]
    }
];

export default follow;