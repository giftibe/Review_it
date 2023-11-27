const { Router } = require("express");
const {
  validate_Form_Inputs
} = require('../validation/joi.validations')
const auth = require('../middleware/auth.middleware')

const reviewRouter = Router();

const { createReview, getCompanyReviews, getAllReviews } =
  (reviewController = require("../controller/review.controller"));

reviewRouter.post("/reviews/create/:companyId", validate_Form_Inputs, createReview);
reviewRouter.get("/reviews/reviews", auth, getAllReviews);
reviewRouter.get("/reviews/:id", auth, getCompanyReviews);

module.exports = reviewRouter;
