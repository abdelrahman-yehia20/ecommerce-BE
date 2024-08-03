
import { asyncHandler } from "../../../utils/globalErrorhandling.js"
import { AppError } from "../../../utils/classError.js"
import { customAlphabet, nanoid } from 'nanoid'
import productModel from "../../../DB/models/product.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from "slugify";
import categoryModel from "../../../DB/models/category.model.js";
import subCategoryModel from "../../../DB/models/subCategory.model.js";
import brandModel from "../../../DB/models/brand.model.js";
import { ApiFeature } from "../../../utils/ApiFeatures.js";

// ------------------------------------- createproduct --------------------------------------
export const createProduct = asyncHandler(async (req, res, next) => { 
    const { title, description, category, subCategory, brand, price, discount, stock } = req.body

    // Check category exist 
    const categoryExist = await categoryModel.findOne({ _id: category });
    if (!categoryExist){
        next(new AppError("category not exist", 409))
    }  
    // Check subCategory exist 
    const subCategoryExist = await subCategoryModel.findOne({ _id: subCategory, category });
    if (!subCategoryExist){
        next(new AppError("subCategory not exist", 409))
    }  
    // Check brand exist 
    const brandExist = await brandModel.findOne({ _id: brand});
    if (!brandExist){
        next(new AppError("brand not exist", 409))
    }  

 // Check product exist
    const productExist = await productModel.findOne({ title: title?.toLowerCase() });
    if (productExist){
        next(new AppError("product title already exist", 409))
    } 

    const subPrice = price - (price * (discount || 0) / 100)
    // if(discount){
    //     const subPrice = price - (price * discount / 100)
    // }

    if(!req.files){
        next(new AppError("images are required", 409))
    }

    const customId = nanoid(5)
    let list = []
    for (const file of req.files.coverImages) {
        const {secure_url, public_id}= cloudinary.uploader.upload(file.path, { 
            folder : `EcommerceC42/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}/coverImages`
        })
        list.push({secure_url, public_id}) 
    }
    const {secure_url, public_id}=  await cloudinary.uploader.upload(req.files.image[0].path,{
        folder : `EcommerceC42/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}/mainImage`
    })
    
    const product = await productModel.create({
        title,
        slug : slugify(title,{
            replacement: '-',
            lower: true
        }),
        description,
        price,
        discount,
        subPrice,
        stock,
        category,
        subCategory,
        brand,
        image:{secure_url, public_id},
        coverImages: list,
        customId,  
        createdBy: req.user._id     
    })
        res.status(201).json({ message: 'done', product });
   
});




// ------------------------------------- createproduct --------------------------------------
export const getProducts = asyncHandler(async (req, res, next) => { 

    const apiFeature = new ApiFeature(productModel.find(), req.query)
    .pagination()
    .filter()
    // .select()
    // .filter() 

    const products = await apiFeature.mongooseQuery

    res.status(201).json({ message: 'done', page: apiFeature.page, products });
   
});



// ------------------------------------- updateproduct --------------------------------------
export const updateProduct = asyncHandler(async (req, res, next) => { 
    const {id} = req.params
    const { title, description, category, subCategory, brand, price, discount, stock } = req.body

    // Check category exist 
    const categoryExist = await categoryModel.findOne({ _id: category });
    if (!categoryExist){
        next(new AppError("category not exist", 409))
    }  
    // Check subCategory exist 
    const subCategoryExist = await subCategoryModel.findOne({ _id: subCategory, category });
    if (!subCategoryExist){
        next(new AppError("subCategory not exist", 409))
    }  
    // Check brand exist 
    const brandExist = await brandModel.findOne({ _id: brand});
    if (!brandExist){
        next(new AppError("brand not exist", 409))
    }  

 // Check product exist
    const product = await productModel.findOne({ _id: id, createdBy : req.user });
    if (!product){
        next(new AppError("product not exist", 409))
    } 

    if(title){

        if(title.toLowerCase() == product.title){
            next(new AppError("title already exist", 409))
        }
        if(await productModel.findOne({title : title.toLowerCase()})){
            next(new AppError("title already exist", 409))
        }
        product.title = title.toLowerCase()
        product.slug = slugify(title,{
            lower: true,
            replacement: "_"
        })
    }
    if(description){
        product.description = description
    }
    if(stock){
        product.stock = stock
    }
    if(price & discount){
        product.subPrice = price - (price * (discount / 100))
        product.price = price
        product.discount = discount
    }else if(price){
        product.subPrice = price - (price * (product.discount / 100))
        product.price = price
    }else if(discount){
        product.subPrice = product.price - (product.price * (discount / 100))
        product.discount = discount
    }

    if(req.files){
        if(req.files?.image?.length){
            await cloudinary.uploader.destroy(product.image.public_id)
            const {secure_url, public_id} = await cloudinary.uploader.upload(req.files.image[0].path,{
                folder: `EcommerceC42/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}/mainImage`
            })
            product.image = {secure_url, public_id}
        }

        if(req.files?.coverImages?.length){
            await cloudinary.api.delete_resources_by_prefix(`EcommerceC42/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}/mainImage`)
                 let list = []
             for (const file of req.files.coverImages) {
                     const {secure_url, public_id}= cloudinary.uploader.upload(file.path, { 
                        folder : `EcommerceC42/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}/mainImage`
                             })
                             list.push({secure_url, public_id}) 
             }
             product.coverImages = list
        }
    }

        await product.save()
        res.status(201).json({ message: 'done', product });
   
});
