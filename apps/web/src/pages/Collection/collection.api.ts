import {
  useCategory,
  useChecklist, useDownloadChecklist
} from "@tcg/react-query";

export const useCollectionPageApis = (id: string) => {
  const { data: collection, isLoading } = useChecklist(id, {
    withParams: true,
    query: {
      expand: "category",
    },
  });

  const { mutate } = useDownloadChecklist(id);

  const { data: category } = useCategory(collection?.category?.slug, {
    withParams: true,
    query: {
      expand: "parent",
    },
  });

  return { collection, isLoading, download: mutate, category };
};
