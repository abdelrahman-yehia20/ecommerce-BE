import cartModel from '../../../DB/models/cart.model.js';
import couponModel from '../../../DB/models/coupon.model.js';
import orderModel from '../../../DB/models/order.model.js'
import productModel from '../../../DB/models/product.model.js';
import { AppError } from "../../../utils/classError.js"
import { asyncHandler } from "../../../utils/globalErrorhandling.js"
import { createInvoice } from '../../../utils/pdf.js';

// ------------------------------------- Create order  --------------------------------------
export const createOrder = asyncHandler(async (req, res, next) => {
    const { productId, quantity, couponCode, address, phone, paymentMethod } = req.body;
    if (couponCode) {
        const coupon = await couponModel.findOne({
            code: couponCode.toLowerCase(),
            usedBy: { $nin: [req.user._id] }
        });
        if (!coupon || coupon.endDate < Date.now()) {
            return next(new AppError("Coupon not exist", 400));
        }
        req.body.coupon = coupon
    }
    let products = []
    let flag = false
    if (productId) {
        products = [{ productId, quantity }]
    } else {
        const cart = await cartModel.findOne({ user: req.user._id })
        if (!cart.products.length) {
            return next(new AppError("Cart is empty", 404));
        }
        products = cart.products // type => BSON ==> Doesn't accept update by2bl bs lw how gowah el key da anma lw m3ndhosh el key elly hzwodo msh hy2bl
        flag = true
    }
    let finalProduct = []
    let subPrice = 0
    for (let product of products) {
        const productExist = await productModel.findOne({ _id: product.productId, stock: { $gte: product.quantity } });
        if (!productExist) {
            return next(new AppError("Product not exist", 400));
        }
        if (flag) {
            product = product.toObject()
        }
        product.title = productExist.title
        product.price = productExist.price
        product.finalPrice = (productExist.subPrice * product.quantity)
        subPrice += product.finalPrice
        finalProduct.push(product)
    }
    const order = await orderModel.create({
        user: req.user._id,
        products: finalProduct,
        address, 
        phone,
        paymentMethod,
        status: paymentMethod == "cash" ? "placed" : "waitPayment",
        couponId: req.body?.coupon?._id,
        subPrice,
        totalPrice: subPrice - subPrice * ((req.body?.coupon?.amount || 0) / 100)
    })
    if (req.body?.coupon) {
        await couponModel.updateOne({ _id: req.body.coupon._id }, { $push: { usedBy: req.user._id } })
    }
    for (let product of finalProduct) {
        await productModel.findOneAndUpdate({ _id: product?.productId },
            {
                $inc: { stock: -product.quantity },
            }
        )
    }
    if (flag) {
        await cartModel.updateOne({ user: req.user._id }, { products: [] })
    }


    const invoice = {
        shipping: {
          name: req.user.name,
          address: req.user.address,
          city: "Alexandria",
          state: "ELRaml",
          country: "Egtpt",
          postal_code: 94111
        },
        items: order.products,
        subtotal: subPrice,
        paid: order.totalPrice,
        invoice_nr: order._id,
        date: order.createdAt,
        coupon: req.body?.coupon?.amount || 0
      };
      
    await createInvoice(invoice, "invoice.pdf");
    await sendEmail(req.user.email, "order placed", `you order has been placed successfully`, [
        {
            path: "invoice.pdf",
            contentType: "application/pdf",
        },
        {
            path: "logo.png",
            contentType: "image/png", 
        }
    ])
    return res.json({ message: 'Success', order });

});

// ------------------------------------- Cancel order  --------------------------------------
export const cancelOrder = asyncHandler(async (req, res, next) => {
    const { reason } = req.body;
    const { id } = req.params;
    const order = await orderModel.findOne({ _id: id, user: req.user._id })
    if (!order) {
        return next(new AppError("Order not found", 404));
    }
    if ((order.status != "placed" && order.paymentMethod == 'cash') || (order.status != "waitPayment" && order.paymentMethod == 'card')) {
        return next(new AppError("Can't cancel this order", 400));
    }

    await orderModel.updateOne({ _id: id }, { status: 'cancelled', cancelledBy: req.user._id, reason })
    if (order?.couponId) {
        await couponModel.updateOne({ _id: order.couponId }, { $pull: { usedBy: req.user._id } })
    }
    for (const product of order.products) {
        await productModel.findOneAndUpdate({ _id: product?.productId },
            {
                $inc: { stock: product.quantity },
            }
        )
    }
    res.status(200).json({ msg: 'Success' })
});
