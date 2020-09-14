import { Request, Response, NextFunction } from 'express';
import { Tag, TagI } from '../../models/tags';
import sendSuccess from '../../responses/success';
import httpCodes from '../../constants/http-status-codes';
import responseCodes from '../../constants/response-codes';
import responseMessages from '../../constants/response-messages';
import { pickToken, verifyTok } from '../../utils/auth';
import { UserI } from '../../models/user';

class TagService {
    public constructor() { }

    public async createTag(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { tag } = req.body;
            const findTag: TagI = await Tag.findOne({ title: tag });

            if (findTag) {
                sendSuccess(res, 'controller:tag', null, responseMessages.RESOURCE_EXIST('Tag'));
                return;
            }

            const token: string = pickToken(req);
            const userData: Partial<UserI> = verifyTok(req, res, token) as Partial<UserI>;

            const query = new Tag();
            query.title = tag;
            query.author = userData.id;
            const result = await query.save();

            sendSuccess(res, 'controller:tag', result);
        } catch (e) {
            next(e);
        }
    }

    public async getTag(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id, term } = req.query;
            let result: TagI | TagI[] = [];

            if (id) {
                result = await Tag.findOne({ _id: id });
            }

            if (term) {
                result = await Tag.aggregate(
                    [
                        {
                            '$match': {
                                'title': new RegExp(term as string, 'i')
                            }
                        }
                    ]
                );
            }

            if (!id && !term) {
                result = await Tag.find({});
            }

            sendSuccess(res, 'controller:tag', result);
        } catch (e) {
            next(e);
        }
    }
}

export default new TagService();