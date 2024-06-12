const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");
const errorHandler = require("../middleware/errorMiddleware");
// auth middleware
const authUser = auth.authenticateUser;

// validation middleware
const validation = validate.validation;
const registerValidationRules = validate.registerValidationRules;
const updateValidationRules = validate.updateValidationRules;

// POST route for creating a new user
/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     parameters:
 *       - in: formData
 *         name: name
 *         required: true
 *         type: string
 *         description: User's name
 *       - in: formData
 *         name: email
 *         required: true
 *         type: string
 *         description: User's email
 *       - in: formData
 *         name: password
 *         required: true
 *         type: string
 *         description: User's password
 *     responses:
 *       '201':
 *         description: User created
 *         content:
 *           application/json
 *       '500':
 *         description: Internal server error.
 */
router.post(
  "/user",
  registerValidationRules,
  validation,
  userController.createUser
);

// GET route for fetching all users
/**
 * @swagger
 * /api/all-user:
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
router.get("/all-user", userController.getAllUsers);

// GET route for fetching a specific user
/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get a user via token
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
router.get("/user", authUser, userController.getUserById);

// PUT route for updating a specific user
/**
 * @swagger
 * /api/user:
 *   put:
 *     summary: Update a user by Token
 *     tags: [User]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token for authentication
 *       - in: formData
 *         name: name
 *         required: true
 *         type: string
 *         description: User's name
 *       - in: formData
 *         name: email
 *         required: true
 *         type: string
 *         description: User's email
 *     responses:
 *       '200':
 *         description: User updated
 *         content:
 *           application/json
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error.
 */
router.put(
  "/user",
  authUser,
  updateValidationRules,
  validation,
  userController.updateUserById
);

// DELETE route for deleting a specific user
/**
 * @swagger
 * /api/user:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         description: User token
 *         schema:
 *           type: string
 *       - in: header
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *          description: Successful response
 *       '400':
 *          description: Bad request
 *          content:
 *            application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    description: A description of the error.
 *       '404':
 *          description: Not Found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    description: Resource not found.
 *       '500':
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    description: An internal server error occurred.
 */
router.delete("/user", authUser, userController.deleteUserById);

router.use(errorHandler);

module.exports = router;
