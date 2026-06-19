import { ExceptionFilter, HttpException, Catch, ArgumentsHost } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import { Response } from 'express';
import { Logger } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof HttpException) {
            response.status(exception.getStatus()).json(exception.getResponse());
        } else if (exception instanceof MongoServerError && exception.code === 11000) {
            response.status(409).json({ statusCode: 409, message: 'Conflict' });
        } else if (exception instanceof mongoose.Error.CastError) {
            response.status(400).json({ statusCode: 400, message: 'Bad Request' });
        } else {
            response.status(500).json({ statusCode: 500, message: 'An unexpected error occurred.' });
            this.logger.error(
                'Unhandled exception',
                exception instanceof Error ? exception.stack : String(exception),
            );
        }
    }
}