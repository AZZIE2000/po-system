import { Label } from "@/components/ui/label";
import React from "react";
import Select from "react-select";

interface SelectCreateI {
  value: { value: string; label: string };
  onChange: (value: { value: string; label: string }) => void;
  placeholder: string;
  create?: (payload: string) => void;
  options: { value: string; label: string }[];
  label?: string;
  noOptionsMessage?: (obj: { inputValue: string }) => React.ReactNode;
}
const SelectCreate = ({
  value,
  onChange,
  placeholder,
  create,
  label,
  options,
  noOptionsMessage,
}: SelectCreateI) => {
  return (
    <div>
      <Label>{label || ""}</Label>
      <Select
        noOptionsMessage={noOptionsMessage}
        id={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={onChange as any}
        onKeyDown={(e: any) => {
          if (create && e.key === "Enter") {
            create(e.target.value);
          }
        }}
        options={options}
      />
    </div>
  );
};

export default SelectCreate;
