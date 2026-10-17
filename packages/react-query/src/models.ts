import type { UseMutationOptions } from "@tanstack/react-query";
import type {
  APIResponse,
  Category,
  CategoryCreatePayload,
} from "@tcg/api-contracts";

export type UseCategoryMutationsArgs = {
  update?: UseMutationOptions<
    APIResponse<Category>,
    Error,
    CategoryCreatePayload,
    unknown
  >;
};
