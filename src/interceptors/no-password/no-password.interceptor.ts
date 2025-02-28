import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class NoPasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data?.user?.password) {
          delete data?.user?.password;
          return data;
        } else if (Array.isArray(data)) {
          data?.forEach((item) => {
            if (item?.user?.password) {
              delete item?.user?.password;
              return data;
            } else if (Array.isArray(item?.user)) {
              item?.user?.forEach((user) => {
                if (user?.password) {
                  delete user?.password;
                  return data;
                }
              });
            }
          });
        } else {
          return data;
        }
      }),
    );
  }
}
