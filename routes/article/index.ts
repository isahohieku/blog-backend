import Route from '../../lib/route';
import HttpMethod from '../../lib/httpMethod';
import Article from '../../controllers/article';
import { validateArticle, validateUpdateArticle } from '../../validators/article';
import { verifyToken } from '../../validators/auth';

const ARTICLE_URL = '/api/article';

const article: Route[] = [
    {
        path: ARTICLE_URL,
        method: HttpMethod.GET,
        middlewares: [],
        controller: [Article.getArticle]
    },
    {
        path: ARTICLE_URL,
        method: HttpMethod.POST,
        middlewares: [verifyToken, validateArticle],
        controller: [Article.addArticle]
    },
    {
        path: ARTICLE_URL,
        method: HttpMethod.PUT,
        middlewares: [verifyToken, validateUpdateArticle],
        controller: [Article.updateArticle]
    }
];

export default article;