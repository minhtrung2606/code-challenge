import * as Select from "@radix-ui/react-select";
import Image from "next/image";

export type TokenSymbol = string;

export type TokenOption = {
  symbol: TokenSymbol;
  name: string;
  usdRate?: number;
};

type TokenSelectorProps = {
  value: TokenSymbol;
  tokens: TokenOption[];
  disabled?: boolean;
  onChange: (value: TokenSymbol) => void;
};

export function TokenSelector({
  value,
  tokens,
  disabled = false,
  onChange,
}: TokenSelectorProps) {
  const selectedToken = tokens.find((token) => token.symbol === value);

  return (
    <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
      <Select.Trigger
        className={[
          "inline-flex min-w-32 items-center justify-between gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10",
          disabled ? "cursor-not-allowed opacity-60" : "hover:bg-slate-50",
        ].join(" ")}
      >
        <span className="flex items-center gap-2">
          {selectedToken ? (
            <Image
              src={`/tokens/${selectedToken.symbol}.svg`}
              alt={`${selectedToken.name} icon`}
              width={20}
              height={20}
              className="rounded-full"
            />
          ) : null}

          <span>{selectedToken?.symbol ?? value}</span>
        </span>

        <Select.Icon className="text-xs text-slate-400">▼</Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={8}
          className="z-50 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
        >
          <Select.Viewport className="max-h-[35svh]">
            <Select.Item
              value="__placeholder__"
              className="flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2 text-slate-600 outline-none transition data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-950"
              disabled
            >
              <span className="text-xs text-slate-400">
                Scroll down to see more
              </span>
            </Select.Item>
            {tokens.map((token) => (
              <Select.Item
                key={token.symbol}
                value={token.symbol}
                className="flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2 text-slate-600 outline-none transition data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-950"
              >
                <Image
                  src={`/tokens/${token.symbol}.svg`}
                  alt={`${token.name} icon`}
                  width={32}
                  height={32}
                  className="rounded-full"
                />

                <div className="min-w-0 flex-1">
                  <Select.ItemText>
                    <span className="block text-sm font-semibold">
                      {token.symbol}
                    </span>
                  </Select.ItemText>

                  <span className="block truncate text-xs text-slate-500">
                    {token.name}
                  </span>
                </div>

                <Select.ItemIndicator className="text-sm text-cyan-500">
                  ✓
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
