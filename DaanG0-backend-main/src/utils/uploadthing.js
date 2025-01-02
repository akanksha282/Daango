import { createUploadthing } from 'uploadthing/express';

import 'dotenv/config';

const f = createUploadthing();

export const uploadRouter = {
    imageUploader: f({
        image: {
            maxFileSize: '4MB',
            maxFileCount: 1,
        },
    }).onUploadComplete((data) => {}),
};
