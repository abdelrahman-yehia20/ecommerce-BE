
import { asyncHandler } from "../../../utils/globalErrorhandling.js"
import { AppError } from "../../../utils/classError.js"
import { customAlphabet, nanoid } from 'nanoid'
import subCategoryModel from "../../../DB/models/subCategory.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from "slugify";
import categoryModel from "../../../DB/models/category.model.js";

// ------------------------------------- createSubCategory --------------------------------------
export const createSubCategory = asyncHandler(async (req, res, next) => { 
    const { name } = req.body
    const categoryExist = await categoryModel.findById( req.params.categoryId );  
    !categoryExist && next(new AppError("Category not exist", 409))

    const subCategoryExist = await subCategoryModel.findOne({ name: name?.toLowerCase() });
    subCategoryExist && next(new AppError("subCategory name already exist", 409))

    if(!req.file){
        next(new AppError("image is required", 404)) 
    }
    const customId = nanoid(5)
    const{secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder : `EcommerceC42/categories/${categoryExist.customId}/subCategories/${customId}`
    })
 
    const subCategory = await subCategoryModel.create({
        name,
        slug : slugify(name,{
            replacement: '-',
            lower: true
        }),
        image:{secure_url, public_id},
        category: req.params.categoryId,
        createdBy: req.user._id,
        customId,       
    })
        res.status(201).json({ message: 'done', subCategory });
   
});


// ------------------------------------- updateSubCategory --------------------------------------
export const updateSubCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const {id} = req.params
    const subCategory = await subCategoryModel.findOne({_id:id, createdBy: req.user._id});
    !subCategory && next(new AppError("subCategory not exist", 409)) 

    if(name){
        if(name.toLowerCase() == subCategory.name){
           return next(new AppError("subCategory name should be different", 409)) 
        }
        if(await subCategoryModel.findOne({name: name.toLowerCase()})){
           return next(new AppError("subCategory name already exist", 409)) 
        }
        subCategory.name = name.toLowerCase()
        subCategory.slug()= slugify(name,{
        replacement: "_",
        lower:true
    })
    }
    if(req.file){
        await cloudinary.uploader.destroy(subCategory.image.public_id)
        const{secure_url, public_id}= await cloudinary.uploader.upload(req.file.path,{
            folder: `EcommerceC42/categories/${subCategory.customId}`
        })
        subCategory.image = {secure_url, public_id}
    }
    await subCategory.save()

   return res.status(200).json({ message: 'done', subCategory });   
   
});




// ------------------------------------- updateSubCategory --------------------------------------

export const getSubCategories = asyncHandler(async (req, res, next) =>{

    const subCategory = await subCategoryModel.find().populate([
        {
            path:"category",
            select: "-_id"
        },
        {
            path: "createdBy",
            select: "name -_id"

        }])
    !subCategory && next(new AppError("subCategory not exist", 409)) 
    return res.status(200).json({ message: 'done', subCategory });  

})