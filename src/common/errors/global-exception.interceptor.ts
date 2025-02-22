import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { DuplicatedResourceException, ResourceNotFoundException } from '.';

@Injectable()
export class GlobalExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof ResourceNotFoundException) {
          return throwError(() => new NotFoundException(error.message));
        }

        if (error instanceof DuplicatedResourceException) {
          return throwError(() => new ConflictException(error.message));
        }

        return throwError(() => error);
      }),
    );
  }
}
