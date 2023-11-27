const Joi = require('joi')

// CREATION OF JOI SCHEMAS

// for company 
const createAccountSchema = Joi.object({
  email: Joi.string().required(),
  company_name: Joi.string().required(),
  password: Joi.string().required(),
})


const loginCompanySchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required()
})

// for form submission
const formSchema = Joi.object({
  email: Joi.string().required(),
  company_name: Joi.string(),
  userName: Joi.string().required(),
  rating: Joi.number().required(),
  product: Joi.string().required(),
  feedBack: Joi.string().required(),
})


// VALIDATIONS USING CREATED SCHEMAS


const validate_Account_Creation_Inputs = (req, res, next) => {
  try {
    const validateInput = createAccountSchema.validate(req.body)

    if (validateInput.error) {
      return res.status(404).send({
        success: false,
        status: 'failed',
        errormessage: validateInput.error.details[0].message
      })
    } else {
      next()
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const validate_Company_Login_Inputs = (req, res, next) => {
  try {
    const validateInput = loginCompanySchema.validate(req.body)

    if (validateInput.error) {
      return res.status(404).send({
        success: false,
        status: 'failed',
        errormessage: validateInput.error.details[0].message
      })
    } else {

      next()
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const validate_Form_Inputs = (req, res, next) => {
  try {
    const validateInput = formSchema.validate(req.body)

    if (validateInput.error) {
      return res.status(404).send({
        success: false,
        status: 'failed',
        errormessage: validateInput.error.details[0].message,
      })
    } else {
      next()
    }
  } catch (err) {
    res.status(500).send(err)
  }
}
module.exports = { validate_Account_Creation_Inputs, validate_Company_Login_Inputs, validate_Form_Inputs }