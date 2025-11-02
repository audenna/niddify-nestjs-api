export function successResponse<T>(
  code: string = 'OK',
  data: T | null = null,
  message = 'Success',
  meta?: object,
) {
  return {
    code,
    status: 'success',
    message,
    data,
    meta,
    error: null,
  };
}

export function errorResponse(
  message = 'An error occurred',
  code: string = 'ERROR',
) {
  return {
    code,
    status: 'error',
    message,
  };
}
