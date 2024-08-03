

export const asyncHandler = (fn)=>{
    return(req,res,next)=>{
        fn(req,res,next).catch((error)=>{
            res.status(500).json({msg: "catch error", error})
            next(error)
        })
    }
} 


export const globalErrorHandling = (err,req,res,next)=>{
    res.status(err.statusCode|| 500).json({msg:"error", err : err.message , stack: err.stack})
    next()
}
