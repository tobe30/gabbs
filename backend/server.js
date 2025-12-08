import express from 'express';
import { connectDB } from './lib/db.js';
import "dotenv/config"; 
import { clerkMiddleware, requireAuth } from '@clerk/express'
import connectCloudinary from './lib/cloudinary.js';
import productRoutes from './routes/product.routes.js';
import userRoutes from './routes/user.routes.js';


const app = express();
const PORT = process.env.PORT || 5000;

await connectCloudinary();
app.use(clerkMiddleware());// Clerk middleware to handle authentication

app.use(requireAuth())// Protect all routes below this middleware
app.use(express.json());// To parse JSON request bodies
app.get('/', (req, res)=>res.send('API is running...'));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})