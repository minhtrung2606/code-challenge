import { SwapForm } from "@/components/SwapForm";
import { TokenOption } from "@/components/TokenSelector";
import Link from "next/link";

type TokenPrice = {
  currency: string;
  date: string;
  price: number;
};

function getLatestUniquePrices(prices: TokenPrice[]) {
  const latestPriceByCurrency: Record<string, TokenPrice> = {};

  const sortedPrices = [...prices].sort(
    (firstItem, secondItem) =>
      new Date(secondItem.date).getTime() - new Date(firstItem.date).getTime(),
  );

  for (const priceItem of sortedPrices) {
    if (!priceItem.currency || !Number.isFinite(priceItem.price)) {
      continue;
    }

    if (!!latestPriceByCurrency[priceItem.currency]) {
      continue;
    }

    latestPriceByCurrency[priceItem.currency] = priceItem;
  }

  return Object.values(latestPriceByCurrency);
}

async function getSwapTokens(): Promise<TokenOption[]> {
  const response = await fetch("https://interview.switcheo.com/prices.json", {
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    return [];
  }

  const prices = (await response.json()) as TokenPrice[];

  return getLatestUniquePrices(prices).map((item) => ({
    symbol: item.currency,
    name: item.currency,
    usdRate: item.price,
  }));
}

export default async function SwapPage() {
  const tokens = await getSwapTokens();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <SwapForm tokens={tokens} />
      <p className="mt-3 text-slate-600 text-sm flex flex-row items-center justify-between text-center w-full max-w-md px-3">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/minhtrung2606/code-challenge/blob/main/responses/README.md"
        >
          View code
        </a>
        <Link href="/">Home</Link>
      </p>
    </main>
  );
}
