
import { asyncHandler } from "../../../utils/globalErrorhandling.js"
import { AppError } from "../../../utils/classError.js"
import { customAlphabet, nanoid } from 'nanoid'
import categoryModel from "../../../DB/models/category.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from "slugify";
import subCategoryModel from "../../../DB/models/subCategory.model.js";

// ------------------------------------- createCategory --------------------------------------
export const createCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const categoryExist = await categoryModel.findOne({ name: name?.toLowerCase() });
    categoryExist && next(new AppError("category name already exist", 409)) 
    if(!req.file){
        next(new AppError("image is required", 404)) 
    }
    const customId = nanoid(5)
    const{secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder : `EcommerceC42/categories/${customId}`
    })
    req.filePath = `EcommerceC42/categories/${customId}`
 
    const category = await categoryModel.create({
        name,
        slug : slugify(name,{
            replacement: '-',
            lower: true
        }),
        image:{secure_url, public_id},
        createdBy: req.user._id,
        customId
    })
    req.data= {
        model: categoryModel,
        id:category._id
    }
   
        res.status(201).json({ message: 'done', category });
   
});


// ------------------------------------- updateCategory --------------------------------------
export const updateCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const {id} = req.params
    const category = await categoryModel.findOne({_id:id, createdBy: req.user._id});
    !category && next(new AppError("category not exist", 409)) 

    if(name){
        if(name.toLowerCase() == category.name){
           return next(new AppError("category name should be different", 409)) 
        }
        if(await categoryModel.findOne({name: name.toLowerCase()})){
           return next(new AppError("category name already exist", 409)) 
        }
        category.name = name.toLowerCase()
        category.slug()= slugify(name,{
        replacement: "_",
        lower:true
    })
    }
    if(req.file){
        await cloudinary.uploader.destroy(category.image.public_id)
        const{secure_url, public_id}= await cloudinary.uploader.upload(req.file.path,{
            folder: `EcommerceC42/categories/${category.customId}`
        })
        category.image = {secure_url, public_id}
    }
    await category.save()

   return res.status(200).json({ message: 'done', category });   
   
});


// ------------------------------------- deleteCategory --------------------------------------

export const deleteCategory = asyncHandler( async(req,res,next)=>{
    const {id}= req.params
    const category = await categoryModel.findOneAndDelete({_id:id, createdBy: req.user_id})
    if(!category){
       return next(new AppError("category is not exist", 409))
    }

    // delete subcategories realted to the categories
    await subCategoryModel.deleteMany({category: category._id })

    // delete from cloudinary 
    await cloudinary.api.delete_resources_by_prefix(`EcommerceC42/categories/${category.customId}`)
    await cloudinary.api.delete_folder(`EcommerceC42/categories/${category.customId}`)

    return res.status(200).json({ message: 'done' });   

})


export const getCategories = asyncHandler(async (req, res, next) =>{

    // let list = []
       const categories = await categoryModel.find({}).populate([
        {
            path: "subCategories"
       }])
    // !categories && next(new AppError("subCategory not exist", 409))
    // for (const category of categories) {
    //     const subcategories = await subCategoryModel.find({category: category._id})
    //     const newCategory = category.toObject()
    //     newCategory.subcategories = subcategories
    //     list.push(newCategory)  
    // } 
    // return res.status(200).json({ message: 'done', categories : list });  
    return res.status(200).json({ message: 'done', categories });


    
    
})