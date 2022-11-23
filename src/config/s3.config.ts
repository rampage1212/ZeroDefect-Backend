import { registerAs } from '@nestjs/config';

export default registerAs('s3Config', () => ({
  s3Bucket: process.env.S3_BUCKET,
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET,
}));
