import { Label } from "@/components/ui/label";
import React from "react";
import Select from "react-select";

interface SelectCreateI {
  value: { value: string; label: string };
  onChange: (value: { value: string; label: string }) => void;
  placeholder: string;
  create: (payload: string) => void;
  options: { value: string; label: string }[];
  label?: string;
}
const SelectCreate = ({
  value,
  onChange,
  placeholder,
  create,
  label,
  options,
}: SelectCreateI) => {
  return (
    <div>
      <Label>{label || ""}</Label>
      <Select
        id={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={onChange as any}
        onKeyDown={(e: any) => {
          if (e.key === "Enter") {
            create(e.target.value);
          }
        }}
        options={options}
      />
    </div>
  );
};

export default SelectCreate;
