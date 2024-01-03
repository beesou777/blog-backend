import { NextFunction, Response, Request } from "express"

function notFound(req: any, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}


function errorHandler(err: any, req: any, res: Response, next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode)
  res.json({
    message: err.message
  });
}

export {
  notFound,
  errorHandler
};