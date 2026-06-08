"use client";

import { CoinInput } from "@/components/CoinInput";
import { TokenOption, TokenSelector } from "@/components/TokenSelector";
import { SwapFormSubmitPayload, useSwapForm } from "@/hooks/useSwapForm";
import Image from "next/image";
import Link from "next/link";

type SwapFormProps = {
  tokens: TokenOption[];
  onSubmit?: (payload: SwapFormSubmitPayload) => void;
};

export function SwapForm({ tokens, onSubmit }: SwapFormProps) {
  const swapForm = useSwapForm({
    tokens,
    onSubmit,
  });

  const { values, formatted, validation, flags, actions } = swapForm;

  if (!tokens.length) {
    return (
      <div className="flex w-full max-w-md flex-col gap-3 rounded-2xl bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Swap</h1>
        <p className="text-sm text-slate-500">
          No tokens are available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-slate-950">Swap</h1>
          <p className="text-sm text-slate-500">
            Exchange crypto tokens instantly.
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 px-3 py-2 text-right">
          <p className="text-xs text-slate-500">Network</p>
          <p className="text-sm font-bold text-slate-950">Ethereum</p>
        </div>
      </div>

      {validation.shouldShowError && validation.result.position !== "input" && (
        <p className="text-xs text-red-500">{validation.result.errorMsg}</p>
      )}

      <form onSubmit={actions.submit} className="flex flex-col gap-4">
        <CoinInput
          className={[
            flags.disabled ? "bg-gray-50" : "",
            validation.shouldShowError && validation.result.position === "input"
              ? "border-red-500!"
              : "",
          ].join(" ")}
        >
          <CoinInput.Header>
            <CoinInput.Header.Title
              htmlFor="input-amount"
              label="Amount to send"
            />

            <span className="text-xs space-x-1">
              <span className="text-slate-400">Balance:</span>
              <span className="font-bold text-slate-600">
                4.382 {values.fromToken}
              </span>
            </span>
          </CoinInput.Header>

          <CoinInput.Body>
            <input
              id="input-amount"
              value={values.inputAmount}
              onChange={(event) =>
                actions.changeInputAmount(event.target.value)
              }
              inputMode="decimal"
              placeholder="0.00"
              disabled={flags.disabled}
              className="min-w-0 flex-1 bg-transparent text-3xl font-semibold text-slate-950 outline-none placeholder:text-slate-300"
              onKeyDown={actions.touch}
            />

            <TokenSelector
              value={values.fromToken}
              tokens={tokens}
              disabled={flags.disabled}
              onChange={actions.selectFromToken}
            />
          </CoinInput.Body>

          <CoinInput.Footer>
            {swapForm.tokens.bySymbol[values.fromToken]?.name}
          </CoinInput.Footer>

          {validation.shouldShowError &&
            validation.result.position === "input" && (
              <p className="text-xs text-red-500">
                {validation.result.errorMsg}
              </p>
            )}
        </CoinInput>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={actions.switchTokens}
            disabled={flags.disabled}
            className={[
              "flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-lg text-slate-950 shadow-sm transition",
              flags.disabled
                ? "cursor-not-allowed opacity-60"
                : "hover:bg-slate-100",
            ].join(" ")}
            aria-label="Switch tokens"
          >
            <span>↓</span>
            <span className="rotate-180">↓</span>
          </button>
        </div>

        <CoinInput className={flags.disabled ? "bg-gray-50" : ""}>
          <CoinInput.Header>
            <CoinInput.Header.Title
              htmlFor="output-amount"
              label="Amount to receive"
            />

            <span className="text-xs text-slate-400">Estimated</span>
          </CoinInput.Header>

          <CoinInput.Body>
            <input
              id="output-amount"
              value={formatted.outputAmount}
              readOnly
              placeholder="0.00"
              className="min-w-0 flex-1 bg-transparent text-3xl font-semibold text-slate-950 outline-none placeholder:text-slate-300"
            />

            <TokenSelector
              value={values.toToken}
              tokens={tokens}
              disabled={flags.disabled}
              onChange={actions.selectToToken}
            />
          </CoinInput.Body>

          <CoinInput.Footer>
            {swapForm.tokens.bySymbol[values.toToken]?.name}
          </CoinInput.Footer>
        </CoinInput>

        <div className="flex flex-col gap-3 rounded-xl bg-slate-100 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Rate</span>
            <span className="font-medium text-slate-950">
              1 {values.fromToken} ≈ {formatted.exchangeRate} {values.toToken}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Swap fee</span>
            <span className="font-medium text-slate-950">
              {formatted.feeAmount} {values.toToken}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm font-bold">
            <span className="text-slate-500">Minimum received</span>
            <span className="text-slate-950">
              {formatted.minimumReceived} {values.toToken}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={flags.isSubmitDisabled}
          className={[
            "rounded-xl px-4 py-3 text-sm font-medium text-white transition flex flex-row items-center justify-center",
            flags.isSubmitDisabled
              ? "cursor-not-allowed bg-gray-400"
              : "bg-slate-950 hover:bg-slate-800",
          ].join(" ")}
        >
          {flags.isLoading && (
            <Image
              src="/loader-circle.svg"
              alt="Swap is in progress"
              width={20}
              height={20}
              className="animate-spin opacity-30"
            />
          )}
          {!flags.isLoading && "CONFIRM SWAP"}
        </button>
      </form>
    </div>
  );
}
