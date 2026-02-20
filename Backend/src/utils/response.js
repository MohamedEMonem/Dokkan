/**
 * Standard API Response Utility
 * Ensures all API endpoints return data in a consistent format
 */

/**
 * Send a successful response
 * @param {Object} res - Express response object
 * @param {*} data - The actual payload/data to return
 * @param {string} message - Optional success message for UI toasts
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendSuccess = (res, data = null, message = null, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        data,
        message,
        error: null,
        code: statusCode
    });
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {*} error - Additional error details (optional)
 */
const sendError = (res, message, statusCode = 400, error = null) => {
    return res.status(statusCode).json({
        success: false,
        data: null,
        message,
        error: error || message,
        code: statusCode
    });
};

/**
 * Send a validation error response
 * @param {Object} res - Express response object
 * @param {Array|string} errors - Validation errors
 */
const sendValidationError = (res, errors) => {
    return res.status(422).json({
        success: false,
        data: null,
        message: "Validation failed",
        error: errors,
        code: 422
    });
};

/**
 * Send a not found response
 * @param {Object} res - Express response object
 * @param {string} message - Not found message
 */
const sendNotFound = (res, message = "Resource not found") => {
    return res.status(404).json({
        success: false,
        data: null,
        message,
        error: message,
        code: 404
    });
};

/**
 * Send an unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Unauthorized message
 */
const sendUnauthorized = (res, message = "Unauthorized") => {
    return res.status(401).json({
        success: false,
        data: null,
        message,
        error: message,
        code: 401
    });
};

/**
 * Send a forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Forbidden message
 */
const sendForbidden = (res, message = "Access forbidden") => {
    return res.status(403).json({
        success: false,
        data: null,
        message,
        error: message,
        code: 403
    });
};

/**
 * Send an internal server error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {*} error - Error details (for logging)
 */
const sendServerError = (res, message = "Internal server error", error = null) => {
    // Log the actual error for debugging
    if (error) {
        console.error("Server Error:", error);
    }
    
    return res.status(500).json({
        success: false,
        data: null,
        message,
        error: process.env.NODE_ENV === "development" ? error : "Internal server error",
        code: 500
    });
};

module.exports = {
    sendSuccess,
    sendError,
    sendValidationError,
    sendNotFound,
    sendUnauthorized,
    sendForbidden,
    sendServerError
};
