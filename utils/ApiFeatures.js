

export class ApiFeature{


constructor(mongooseQuery, queryString){
    this.mongooseQuery = mongooseQuery
    this.queryString = queryString
}

pagination(){
    let page = this.queryString.page *1 || 1 // *1 to convert as a number and || to if he not send the page in the query 
    if(page<1) {page = 1}
    let limit = 2
    let skip = (page - 1) * limit
    this.mongooseQuery.find().skip(skip).limit(limit)
    this.page = page
    return this
}

filter(){
    let exculdeQuery = ["page", "sort", "search", "select"]
    let filterQuery = this.queryString
    exculdeQuery.forEach(e => delete filterQuery[e]) 
    filterQuery = JSON.parse(JSON.stringify(filterQuery).replace(/(gt|lt|gte|lte|eq)/,(match)=>`$${match}`))
    console.log(filterQuery) 
    this.mongooseQuery.find(filterQuery)
    return this
}

sort(){
    //const mongooseQuery =  productModel.find(filterQuery).skip(skip).limit(limit)
    if(this.queryString.sort){
        this.mongooseQuery.sort(req.query.sort.replaceAll(","," "))
    }
    return this
}

select(){
    if(this.queryString.select){
        this.mongooseQuery.select(req.query.select.replaceAll(","," "))
    }
    return this
}


}