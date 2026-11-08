export function notFoundHandler(request, response) {
  response
    .status(404)
    .json({
      error: `Route ${request.method} ${request.originalUrl} was not found.`,
    });
}

export function errorHandler(error, _request, response, _next) {
  if (error.code === 11000) {
    return response
      .status(409)
      .json({ error: "A record with that unique value already exists." });
  }

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map(
      (validationError) => validationError.message,
    );
    return response.status(400).json({ error: messages.join(" ") });
  }

  if (!error.status || error.status >= 500) console.error(error);
  return response
    .status(error.status ?? 500)
    .json({ error: error.message ?? "Internal server error." });
}
