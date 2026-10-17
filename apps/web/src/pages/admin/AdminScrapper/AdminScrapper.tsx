import { zodResolver } from "@hookform/resolvers/zod";
import { useScrapperList } from "@tcg/react-query";
import {
  Button,
  DataTable,
  Dialog,
  IconButton,
  Input,
  PageHeading,
} from "@tcg/ui-web";
import { ChevronDown, Link, Plus, X } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { DevTool } from "@hookform/devtools";

const scehma = z.object({
  sources: z.array(z.httpUrl()),
  source: z.string()
    // .httpUrl({ normalize: true, pattern: /^laststicker\.com$/ })
    // .optional()
    .nullable(),
});
export const AdminScrapper = () => {
  const { data } = useScrapperList();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toggleExpanded = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const {
    control,
    register,
    formState: { errors, isDirty },
    resetField,
    handleSubmit,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(scehma),
    defaultValues: {
      source: "",
      sources: [""],
    },
  });
  const { append, fields } = useFieldArray({
    control,
    name: "sources",
    keyName: "id",
  });
  const handleOnClose = (open: boolean) => {
    if (open) return setIsDialogOpen(open);
    if (isDirty) alert("Changes not saved");
    else setIsDialogOpen(open);
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
  }, console.error);

  return (
    <div className="grid gap-8">
      <Dialog.Root open={isDialogOpen} onOpenChange={handleOnClose}>
        <DevTool control={control} placement="bottom-left" />
        <Dialog.Content>
          <Dialog.Header>
            <div className="flex justify-between">
              <div>
                <Dialog.Title>Scrapper Job</Dialog.Title>
                <Dialog.Description>
                  List down the source urls
                </Dialog.Description>
              </div>
              <Dialog.Close>
                <IconButton aria-label="close" variant="ghost">
                  <X />
                </IconButton>
              </Dialog.Close>
            </div>
          </Dialog.Header>
          <Dialog.Body className="grid gap-3">
            <Controller
              control={control}
              name="source"
              render={({ field }) => (
                <div className="flex gap-2 items-baseline">
                  <div className="grid flex-1">
                    <Input {...field} placeholder="Add source url" />
                    {errors.source && (
                      <span className="text-red-500">
                        {errors.source.message}
                      </span>
                    )}
                  </div>
                  <Button
                    disabled={!!errors?.source}
                    onClick={() => {
                      append(field.value);
                      resetField("source", { defaultValue: "" });
                    }}
                  >
                    Add
                  </Button>
                </div>
              )}
            />
            {fields.map((field, index) => (
              <Input
                {...register(`sources.${index}`)}
                key={field.id}
                placeholder="Add source url"
                color="red"
              />
            ))}

            <Button className="w-full" type="submit" onClick={onSubmit}>
              Submit
            </Button>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
      <PageHeading
        size="xl"
        title={"Scrapper Jobs"}
        // description={t("admin.categories.subtitle")}
        actions={
          <Button onClick={() => setIsDialogOpen(true)}>
            {/* <Link to="/admin/categories/new"> */}
            <Plus aria-hidden="true" className="size-4" />
            Add Scrapper Job
            {/* </Link> */}
          </Button>
        }
      />

      <DataTable.Root>
        <DataTable.Header>
          <DataTable.Row>
            <DataTable.Head></DataTable.Head>
            <DataTable.Head>Key</DataTable.Head>
          </DataTable.Row>
        </DataTable.Header>
        <DataTable.Body>
          {data?.data.map((scrapper) => {
            const isExpanded = expandedIds.has(scrapper.job.name);
            const children = scrapper.collections ?? [];

            return (
              <>
                <DataTable.Row key={scrapper.job.name}>
                  <DataTable.Cell className="py-3">
                    <IconButton
                      variant="ghost"
                      aria-label={t(
                        isExpanded
                          ? "admin.categories.collapse"
                          : "admin.categories.expand",
                        { name: scrapper.job.name },
                      )}
                      aria-expanded={isExpanded}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleExpanded(scrapper.job.name);
                      }}
                      disabled={children.length === 0}
                    >
                      <ChevronDown
                        aria-hidden="true"
                        className={`size-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </IconButton>
                  </DataTable.Cell>
                  <DataTable.Cell>{scrapper.job.name}</DataTable.Cell>
                </DataTable.Row>

                {isExpanded && children.length > 0 && (
                  <>
                    <DataTable.Row>
                      <DataTable.Head></DataTable.Head>
                      <DataTable.Head>Title</DataTable.Head>
                      <DataTable.Head>Source</DataTable.Head>
                      <DataTable.Head>Year</DataTable.Head>
                      <DataTable.Head>Scrapped At</DataTable.Head>
                    </DataTable.Row>
                    {children.map((collection) => (
                      <DataTable.Row>
                        <DataTable.Cell></DataTable.Cell>
                        <DataTable.Cell>
                          {collection.content.title}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          <Button variant="ghost" asChild>
                            <a
                              target="_blank"
                              href={collection.content.sourceUrl}
                            >
                              Open Source
                              <Link size={14} />
                            </a>
                          </Button>
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {collection.content.year}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          {new Date(collection.content.scrapedAt).toUTCString()}
                        </DataTable.Cell>
                      </DataTable.Row>
                    ))}
                  </>
                )}
              </>
            );
          })}
        </DataTable.Body>
      </DataTable.Root>
    </div>
  );
};
