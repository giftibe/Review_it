const express = require("express");
const nodemailer = require('nodemailer');
const ReviewService = require("../service/reviews.services.js");
const userService = require("../service/user.services");
const { MESSAGES } = require('../config/constant.config')
const checkValidId = require('../utils/validateID');
const usersServices = require('../service/user.services');
const {
  getAUserById,
} = usersServices;
const users = require("../model/user.model");
const senderEmail = process.env.EMAIL;
const pass = process.env.APP_PASSWORD






class ReviewController {
  // Fetch all reviews
  static async getAllReviews(req, res) {
    try {
      const reviews = await ReviewService.getAllReviews();
      if (reviews.length === 0) {
        return res.status(404).send({
          message: MESSAGES.REVIEW.EMPTY,
          success: true,
        })
      }
      return res.status(201).send({
        message: MESSAGES.REVIEW.FETCHED,
        success: true,
        result: reviews
      })
    } catch (error) {
      return {
        message: MESSAGES.REVIEW.ERROR + error.message,
        success: false,
      };
    }
  }

  /// Create a review by company ID
  static async createReview(req, res) {
    try {
      const value = req.body;
      const compID = req.params.companyId
      const company = await userService.getAUserById(compID);

      if (!company) {
        return res.status(404).json({
          success: false,
          message: MESSAGES.USER.USER_NOT_FOUND,
        });
      }

      const review = await ReviewService.createReview(
        { ...value, company_name: compID }
      );

      //adding the created review to the company list of reviews
      const updated = await users.findByIdAndUpdate(compID, {
        $push: { reviews: review },
        $set: { updatedAt: new Date() }
      }, { new: true })

      const compEmail = company['email']


      if (updated) {
        //send an email once review is created
        const transporter = nodemailer.createTransport({
          service: "yahoo",
          auth: {
            user: senderEmail,
            pass: pass
          }
        });

        const reviewDetails = {
          username: review.userName,
          rating: review.rating,
          product: review.product,
          feedback: review.feedBack
        };

        const formattedReviewDetails = Object.keys(reviewDetails)
          .map(key => `${key}: ${reviewDetails[key]}`)
          .join("\n  ");

        // Composed the email message
        const mailOptions = {
          from: senderEmail,
          to: compEmail,
          subject: 'New Review Available',
          text: `Hello,\n\nA new review is available for you:\n\n  ${formattedReviewDetails}\n\nBest regards,\nReviewNest`

        };

        // Sending the email 
        transporter.sendMail(mailOptions, (error) => {
          if (error) {
            return res.status(501).send({
              success: false,
              message: MESSAGES.REVIEW.NOT_SENT, error
            })
          }
        });

        const createdID = review.id
        const createdReview = await ReviewService.getAReviewById(createdID)

        return review
          ? res.status(201).send({
            message: MESSAGES.REVIEW.SUCCESSFULLY_ADDED,
            success: true,
            createdReview
          })
          : res.status(400).send({
            message: MESSAGES.REVIEW.FAILED_TO_ADD,
            success: false,
          });
      }

    } catch (error) {
      return {
        message: MESSAGES.REVIEW.ERROR + error.message,
        success: false,
      };
    }
  }

  // Fetch all a company's reviews by companyID
  static async getCompanyReviews(req, res) {

    try {
      const { id } = req.params;
      if (checkValidId(id)) {

        //Get the company
        const company = await getAUserById(id);

        if (!company) {
          return res.status(404).send({
            success: false,
            message: MESSAGES.USER.USER_NOT_FOUND,
          });
        } else {

          //if the company exists, find all their reviews
          const reviewsArray = company['reviews']
          if (reviewsArray.length === 0) {
            return res.status(404).send({
              success: true,
              message: MESSAGES.REVIEW.EMPTY
            })
          }

          return res.status(201).send(
            {
              success: true,
              message: MESSAGES.REVIEW.FOUND_REVIEWS,
              Reviews: reviewsArray
            });
        }
      } else {
        return res.status(404).send({
          message: MESSAGES.REVIEW.INVALID_ID,
          success: false,
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: MESSAGES.REVIEW.ERROR + error.message,
      });
    }
  }
}

module.exports = ReviewController;
