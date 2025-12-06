import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse: { message?: string | string[]; error?: string } = exception.getResponse() as { message?: string | string[]; error?: string };

    // Handle cases where the error message is an array (from class-validator) or a string
    const errorMessage =
      typeof exceptionResponse === 'object' && exceptionResponse.message
        ? exceptionResponse.message
        : exceptionResponse;

    // 3. Format the error response
    response.status(status).json({
      success: false,
      error: {
        message: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage, // Join array errors for clarity
        code: status,
      },
    });
  }
}