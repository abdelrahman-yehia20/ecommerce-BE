
import { asyncHandler } from "../../../utils/globalErrorhandling.js"
import { AppError } from "../../../utils/classError.js"
import couponModel from "../../../DB/models/coupon.model.js";


// ------------------------------------- createCoupon --------------------------------------
export const createCoupon = asyncHandler(async (req, res, next) => {
    const { code, amount , fromDate, toDate } = req.body;
    const couponExist = await couponModel.findOne({ code: code?.toLowerCase() });
    couponExist && next(new AppError("coupon already exist", 409)) 

    const coupon = await couponModel.create({
       code,
       amount,
       fromDate,
       toDate,
       createdBy: req.user._id
    })
        res.status(201).json({ message: 'done', coupon });
});

// ------------------------------------- updateCoupon --------------------------------------
export const updateCoupon = asyncHandler(async (req, res, next) => {
    const{id} = req.params
    const { code, amount , fromDate, toDate } = req.body;
    const coupon = await couponModel.findOneAndUpdate(
        {
             _id:id, createdBy: req.user._id
        },
        {
            code,
            amount,
            fromDate,
            toDate
        },
    {
        new : true
    });
    !coupon && next(new AppError("coupon not exists exist or you are not the owner", 409)) 
    return  res.status(200).json({ message: 'done', coupon });
});

