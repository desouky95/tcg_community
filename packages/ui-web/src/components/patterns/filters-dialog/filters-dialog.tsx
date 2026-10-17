'use client'
import { X } from "lucide-react";
import { Button, IconButton } from "../../primitives";
import { Dialog, Select } from "../../radix";
import { AnimatePresence, motion } from "motion/react";
import type { FiltersDialogProps } from "./filters-dialog.models";
import { useReducer } from "react";

const AnimatedContent = motion.create(Dialog.Content);
export const FiltersDialog = ({
  onOpenChange,
  open,
  filters = [],
  onApply,
  onReset,
}: FiltersDialogProps) => {
  const [_, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "change":
        return {
          ...state,
          [action.field]: action.value,
        };
      default:
        return state;
    }
  }, {});
  return (
    <AnimatePresence mode="sync">
      {open && (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
          <Dialog.Overlay className="bg-none backdrop-blur-none" />

          {open && (
            <AnimatedContent
              key={"filters-modal"}
              bg="transparent"
              className="p-2 w-76"
              forceMount
              placement="start"
              initial={{ translateX: "-100%" }}
              animate={{ translateX: 0 }}
              exit={{ translateX: "-100%" }}
              transition={{
                ease: "easeInOut",
                duration: 0.4,
                type: "tween",
              }}
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-baseline mb-4">
                    <Dialog.Title>Filters</Dialog.Title>
                    <Dialog.Close asChild>
                      <IconButton aria-label="Close" size="sm">
                        <X aria-hidden="true" className="size-4" />
                      </IconButton>
                    </Dialog.Close>
                  </div>

                  <div className="grid">
                    {filters.map((filter) => (
                      <Select.Root
                        value={filter.value.toString()}
                        key={filter.name}
                        onValueChange={(value) =>
                          dispatch({
                            type: "change",
                            field: filter.name,
                            value,
                          })
                        }
                      >
                        <h2 className="font-bold text-xl">{filter.display}</h2>
                        <Select.Trigger>
                          <Select.Value placeholder={filter.name} />
                        </Select.Trigger>

                        <Select.Group>
                          <Select.Content>
                            {filter.options.map((option) => (
                              <Select.Item
                                key={`${option.display}-${option.value}`}
                                value={option.value.toString()}
                              >
                                {option.display}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Group>
                      </Select.Root>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 [&_button]:flex-1">
                  <Button onClick={onReset} variant="outline">
                    Reset
                  </Button>
                  <Button onClick={() => onApply?.(_)}>Apply</Button>
                </div>
              </div>
            </AnimatedContent>
          )}
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
};
