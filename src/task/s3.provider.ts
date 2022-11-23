import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { S3_PROVIDER_TOKEN } from './task.types';

export const S3Provider = {
  provide: S3_PROVIDER_TOKEN,
  useFactory: async (configService: ConfigService): Promise<S3> => {
    return new S3({
      accessKeyId: configService.get<string>('s3Config.awsId'),
      secretAccessKey: configService.get<string>('s3Config.awsSecret'),
    });
  },
  inject: [ConfigService],
};
