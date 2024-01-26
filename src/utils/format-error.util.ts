import { GraphQLError } from 'graphql';

export const FormateError = (error: GraphQLError) => {
  if (error?.extensions?.stacktrace) {
    delete error?.extensions?.stacktrace;
  }

  return error;
};
