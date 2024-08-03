
import { asyncHandler } from "../../../utils/globalErrorhandling.js"
import { AppError } from "../../../utils/classError.js"
import cartModel from "../../../DB/models/cart.model.js";
import productModel from "../../../DB/models/product.model.js";


// ------------------------------------- createCart --------------------------------------
export const createCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const product = await productModel.findOne({_id: productId, stock:{ $gte: quantity }})
    if(!product){
        next(new AppError("product not found or out of stock", 409))
    }

    const cartExist = await cartModel.findOne({ user: req.user._id });
    if(!cartExist){
        const cart = await cartModel.create({
            user: req.user._id,
            products:[{
                    productId,
                    quantity
                }]
         })
         res.status(201).json({ message: 'done', cart });
    }

    let flag = false
    for (const product of cartExist.products) {
        if(productId == product.productId){
            product.quantity = quantity
            flag = true
        }  
    }
    if(!flag){
    cartExist.products.push({
                            productId,
                            quantity
                        })
            }

    await cartExist.save()        
    res.status(201).json({ message: 'done', cartExist });

});


// ------------------------------------- removeCart --------------------------------------
export const removeCart = asyncHandler(async (req, res, next) => {
    const { productId} = req.body;


    const cartExist = await cartModel.findOneAndUpdate({ 
        user: req.user._id,
        "products.productId": productId
     },{
        $pull : {products: {productId}}
     },{
        new: true
     });
    res.status(201).json({ message: 'done', cartExist });

});


// ------------------------------------- clearCart --------------------------------------
export const clearCart = asyncHandler(async (req, res, next) => {


    const cartExist = await cartModel.findOneAndUpdate({ 
        user: req.user._id,
     },{
        products : []
     },{
        new: true
     });
     if(!cartExist){
        next(new AppError("cart not exist", 409))
     }
    res.status(201).json({ message: 'done', cartExist });

});
