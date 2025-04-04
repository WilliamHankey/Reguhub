const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: 'auto',
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.R2_PUBLIC_URL;

if (!BUCKET_NAME || !PUBLIC_URL) {
  throw new Error('Missing R2 configuration');
}

module.exports = {
  s3,
  BUCKET_NAME,
  PUBLIC_URL,
}; 