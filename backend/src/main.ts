import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

export async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    await app.listen(3000);
    console.log('Server running on http://localhost:3000');
}

if (require.main === module) {
    bootstrap().catch((error) => {
        console.error('BOOTSTRAP_ERROR:', error);
        process.exit(1);
    });
}
