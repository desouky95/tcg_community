import type { UseFormRegister, FieldError } from "react-hook-form";
import { usePhoneInput } from "react-international-phone";
import "/node_modules/flag-icons/css/flag-icons.min.css";

type PhoneNumberProps = {
  register: UseFormRegister<any>;
  errors?: FieldError;
  disabled?: boolean;
} & React.ComponentProps<"input"> & {
    value?: string;
  };
export const PhoneNumber = ({
  register,
  errors,
  value,
  ...props
}: PhoneNumberProps) => {
  const controlled = register(props.name!);
  const { country, inputValue, handlePhoneValueChange } = usePhoneInput({
    defaultCountry: "eg",
    value,
    forceDialCode: true,
    disableCountryGuess: true,
    inputRef: controlled.ref as any,
    prefix: "+",
    onChange(data) {
      controlled.onChange({ target: { value: data.inputValue } });
    },
  });

  return (
    <>
      <div className="relative group">
        <span className="absolute flex w-fit left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary-500 transition-colors">
          <span className={`fi fi-${country.iso2}`}></span>
        </span>
        <input
          type="text"
          placeholder="+20 100 000 0000"
          className={`w-full bg-input/30 border-2 ${!!errors ? "border-danger-500/50" : "border-border/50"} rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-sm font-medium`}
          {...props}
          {...controlled}
          onChange={(e) => {
            handlePhoneValueChange(e);
            controlled.onChange(e);
          }}
          value={inputValue}
        />
      </div>
    </>
  );
};
