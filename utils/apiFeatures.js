class APIFeatures {
  // /api/v1/products?keyword=apple -> req.query ({keyword: apple})

  // In product controller apiFeatures is instantiated as follows:
  // const apiFeatures = new APIFeatures(Product.find(), req.query)
  // therefore we have the following as constructor arguments
  // query = Product.find()
  // queryStr = req.query

  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? // Search in database
        {
          // based on name
          // using regex instead of directly passing keyword directly
          // in await Product.find() has the advatnage of a wider search scope
          // that is, for example if user enters "a" it retruns all products that
          // have letter "a" in their name
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
          //  Now we would have something like
          //  find({name:{
          //   $regex: this.queryStr.keyword,
          //   $options: "i",
          // }})
          //  Or
          //  find({name:{}})
        }
      : {};
    // this.query = Product.find()
    // The Model.find() function returns an instance of Mongoose's Query class.
    // The Query class represents a raw CRUD operation that you may send to MongoDB.
    // It provides a chainable interface for building up more sophisticated queries.
    // Model.find() returns a query, which has a separate find() method that lets you attach additional filters

    // Further clarification

    // const query = Products.find();
    // query instanceof mongoose.Query; // true
    // const docs = await query; // Get the products

    this.query = this.query.find({ ...keyword });
    // Returns APIFeatures
    return this;
  }

  // example 1: /api/v1/products?keyword=apple&category=Laptops
  // example 2: /api/v1/products/?keyword=apple&price[gte]=1&price[lte]=200
  filter() {
    const queryCopy = { ...this.queryStr };

    console.log(queryCopy);
    // example 1: {keyword: 'apple', category:'Laptops'}
    // example 2: {keyword: 'apple', price: {gte:'1', lte:'200'}}

    // Removing fields from the query (filter searches by category)
    // so as to use only fields that are defined in the schema
    const removeFields = ["keyword", "limit", "page", "sort", "fields"];

    removeFields.forEach((el) => delete queryCopy[el]);

    console.log(queryCopy);
    // example 1: {category:'Laptops'}
    // example 2: {price: {gte:'1', lte:'200'}}

    // At this point queryCopy has the above format.
    // gte and lte are Mongoose operators but to be able to use them
    // we need to insert a '$' sign before these operators. Therefore
    // we need to perfrom a replace function on queryCopy. In order
    // to apply this function first we have to convert the plain object to
    // JSON object

    // Advance filter for price, ratings etc
    // Convert object to string to run functions on
    let queryStr = JSON.stringify(queryCopy);
    // example 1: {"category":"Laptops"}
    // example 2: {"price": {"gte":"1", "lte":"200"}}

    // Advance filtering using: lt, lte, get, gte, in (for searching within the array)
    // find a match for the specified character sequence at the start and
    // end of the queryStr
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    console.log(queryStr);
    //example 2: {"price": {"$gte":"1", "$lte":"200"}}

    // After performing replace function on JSON object,
    // convert back to string for database query execution
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      // Sort by multiple categories
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
      // Default source value (applied if user has not supplied one)
    } else {
      // Minus sign make it so the latest product displays at the top
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
      // Default limit value (applied if user has not supplied one)
    } else {
      // If no limit is supplied bu the user only remove the __v field
      // which is automatically added by Mongodb at the time of object creation
      this.query = this.query.select("-__v");
    }
    return this;
  }
  // MongoDB provides text indexes to support text search queries on string content.
  // text indexes can include any field whose value is a string or an array of string elements
  searchByQuery() {
    if (this.queryStr.q) {
      const qu = this.queryStr.q.split("-").join(" ");
      this.query = this.query.find({ $text: { $search: "\"" + qu + "\"" } });
    }

    return this;
  }

  // /api/v1/products/?page=2
  pagination(resPerPage) {
    // Current page that we are on (is being requested)
    // const currentPage = parseInt(this.queryStr.page, 10) || 1;
    // if resPerPage (aka here limit) were obtained from query string
    // const limit = parseInt(this.queryStr.page, 10) || 1;
    const currentPage = Number(this.queryStr.page) || 1;
    // If we have 30 products and displaying 10 products per page,
    // If we want to navigate to page 2, we have to skip the first 10
    // products and display products number 11 to 20; therefore, skip = 10 * (2 - 1) = 10
    // Similarly, for the third page we have to display 21 to 30, skipping 10 results
    // therefore, skip = 10 (3 - 1) = 20.
    const skip = resPerPage * (currentPage - 1);

    // Limit the number of documents returned by number we want to display
    // per page.
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
