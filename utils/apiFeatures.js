class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    // Returns APIFeatures
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    // /api/v1/products?keyword=apple&category=Laptops
    console.log(queryCopy);
    // {keyword: 'apple', category:'Laptops'}

    // Removing fields from the query (filter searches by category)
    const removeFields = ["keyword", "limit", "page"];

    removeFields.forEach((el) => delete queryCopy[el]);

    console.log(queryCopy);
    // {category:'Laptops'}

    // Advance filter for price, ratings etc
    let queryStr = JSON.stringify(queryCopy);

    // /api/v1/products/?keyword=apple&price[gte]=1&price[lte]=200
    console.log(queryCopy);
    // {price: {gte:'1', lte:'200'}}

    // gte and lte are Mongoose operators but to be able to use them
    // there is a need for a '$' value before the operators
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    console.log(queryStr);
    // {"price": {"$gte":"1", "$lte":"200"}}

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
  // /api/v1/products/?page=2
  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
