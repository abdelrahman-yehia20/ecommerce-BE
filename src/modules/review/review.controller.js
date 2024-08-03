
import { asyncHandler } from "../../../utils/globalErrorhandling.js"
import { AppError } from "../../../utils/classError.js"
import reviewModel from "../../../DB/models/review.model.js";
import productModel from "../../../DB/models/product.model.js";
import orderModel from "../../../DB/models/order.model.js";


// ------------------------------------- createReview --------------------------------------
export const createReview = asyncHandler(async (req, res, next) => {
    const { comment, rate } = req.body;
    const{productId} = req.params
    const product = await productModel.findById(productId);
    if(!product){
        next(new AppError("product not exist", 409))
    }
    const reviewExist = await reviewModel.findOne({ 
        createdBy: req.user._id,
        productId
     });
    if(reviewExist){
        next(new AppError("review already exist", 409))
    }

    const order = await orderModel.findOne({
        user: req.user._id,
        "products.productId": productId,
        status : "delivered"
    })
    console.log(order);

    if(!order){
        next(new AppError("order not found", 409))
    }

    const review = await reviewModel.create({
        comment,
       rate,
       productId,
       createdBy: req.user._id
    })
    // the rate Avg with for loop
    // const reviews = await reviewModel.find({productId})
    // let sum = 0
    // for (const review of reviews) {
    //     sum += review.rate
    // }
    // product.rateAvg = sum / reviews.length

    sum = product.rateAvg * product.rateNum
    sum = sum + rate
    product.rateAvg = sum / (product.rateNum + 1)
    product.rateNum += 1
    await product.save()

    res.status(201).json({ message: 'done', review });
});



// ------------------------------------- deleteReview --------------------------------------
export const deleteReview = asyncHandler(async (req, res, next) => {
    const{id} = req.params

    const review = await reviewModel.findOne({ 
        _id: id,
        createdBy : req.user._id
     });
    if(!review){
        next(new AppError("review already exist", 409))
    }

    const product = await productModel.findById(productId);
    if(!product){
        next(new AppError("product not exist", 409))
    }

    sum = product.rateAvg * product.rateNum
    sum = sum - review.rate
    product.rateAvg = sum / (product.rateNum - 1)
    product.rateNum -= 1
    await product.save()

    res.status(201).json({ message: 'done', review });
});
