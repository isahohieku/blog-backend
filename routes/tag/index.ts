import Route from '../../lib/route';
import HttpMethod from '../../lib/httpMethod';
import { verifyToken } from '../../validators/auth';
import Tag from '../../controllers/tag';

const TAG_URL = '/api/tag';

const tag: Route[] = [
    {
        path: TAG_URL,
        method: HttpMethod.GET,
        middlewares: [verifyToken],
        controller: [Tag.getTag]
    },
    {
        path: TAG_URL,
        method: HttpMethod.POST,
        middlewares: [verifyToken],
        controller: [Tag.createTag]
    }
];

export default tag;