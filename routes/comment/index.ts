import Route from "../../lib/route";
import HttpMethod from "../../lib/httpMethod";
import { verifyToken } from "../../validators/auth";
import Comment from '../../controllers/comment';
import { validateComment, validateCommentUpdate } from "../../validators/comment";

const COMMENT_URL = '/api/comments';

const Routes: Route[] = [
    {
        path: COMMENT_URL,
        method: HttpMethod.GET,
        middlewares: [verifyToken],
        controller: [Comment.getComments]
    },
    {
        path: COMMENT_URL,
        method: HttpMethod.POST,
        middlewares: [verifyToken, validateComment],
        controller: [Comment.addComment]
    },
    {
        path: COMMENT_URL,
        method: HttpMethod.PUT,
        middlewares: [verifyToken, validateCommentUpdate],
        controller: [Comment.updateComment]
    },
    {
        path: COMMENT_URL,
        method: HttpMethod.DELETE,
        middlewares: [verifyToken],
        controller: [Comment.deleteComment]
    }
];

export default Routes;