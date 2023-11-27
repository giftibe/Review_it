const { Router } = require("express");
const userRoutes = require("./user.route");
const reviewRoutes = require("./reviews.route");
const router = Router();

router.use("/v1", userRoutes);
router.use("/v1", reviewRoutes);

module.exports = router;
