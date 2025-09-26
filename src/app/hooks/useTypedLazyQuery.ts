import { useLazyQuery ,DocumentNode, LazyQueryHookOptions, LazyQueryResultTuple, OperationVariables, TypedDocumentNode } from "@apollo/client";

export function useTypedLazyQuery<TData, TVariables extends OperationVariables>(
    query: DocumentNode | TypedDocumentNode<TData, TVariables>,
    options?: LazyQueryHookOptions<TData, TVariables>
): LazyQueryResultTuple<TData, TVariables> {
    return useLazyQuery<TData, TVariables>(query, options);
}