const Review = require("../model/reviews.model");
const { User } = require("../model/user.model");
const mongoose = require("mongoose");

class ReviewService {

  //this creates a review using the company id 
  async createReview(data) {
    const rev = await Review.create(data);
    return rev;
  }

  //this gets all the reviews regardless of the company
  async getAllReviews() {
    const val = await Review.find({}).populate({
      path: 'company_name',
      select: ['company_name', "company_description"]
    });;
    return val
  }

  //get all the reviews pertaining to a specific company/user
  async getCompanyReviews(companyId) {
    return await Review.find(companyId).populate({
      path: 'company_name',
      select: ['company_name', "company_description"]
    });
  }

  //get all the reviews pertaining to a specific company/user
  async getAReviewById(reviewID) {
    return await Review.findById(reviewID).populate({
      path: 'company_name',
      select: ['company_name', "company_description"]
    });
  }
}

module.exports = new ReviewService();
