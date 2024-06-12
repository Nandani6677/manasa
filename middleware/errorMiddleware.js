const errorHandler = (err, req, res, next) => {
  // Handle the error
  console.error(err);

  // Set a default status code and error message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  const lineNumber = err.stack
    ? err.stack.split("\n")[1].trim().split(":")[1]
    : undefined;
  // Send the error response
  res.status(res.statusCode).json({
    error: {
      status: statusCode,
      message: message,
      lineNumber,
    },
  });
};

module.exports = errorHandler;
