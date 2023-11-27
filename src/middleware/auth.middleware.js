const jwt = require('jsonwebtoken')
const { MESSAGES } = require('../config/constant.config')
const companyModel = require('../model/user.model')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();

// a middleware to autheticate users 

const auth = async (req, res, next) => {
    try {
        //checks if there is a header
        const bearHeader = req.headers['authorization']
        if (typeof bearHeader == 'undefined') {
            req.token = bearToken
            res.status(403).send({
                message: MESSAGES.USER.UNAUTHORIZED + 'no bearheader',
                success: false
            })

        }
        const bearToken = bearHeader.split(' ')[1];
        if (!bearToken) {
            res.status(403).send({
                message: 'insert a token',
                success: false
            })
        }
        //using bcrypt to  compare the password
        const verified = jwt.verify(bearToken, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401)
                    .send({
                        success: false,
                        message: "INVALIDTOKEN"
                    });
            } else {
                const user = await companyModel.findById(decoded);
                if (!user) {
                    return res.status(401)
                        .send({
                            success: false,
                            message: "no such user found, please sign up"
                        });
                }
                // Add the decoded token to the request object for future use
                req.user = decoded;
                next();
            }
        });

    } catch (error) {
        return res.status(500).send({
            message: 'Internal Server Error: No token found ' + error,
            success: false
        })

    }
}
module.exports = auth
