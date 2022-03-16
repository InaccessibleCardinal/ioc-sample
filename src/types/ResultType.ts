export enum ResultEnum {
  SUCCESS = 'success',
  ERROR = 'error',
}

type ResultSuccess<T> = { type: ResultEnum.SUCCESS; value: T };
type ResultError<E extends Error> = { type: ResultEnum.ERROR; error: E };

export type ResultType<T, E extends Error> = ResultSuccess<T> | ResultError<E>;
