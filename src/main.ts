import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  try {
    
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: 'https://mama-care.pages.dev',
      credentials: true,
    });
    const dataSource = app.get(DataSource);
    if (dataSource.isInitialized) {
      console.log('✅ Database connection is established');
    }
    app.listen(process.env.PORT || 10000, () => {
      console.log(`🚀 Server ready at https://mama-care.pages.dev`);
    });
  } catch (error) {}
}
bootstrap();
