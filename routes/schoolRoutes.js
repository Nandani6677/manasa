const express = require("express");
const router = express.Router();
const schoolController = require("../controllers/schoolController");
const errorHandler = require("../middleware/errorMiddleware");

// GET route for fetching all users
/**
 * @swagger
 * /api/all-school:
 *   get:
 *     summary: Get all user
 *     tags: [User]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: token of user
 *     responses:
 *       '200':
 *         description: OK. User found.
 *       '404':
 *         description: User not found.
 *       '500':
 *         description: Internal server error.
 */
router.get("/all-school", schoolController.getAllSchool);

router.use(errorHandler);

module.exports = router;
