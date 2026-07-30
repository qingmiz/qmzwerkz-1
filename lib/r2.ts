import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Cloudflare R2 - S3-compatible storage, used for large product zip files
// (Supabase Storage's free tier caps individual files at 50MB, R2 doesn't).
// Required env vars (Vercel):
//   R2_ACCOUNT_ID
//   R2_ACCESS_KEY_ID
//   R2_SECRET_ACCESS_KEY
//   R2_BUCKET_NAME

function getClient() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 is not configured. Add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY in Vercel.');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

function getBucket() {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error('R2_BUCKET_NAME is not set.');
  return bucket;
}

// Returns a presigned URL the browser can PUT the file to directly -
// the file bytes never pass through our own server/Vercel function.
export async function getR2UploadUrl(key: string, contentType: string) {
  const client = getClient();
  const command = new PutObjectCommand({ Bucket: getBucket(), Key: key, ContentType: contentType });
  return getSignedUrl(client, command, { expiresIn: 300 }); // 5 minutes to start the upload
}

// Returns a short-lived presigned URL to download the file - only ever
// generated after our own purchase-verification check passes.
export async function getR2DownloadUrl(key: string) {
  const client = getClient();
  const command = new GetObjectCommand({ Bucket: getBucket(), Key: key });
  return getSignedUrl(client, command, { expiresIn: 60 }); // 60 seconds
}
