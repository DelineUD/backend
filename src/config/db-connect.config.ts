import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

const getMongoString = (configService: ConfigService) =>
  'mongodb://' + configService.get('DB_HOST') + ':' + configService.get('DB_PORT');
console.log('DB_LOGIN');
const getMongoOptions = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const getMongoConfig = async (configService: ConfigService): Promise<MongooseModuleOptions> => {
  return {
    uri: getMongoString(configService),
    ...getMongoOptions(),
  };
};
