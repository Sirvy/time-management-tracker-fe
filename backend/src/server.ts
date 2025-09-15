import express from 'express';
import cors from 'cors';
import AuthRoutes from './routes/Auth';
import UserRoutes from './routes/User';
import TaskRoutes from './routes/Tasks';
import DevToolsRoutes from './routes/DevTools';
import connectDB from './utils/db';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.MONGODB_URI);

const app = express();
const port = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';


// List of allowed origins
const allowedOrigins = [
    'http://localhost:3000'
];

// CORS configuration
const corsOptions = {
    origin: function(origin: any, callback: any) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.use('/auth', AuthRoutes);

app.use('/user', UserRoutes);

app.use('/tasks', TaskRoutes);

app.use('/categories', TaskRoutes);

app.use('/devtools', DevToolsRoutes);


app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});


app.get('/test', (req, res) => {
    res.json({ message: 'This is a test endpoint!' });
});


app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});