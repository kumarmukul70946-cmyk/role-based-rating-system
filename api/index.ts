
import 'reflect-metadata';
import { bootstrap } from '../backend/src/main';

export default async (req: any, res: any) => {
    try {
        // Special case for root health check
        if (req.url === '/api' || req.url === '/api/') {
            return res.json({ status: 'Backend Node Online', version: '1.0.0' });
        }

        const app = await bootstrap();
        return app(req, res);
    } catch (e: any) {
        console.error('VERCEL_SERVERLESS_ERROR:', e);
        res.status(500).json({
            message: 'Internal Gateway Error',
            error: e.message,
            tip: 'Check your Vercel logs and ensure DATABASE_URL is set correctly.'
        });
    }
};
