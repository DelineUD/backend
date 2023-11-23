import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

export class EntityNotFoundError extends Error {}

/** Интерцептор для отбработки ошибки не найденного результата
 * Для вызова необдимо выбросить исключение ```new EntityNotFoundError()```
 */
@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(`Сущность(и) не найдена(ы): ${error.message}!`);
        } else {
          throw error;
        }
      }),
    );
  }
}
