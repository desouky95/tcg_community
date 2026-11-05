import { Input, Dialog, IconButton, Button } from "@tcg/ui-web";
import { useRef, type ComponentProps } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useStartScrapperJob } from "@tcg/react-query";

const schema = z.object({
  collections: z.array(z.object({ url: z.httpUrl() })).min(1),
});
const inputSchema = z.object({
  url: z.httpUrl(),
});
type ScrapperSchema = z.infer<typeof schema>;
type Props = ComponentProps<typeof Dialog.Root> & {};

export const ScrapperModal = ({ open, onOpenChange }: Props) => {
  const {
    control,
    formState: { isDirty },
    handleSubmit,
  } = useForm<ScrapperSchema>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      collections: [],
    },
  });
  const {
    control: inputControl,
    resetField,
    getValues,
  } = useForm({
    resolver: zodResolver(inputSchema),
  });

  const { mutate: startJob } = useStartScrapperJob();
  const { append, fields, remove } = useFieldArray({
    control,
    keyName: "id",
    name: "collections",
  });

  const onSubmit = handleSubmit((data) => {
    // data will not contain "optionalField"
    startJob(
      data.collections.map((_) => _.url),
      {
        onSuccess() {
          onOpenChange?.(false);
        },
      }
    );
  }, console.error);

  const handleClose = () => {
    if (isDirty) return alert("Can't close");
    onOpenChange?.(false);
  };
  const inputRef = useRef(null);

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Content>
        <form onSubmit={onSubmit}>
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
              control={inputControl}
              name={"url"}
              render={({ field, fieldState }) => (
                <div className="flex gap-2 items-center">
                  <div className="grid flex-1">
                    <Input
                      {...field}
                      ref={inputRef}
                      placeholder="Add source url"
                    />
                  </div>
                  <IconButton
                    aria-label="Add"
                    onClick={() => {
                      if (fieldState.invalid) return;
                      append({ url: getValues().url });
                      resetField("url", { defaultValue: "", keepDirty: false });
                    }}
                  >
                    <Plus />
                  </IconButton>
                </div>
              )}
            />

            {fields.map((field, index) => (
              <Controller
                control={control}
                name={`collections.${index}.url`}
                render={({ field: item }) => (
                  <div className="flex gap-2 items-center">
                    <div className="grid flex-1">
                      <Input
                        {...item}
                        key={field.id}
                        placeholder="Add source url"
                        color="red"
                      />
                    </div>
                    <IconButton
                      aria-label="remove"
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      <Trash />
                    </IconButton>
                  </div>
                )}
              />
            ))}

            <Button className="w-full" type="submit">
              Submit
            </Button>
          </Dialog.Body>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
