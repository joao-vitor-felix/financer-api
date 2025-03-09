type SuccessResponse<T> = {
  statusCode: number;
  body: T;
};

export type ErrorResponse = {
  statusCode: number;
  body: { message: string };
};

export type Response<T> = SuccessResponse<T> | ErrorResponse;

export const created = <T>(response: T): SuccessResponse<T> => {
  return {
    statusCode: 201,
    body: response
  };
};

export const success = <T>(response: T): SuccessResponse<T> => {
  return {
    statusCode: 200,
    body: response
  };
};

export const badRequest = (message: string): ErrorResponse => {
  return {
    statusCode: 400,
    body: {
      message
    }
  };
};

export const notFound = (message: string): ErrorResponse => {
  return {
    statusCode: 404,
    body: {
      message
    }
  };
};

export const internalServerError = (): ErrorResponse => {
  return {
    statusCode: 500,
    body: { message: "Internal server error" }
  };
};
