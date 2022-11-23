import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppBootstrapManager } from './app-bootstrap.manager';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  AppBootstrapManager.setAppDefaults(app);

  const config = new DocumentBuilder()
    .setTitle('Backend Api')
    .setDescription('Backend Api')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('/api/v1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
