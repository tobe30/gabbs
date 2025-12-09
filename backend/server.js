import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './lib/db.js';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import productRoutes from './routes/product.routes.js';
import userRoutes from './routes/user.routes.js';
import { clerkWebhooks } from './controllers/webhooks.js';

const app = express();
await connectDB()

app.use(cors());
app.use(clerkMiddleware());// Clerk middleware to handle authentication
app.use(requireAuth())// Protect all routes below this middleware

//routes
app.get('/', (req, res) => {
    res.send('Hello World!'); 
})
app.use(express.json());// To parse JSON request bodies

app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

//port 
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})