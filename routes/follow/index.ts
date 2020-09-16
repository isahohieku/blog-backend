import Route from '../../lib/route';
import HttpMethod from '../../lib/httpMethod';
import { verifyToken } from '../../validators/auth';
import Follow from '../../controllers/follow';

const FOLLOW_URL = '/api/follows';

const follow: Route[] = [
    {
        path: FOLLOW_URL,
        method: HttpMethod.GET,
        middlewares: [verifyToken],
        controller: [Follow.getAuthorsFollowed]
    },
    {
        path: FOLLOW_URL,
        method: HttpMethod.POST,
        middlewares: [verifyToken],
        controller: [Follow.followAuthor]
    },
    {
        path: FOLLOW_URL,
        method: HttpMethod.DELETE,
        middlewares: [verifyToken],
        controller: [Follow.unFollowAuthor]
    }
];

export default follow;