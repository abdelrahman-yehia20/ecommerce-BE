// src/modules/index.routes.js
import { Router } from 'express';
import userRouter from './user/user.routes.js';
import messageRouter from './message/message.routes.js';
import categoryRouter from './category/category.routes.js';
import  subCategoryRouter  from './subCategory/subCategory.routes.js';
import brandRouter from './brand/brand.routes.js';
import productRouter from './product/product.routes.js';
import couponRouter from './coupon/coupon.routes.js';
import cartRouter from './cart/cart.routes.js';
import orderRouter from './order/order.routes.js';
import reviewRouter from './review/review.routes.js';



const router = Router();

router.use('/users', userRouter);
router.use('/messages', messageRouter);
router.use('/categories',categoryRouter)
router.use('/subCategories',subCategoryRouter)
router.use('/brands', brandRouter);
router.use('/products', productRouter);
router.use('/coupons', couponRouter);
router.use('/cart', cartRouter);
router.use('/orders', orderRouter);
router.use('/reviews', reviewRouter);






export { router as appRouter };
