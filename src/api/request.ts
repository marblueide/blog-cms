import { ApolloQueryResult, OperationVariables } from "@apollo/client";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { DocumentParameter, OptionsParameter } from "@vue/apollo-composable/dist/useQuery";
import { DocumentNode } from "graphql";

export const mutation = <
  TResult = any,
  TVariables extends OperationVariables = OperationVariables
>(
  document: DocumentParameter<TResult, TVariables>,
  options?: OptionsParameter<TResult, TVariables>
) => {
  //@ts-ignore
  const {mutate} = useMutation(document,{
    errorPolicy: "all",
    ...options
  })
  return mutate
};

export const query = <R>(
  gql: DocumentNode,
  variables: any,
  options?: OptionsParameter<R, null>
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
