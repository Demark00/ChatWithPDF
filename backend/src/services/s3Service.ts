const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL!; // e.g. https://d123abc.cloudfront.net
import s3 from "../aws/s3";

export const uploadToS3 = async (fileBuffer: Buffer, fileName: string, mimeType: string) => {
  const s3Key = `uploads/${Date.now()}_${fileName}`;

  const uploadResult = await s3.upload({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: mimeType,
  }).promise();

  const cloudfrontUrl = `${CLOUDFRONT_URL}/${s3Key}`;

  return { key: s3Key, url: cloudfrontUrl }; // ✅ Use this URL on frontend
};
