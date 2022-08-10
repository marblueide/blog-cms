import { ApolloQueryResult } from "@apollo/client";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  DocumentParameter,
  OptionsParameter,
} from "@vue/apollo-composable/dist/useQuery";
import { DocumentNode } from "graphql";

export const mutation = <T = any, V = any>(gql: DocumentParameter<T, V>) => {
  const { mutate } = useMutation(gql, {
    errorPolicy: "all",
    fetchPolicy: "network-only",
  });
  return mutate;
};

export const query = <R>(
  gql: DocumentNode,
  variables: any,
  options: OptionsParameter<R, null>
): Promise<ApolloQueryResult<R>> => {
  const { onResult, onError } = useQuery<R>(gql, variables, {
    errorPolicy: "all",
    ...options,
  });
  return new Promise((resolve, reject) => {
    onResult((res) => {
      res.data && resolve(res);
    });
    onError((error) => {
      reject(error.message);
    });
  });
};
