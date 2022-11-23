import { plainToInstance } from 'class-transformer';
import { IsEnum, IsIn, IsString, MinLength, validateSync } from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  @MinLength(1)
  MONGO_URI: string;

  @IsString()
  @MinLength(64)
  JWT_SECRET: string;

  @IsString()
  @MinLength(1)
  JWT_REFRESH_TOKEN_COOKIE_DOMAIN: string;

  @IsString()
  @MinLength(1)
  JWT_REFRESH_TOKEN_DURATION_DAYS: string;

  @IsString()
  @MinLength(1)
  JWT_REFRESH_TOKEN_MAX_SESSIONS: string;

  @IsString()
  @MinLength(1)
  JWT_ACCESS_TOKEN_DURATION_MINUTES: string;

  @IsString()
  @IsIn(['true', 'false'])
  JWT_REFRESH_TOKEN_COOKIE_SECURE: 'true' | 'false';

  @IsString()
  @IsIn(['true', 'false'])
  JWT_REFRESH_TOKEN_COOKIE_HTTPONLY: 'true' | 'false';

  @IsString()
  @MinLength(1)
  S3_BUCKET;

  @IsString()
  @MinLength(1)
  AWS_ID;

  @IsString()
  @MinLength(1)
  AWS_SECRET;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
