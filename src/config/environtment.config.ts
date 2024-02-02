import { ConfigModuleOptions } from '@nestjs/config';

export const environmentConfig: ConfigModuleOptions = {
  envFilePath: '.env',
  isGlobal: true,
};
