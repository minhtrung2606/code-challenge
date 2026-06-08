import { TokenOption, TokenSymbol } from "@/components/TokenSelector";
import { formatAmount, getPairRate, parseAmount } from "@/utils/swap";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

const SWAP_FEE_RATE = 0.003;

export type SwapFormSubmitPayload = {
  fromToken: TokenSymbol;
  toToken: TokenSymbol;
  inputAmount: number;
  outputAmount: number;
  feeAmount: number;
  minimumReceived: number;
  exchangeRate: number;
};

export type SwapPreview = {
  rawInputAmount: string;
} & SwapFormSubmitPayload;

type SwapValidationResult = {
  hasError: boolean;
  errorMsg: string;
  position?: string;
};

type SwapValidationRule = (swapPreview: SwapPreview) => SwapValidationResult;

const swapValidationRules: SwapValidationRule[] = [
  (swapPreview) => ({
    hasError: isIncompleteFloat(swapPreview.rawInputAmount),
    errorMsg: "Enter a valid number.",
    position: "input",
  }),

  (swapPreview) => ({
    hasError: swapPreview.inputAmount <= 0,
    errorMsg: "Enter an amount greater than 0.",
    position: "input",
  }),

  (swapPreview) => ({
    hasError: swapPreview.fromToken === swapPreview.toToken,
    errorMsg: "Choose two different tokens to continue.",
  }),

  (swapPreview) => ({
    hasError: swapPreview.inputAmount > 0 && swapPreview.outputAmount <= 0,
    errorMsg:
      "We could not calculate this swap quote. Please choose another pair or try again.",
  }),
];

type UseSwapFormParams = {
  tokens: TokenOption[];
  onSubmit?: (payload: SwapFormSubmitPayload) => void;
};

export function useSwapForm({ tokens, onSubmit }: UseSwapFormParams) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);
  const [inputAmount, setInputAmount] = useState("0");

  const [fromToken, setFromToken] = useState<TokenSymbol>(
    tokens[0]?.symbol ?? "",
  );

  const [toToken, setToToken] = useState<TokenSymbol>(
    tokens[1]?.symbol ?? tokens[0]?.symbol ?? "",
  );

  const tokenBySymbol = useMemo<Record<TokenSymbol, TokenOption>>(
    () => Object.fromEntries(tokens.map((token) => [token.symbol, token])),
    [tokens],
  );

  const swapPreview = useMemo<SwapPreview>(() => {
    const fromUsdRate = tokenBySymbol[fromToken]?.usdRate;
    const toUsdRate = tokenBySymbol[toToken]?.usdRate;

    const exchangeRate = getPairRate({
      fromUsdRate,
      toUsdRate,
    });

    const numericInputAmount = parseAmount(inputAmount);

    const basePreview: SwapPreview = {
      fromToken,
      toToken,
      inputAmount: numericInputAmount,
      rawInputAmount: inputAmount,
      outputAmount: 0,
      feeAmount: 0,
      minimumReceived: 0,
      exchangeRate,
    };

    if (!exchangeRate) {
      return {
        ...basePreview,
        exchangeRate: 0,
      };
    }

    if (!numericInputAmount || numericInputAmount <= 0) {
      return basePreview;
    }

    const grossOutputAmount = numericInputAmount * exchangeRate;

    const feeAmount = grossOutputAmount * SWAP_FEE_RATE;
    const outputAmount = grossOutputAmount - feeAmount;
    const minimumReceived = outputAmount * 0.995;

    return {
      ...basePreview,
      outputAmount,
      feeAmount,
      minimumReceived,
    };
  }, [tokenBySymbol, fromToken, toToken, inputAmount]);

  const validationResult = useMemo(() => {
    const validation = swapValidationRules.find(
      (validate) => validate(swapPreview).hasError,
    );
    return (
      validation?.(swapPreview) || {
        hasError: false,
        errorMsg: "",
      }
    );
  }, [swapPreview]);

  const disabled = isSubmitting;
  const canSubmit = !validationResult.hasError;
  const isSubmitDisabled = disabled || !canSubmit;
  const shouldShowError = touched && validationResult.hasError;

  function handleSwitchTokens() {
    if (disabled) return;

    setFromToken(toToken);
    setToToken(fromToken);
  }

  function clearForm() {
    setInputAmount("0");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitDisabled) return;

    setIsSubmitting(true);

    async function _doSwap() {
      try {
        // Fake async operation
        await new Promise((res, rej) => {
          const id = setTimeout(() => {
            clearTimeout(id);

            const rand = Math.random();
            if (rand > 0.3) {
              res(1);
            } else {
              rej(0);
            }
          }, 1500);
        });

        onSubmit?.(swapPreview);
        clearForm();
        toast.success("Swap completed successfully.");
      } catch {
        toast.error("Swap failed. Please try again.");
        console.error("Failed to proceed swap with the following data");
        console.log(swapPreview);
      } finally {
        setTouched(false);
        setIsSubmitting(false);
      }
    }

    _doSwap();
  }

  function handleSelectFromToken(nextFromToken: TokenSymbol) {
    if (disabled) return;

    if (nextFromToken === toToken) {
      handleSwitchTokens();
      return;
    }

    setFromToken(nextFromToken);
  }

  function handleSelectToToken(nextToToken: TokenSymbol) {
    if (disabled) return;

    if (nextToToken === fromToken) {
      handleSwitchTokens();
      return;
    }

    setToToken(nextToToken);
  }

  function handleInputAmountChange(value: string) {
    if (disabled) return;
    if (!/^\d*\.?\d*$/.test(value)) return;

    setInputAmount(isIncompleteFloat(value) ? value : `${Number(value)}`);
  }

  return {
    values: {
      inputAmount,
      fromToken,
      toToken,
    },

    tokens: {
      list: tokens,
      bySymbol: tokenBySymbol,
    },

    preview: swapPreview,

    formatted: {
      outputAmount: swapPreview.outputAmount
        ? formatAmount(swapPreview.outputAmount)
        : "",
      exchangeRate: formatAmount(swapPreview.exchangeRate || 0),
      feeAmount: formatAmount(swapPreview.feeAmount),
      minimumReceived: formatAmount(swapPreview.minimumReceived),
    },

    validation: {
      result: validationResult,
      canSubmit,
      shouldShowError,
    },

    flags: {
      disabled,
      isLoading: isSubmitting,
      isSubmitDisabled,
    },

    actions: {
      submit: handleSubmit,
      switchTokens: handleSwitchTokens,
      selectFromToken: handleSelectFromToken,
      selectToToken: handleSelectToToken,
      changeInputAmount: handleInputAmountChange,
      touch: () => setTouched(true),
    },
  };
}

function isIncompleteFloat(value: string) {
  return value.includes(".") && !value.split(".")[1];
}
