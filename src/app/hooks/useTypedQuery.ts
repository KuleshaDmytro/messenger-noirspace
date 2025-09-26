import { DocumentNode, OperationVariables, QueryHookOptions, QueryResult, TypedDocumentNode, useQuery } from "@apollo/client";

export function useTypedQuery<TData, TVariables extends OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {
  return useQuery<TData, TVariables>(query, options);
}