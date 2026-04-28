import express, { type Express } from 'express';
import cors from 'cors';
import router from './routes';
import { globalErrorHandler } from './middlewares/error.middleware';

const app : Express = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);
app.use(globalErrorHandler);

app.listen(PORT, (): void => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});