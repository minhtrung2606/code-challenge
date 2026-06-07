"use client";

import { useId } from "react";

export type ToggleGroupButtonOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type ToggleGroupButtonProps<TValue extends string> = {
  label?: string;
  options: ReadonlyArray<ToggleGroupButtonOption<TValue>>;
  value: TValue;
  onChange: (value: TValue) => void;
  disabled?: boolean;
};

export function ToggleGroupButton<TValue extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
}: ToggleGroupButtonProps<TValue>) {
  const labelId = useId();

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <p id={labelId} className="text-sm font-medium text-slate-500">
          {label}
        </p>
      ) : null}

      <div
        role="group"
        aria-labelledby={label ? labelId : undefined}
        className="grid rounded-xl border border-slate-300 bg-slate-100 p-1"
        style={{
          gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        }}
      >
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={[
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                isSelected
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500",
                disabled ? "hover:cursor-not-allowed" : "hover:text-slate-950",
              ].join(" ")}
              disabled={disabled}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
