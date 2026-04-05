import { useErrorContext } from "../providers/ErrorProvider";

export const useError = () => {
  return useErrorContext();
};