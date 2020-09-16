import Auth from './auth';
import User from './user';
import Tag from './tag';
import Article from './article';
import Like from './like';
import Favourite from './favourite';
import Follows from './follow';
import Comment from './comment';
import CommentLikes from './comment-like';

export default [
    ...Auth,
    ...User,
    ...Tag,
    ...Article,
    ...Like,
    ...Favourite,
    ...Follows,
    ...Comment,
    ...CommentLikes
];