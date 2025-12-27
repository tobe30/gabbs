import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './lib/db.js';
import { clerkMiddleware } from '@clerk/express'
import productRoutes from './routes/product.routes.js';
import userRoutes from './routes/user.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import { clerkWebhooks, stripeWebhook } from './controllers/webhooks.js';
import connectCloudinary from './lib/cloudinary.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import addressRoutes from './routes/address.routes.js';
import ratingRoutes from './routes/rating.routes.js';
import dashboardRoutes from './routes/dashboard.route.js';



const app = express();
await connectDB()
await connectCloudinary();

app.use(cors({
    origin:[ 
        'http://localhost:5173',
        'https://gabbs-psi.vercel.app'
    ], // your frontend URL
    credentials: true,
}));


//routes
app.get('/', (req, res) => {
    res.send('Hello World!'); 
})

app.post('/api/stripe', express.raw({ type: 'application/json'}), stripeWebhook)

app.use(express.json());// To parse JSON request bodies

app.use(clerkMiddleware());// Clerk middleware to handle authentication
app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/dashboard', dashboardRoutes);





//port 
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})