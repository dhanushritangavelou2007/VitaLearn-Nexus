export function notFound(req, res, next) {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export function errorHandler(err, req, res, next) {

  console.error("========== ERROR ==========");
  console.error(err);
  console.error("===========================");

  // Respect a statusCode explicitly set on the error (e.g. AppError instances
  // thrown for 400/401/403/404). Previously this fell back to res.statusCode,
  // which is almost always still 200 at this point, so every intentional
  // 4xx error (auth failures, not-found, permission denied) was silently
  // turned into a generic 500 — breaking RBAC error handling and any
  // frontend logic keyed off status codes (e.g. redirect-to-login on 401).
  const statusCode =
    err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack:
      process.env.NODE_ENV === "production"
        ? undefined
        : err.stack,
  });

}