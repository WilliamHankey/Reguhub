import express, { Request, Response } from 'express';
import * as multer from 'multer';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { config } from '../../config/env';

const router = express.Router();
const upload = multer.default({ storage: multer.memoryStorage() });

// Use Multer's type definition instead of our custom one
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

router.post('/upload', upload.single('file'), async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Uploading file:', req.file.originalname);

    // Upload to Cloudflare Images
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    console.log('Sending to Cloudflare...');
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${config.cloudflare.accountId}/images/v2/direct_upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.cloudflare.apiToken}`,
        },
      }
    );

    const uploadUrl = await response.json();
    console.log('Got upload URL:', uploadUrl);

    if (!uploadUrl.success) {
      throw new Error('Failed to get upload URL from Cloudflare');
    }

    // Upload the image using the direct upload URL
    const uploadResponse = await fetch(uploadUrl.result.uploadURL, {
      method: 'POST',
      body: formData,
    });

    const result = await uploadResponse.json();
    console.log('Cloudflare upload response:', result);

    if (!result.success) {
      throw new Error('Failed to upload to Cloudflare');
    }

    return res.status(200).json({
      url: result.result.variants[0],
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

export default router; 