import { DocumentNode, TypedDocumentNode } from "@apollo/client";
import { useMutation, MutationHookOptions, MutationTuple } from "@apollo/client";

export function useTypedMutation<TData, TVariables = void>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: MutationHookOptions<TData, TVariables>
): MutationTuple<TData, TVariables> {
  return useMutation<TData, TVariables>(mutation, options);
}
