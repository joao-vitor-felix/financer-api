type SuccessResponse<T> = {
  statusCode: number;
  body: { data: T };
};

type ErrorResponse = {
  statusCode: number;
  body: { message: string };
};

export const created = <T>(data: T): SuccessResponse<T> => {
  return {
    statusCode: 201,
    body: {
      data
    }
  };
};

export const success = <T>(data: T): SuccessResponse<T> => {
  return {
    statusCode: 200,
    body: {
      data
    }
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
    body: { message: "Internal server error." }
  };
};
