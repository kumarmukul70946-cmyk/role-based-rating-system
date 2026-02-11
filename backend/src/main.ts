import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

let cachedApp: INestApplication;

export async function bootstrap(): Promise<any> {
    console.log('Starting NestJS bootstrap...');
    if (!cachedApp) {
        try {
            console.log('Creating NestExpressApplication...');
            const app = await NestFactory.create<NestExpressApplication>(AppModule);

            console.log('Configuring app...');
            app.enableCors();
            app.useGlobalPipes(new ValidationPipe({
                whitelist: true,
                transform: true,
            }));

            // Prefix all routes with /api to match Vercel routing
            if (process.env.VERCEL || process.env.VERCEL_ENV) {
                app.setGlobalPrefix('api');
            }

            console.log('Initializing app...');
            await app.init();
            cachedApp = app;
            console.log('Bootstrap complete!');
        } catch (error) {
            console.error('BOOTSTRAP_ERROR:', error);
            throw error;
        }
    }
    return cachedApp.getHttpAdapter().getInstance();
}

// Only run listen if this file is executed directly (local dev)
if (require.main === module) {
    async function startLocal() {
        const app = await NestFactory.create(AppModule);
        app.enableCors();
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            transform: true,
        }));
        await app.listen(3000);
        console.log('Local server running on http://localhost:3000');
    }
    startLocal();
}
