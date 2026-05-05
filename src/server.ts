import express, { type Express } from 'express';
import cors from 'cors';
import router from './routes/index.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';

const app : Express = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

app.use('/api', router);
app.use(globalErrorHandler);

app.listen(Number(PORT), '0.0.0.0', (): void => {
    console.log(`Server is running on port ${PORT}`);
});