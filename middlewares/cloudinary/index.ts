import { ConfigOptions, v2 as cloudinary } from 'cloudinary';
import CloudinaryStorage, { Options } from 'multer-storage-cloudinary';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

export default class UploadImage {

    private cloudinaryOptions: Partial<ConfigOptions>;

    public constructor() { }

    public handleUpload(req: Request, res: Response, next: NextFunction): void {
        const { CLOUD_NAME, CLOUDINARY_API_NAME, CLOUDINARY_API_SECRET, AVATAR } = process.env;

        this.cloudinaryOptions = {
            // eslint-disable-next-line @typescript-eslint/camelcase
            cloud_name: CLOUD_NAME,
            // eslint-disable-next-line @typescript-eslint/camelcase
            api_key: CLOUDINARY_API_NAME,
            // eslint-disable-next-line @typescript-eslint/camelcase
            api_secret: CLOUDINARY_API_SECRET
        };

        cloudinary.config(this.cloudinaryOptions);

        const storageOptions: Options = {
            cloudinary,
            params: {
                folder: AVATAR,
                // eslint-disable-next-line @typescript-eslint/camelcase
                allowed_formats: ['jpg', 'png'],
                transformation: [{ width: 500, height: 500, crop: 'limit' }]
            }
        };

        const storage = CloudinaryStorage(storageOptions);

        next(multer({ storage }));
    }
}