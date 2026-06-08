"use client";

import {
  ComputationMethodSelector,
  SumMethod,
} from "@/components/ComputationMethodSelector";
import { sumToN } from "@/utils/sum-to-n";
import { useState } from "react";

const computationMethodWarnings: Partial<Record<SumMethod, string>> = {
  loop: "It may take longer for large numbers to get the result.",
  recursion: "It may fail for large numbers due to browser limitation",
};

export default function SumToNPage() {
  const [isComputing, setIsComputing] = useState(false);
  const [value, setValue] = useState("0");
  const [method, setMethod] = useState<SumMethod>("equation");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function calculateSum() {
    setError("");
    setResult(null);

    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setError("Please enter a number.");
      return;
    }

    if (!/^\d+$/.test(trimmedValue)) {
      setError("Please enter a positive integer.");
      return;
    }

    const n = BigInt(trimmedValue);

    if (n < 1n) {
      setError("Please enter a number greater than or equal to 1.");
      return;
    }

    try {
      setIsComputing(true);
      const sum = await sumToN(trimmedValue, method);
      setResult(sum);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message ?? "Failed to compute");
      } else {
        setError("Failed to compute");
      }
    } finally {
      setIsComputing(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-950">
            Sum from 1 to N
          </h1>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            calculateSum();
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <ComputationMethodSelector
              value={method}
              onChange={(nextMethod) => {
                setMethod(nextMethod);
                setResult(null);
                setError("");
              }}
              disabled={isComputing}
            />

            {!!computationMethodWarnings[method] && (
              <p className="text-xs text-amber-700">
                {computationMethodWarnings[method]}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="number"
              className="text-sm font-medium text-slate-500"
            >
              Enter the value of N
            </label>

            <input
              id="number"
              type="text"
              inputMode="numeric"
              value={value}
              onChange={(event) => {
                let val = event.target.value ?? 0;
                val = val.trim();

                if (!/^\d+$/.test(val)) return;

                setValue(`${Number(val)}`);
              }}
              placeholder="E.g. 100"
              className={[
                "rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10",
                !!error ? "border-red-400" : "border-slate-300",
                isComputing ? "bg-gray-50 hover:cursor-not-allowed" : "",
              ].join(" ")}
              disabled={isComputing}
            />

            {!!error && <p className="text-xs text-red-400">{error}</p>}
          </div>

          <button
            type="submit"
            className={[
              "rounded-xl px-4 py-3 text-md font-medium text-white transition",
              isComputing
                ? "hover:cursor-not-allowed bg-gray-400 hover:bg-auto"
                : "bg-slate-950 hover:bg-slate-800",
            ].join(" ")}
            disabled={isComputing}
          >
            {isComputing ? "Calculating..." : "Calculate sum"}
          </button>
        </form>

        {result !== null ? (
          <div className="flex flex-col gap-2 rounded-xl bg-slate-100 p-4 text-center">
            <p className="text-sm text-slate-600">Result</p>

            <p className="wrap-break-word text-2xl font-semibold text-slate-950">
              {result}
            </p>
          </div>
        ) : null}
      </div>
      <p className="mt-3 text-slate-600 text-sm">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/minhtrung2606/code-challenge/blob/main/responses/utils/sum-to-n.ts"
        >
          View code
        </a>
      </p>
    </main>
  );
}
