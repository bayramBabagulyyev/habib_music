import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

class ResponseDto<T> {
  status: HttpStatus;
  title: string;
  message: 'Successfully!'
  data: T;
}

@Injectable()
export class HttpResponseInterceptor<T> implements NestInterceptor<T, ResponseDto<T>> {
  /**
   * Intercept the request and add the timestamp
   * @param context {ExecutionContext}
   * @param next {CallHandler}
   * @returns { success: boolean, payload: Response<T>, timestamp: number }
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto<T>> {


    return next.handle().pipe(
      map((payload) => {

        if (payload && payload.totalPages) {
          return payload; // If payload already has totalPages, return as is
        }
        return {
          "status": 200,
          "title": "OK",
          "message": "Successfully!",
          "data": payload
        };
      }),
    );
  }
}
