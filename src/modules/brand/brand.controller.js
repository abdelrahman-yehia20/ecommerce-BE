
import { asyncHandler } from "../../../utils/globalErrorhandling.js"
import { AppError } from "../../../utils/classError.js"
import { customAlphabet, nanoid } from 'nanoid'
import brandModel from "../../../DB/models/brand.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from "slugify";

// ------------------------------------- createBrand --------------------------------------
export const createBrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const brandExist = await brandModel.findOne({ name: name?.toLowerCase() });
    brandExist && next(new AppError("brand name already exist", 409)) 
    if(!req.file){
        next(new AppError("image is required", 404)) 
    }
    const customId = nanoid(5)
    const{secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder : `EcommerceC42/brands/${customId}`
    })
 
    const brand = await brandModel.create({
        name,
        slug : slugify(name,{
            replacement: '-',
            lower: true
        }),
        image:{secure_url, public_id},
        createdBy: req.user._id,
        customId
    })
   
        res.status(201).json({ message: 'done', brand });
   
});


// ------------------------------------- updateBrand --------------------------------------
export const updateBrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const {id} = req.params
    const brand = await brandModel.findOne({_id:id, createdBy: req.user._id});
    !brand && next(new AppError("brand not exist", 409)) 

    if(name){
        if(name.toLowerCase() == brand.name){
           return next(new AppError("brand name should be different", 409)) 
        }
        if(await brandModel.findOne({name: name.toLowerCase()})){
           return next(new AppError("brand name already exist", 409)) 
        }
        brand.name = name.toLowerCase()
        brand.slug()= slugify(name,{
        replacement: "_",
        lower:true
    })
    }
    if(req.file){
        await cloudinary.uploader.destroy(brand.image.public_id)
        const{secure_url, public_id}= await cloudinary.uploader.upload(req.file.path,{
            folder: `EcommerceC42/categories/${brand.customId}`
        })
        brand.image = {secure_url, public_id}
    }
    await brand.save()

   return res.status(200).json({ message: 'done', brand });   
   
});
