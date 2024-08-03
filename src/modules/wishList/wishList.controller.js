
import { asyncHandler } from "../../../utils/globalErrorhandling.js"
import { AppError } from "../../../utils/classError.js"
import wishListModel from "../../../DB/models/wishlist.model.js";
import productModel from "../../../DB/models/product.model.js";





// ------------------------------------- createWishList --------------------------------------
export const createWishList = asyncHandler(async (req, res, next) => {
   const {productId} = req.params
    const product = await productModel.findById(productId);
    if(!product){
        next(new AppError("product not exist", 409))
    }
    const wishList = await wishListModel.findOne({user: req.user._id})
    if(!wishList){
        const newWishList = await wishListModel.create({
            user : user.req._id,
            products: [productId]
        })
        return res.status(200).json({msg:"sucess", wishList : newWishList})
    }
       const wishList2 = await wishListModel.findOneAndUpdate({user: req.user._id},{
            $addToSet: {products : productId}
        },{new: true})
         res.status(200).json({msg:"sucess", wishList: wishList2})
    

});


