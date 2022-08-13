import { apolloClient } from "@/utils/apolloClient";
import { ApolloQueryResult, OperationVariables } from "@apollo/client";
import { provideApolloClient, useMutation, useQuery } from "@vue/apollo-composable";
import { DocumentParameter, OptionsParameter } from "@vue/apollo-composable/dist/useQuery";
import { DocumentNode } from "graphql";
import _ from "lodash"

provideApolloClient(apolloClient);

export const mutation = <
  TResult = any,
  TVariables extends OperationVariables = OperationVariables
>(
  document: DocumentParameter<TResult, TVariables>,
  options?: OptionsParameter<TResult, TVariables>
) => {
  //@ts-ignore
  const {mutate} = useMutation<TResult,TVariables>(document,{
    errorPolicy: "all",
    ...options
  })
  const useMutate = async (variables:TVariables) => {
    let res = await mutate(variables)
    return res 
  }
  return useMutate
};

export const query = <R>(
  gql: DocumentNode,
  variables: any,
  options?: OptionsParameter<R, null>
): Promise<ApolloQueryResult<R>["data"]> => {
  const { onResult, onError } = useQuery<R>(gql, variables, {
    errorPolicy: "all",
    ...options,
  });
  return new Promise((resolve, reject) => {
    onResult((res) => {
      res.data && resolve(_.cloneDeepWith(res.data));
    });
    onError((error) => {
      reject(error.message);
    });
  });
};
