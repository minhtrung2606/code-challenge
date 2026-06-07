"use client";

import {
  ToggleGroupButton,
  type ToggleGroupButtonOption,
} from "./ToggleGroupButton";

export type SumMethod = "equation" | "loop" | "recursion";

const computationMethodOptions: Array<ToggleGroupButtonOption<SumMethod>> = [
  {
    label: "Equation",
    value: "equation",
  },
  {
    label: "Loop",
    value: "loop",
  },
  {
    label: "Recursion",
    value: "recursion",
  },
];

type ComputationMethodSelectorProps = {
  value: SumMethod;
  onChange: (value: SumMethod) => void;
  disabled?: boolean
};

export function ComputationMethodSelector({
  value,
  onChange,
  disabled
}: ComputationMethodSelectorProps) {
  return (
    <ToggleGroupButton
      label="Choose computation method"
      options={computationMethodOptions}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
