/**
 * Assumptions:
 * - `balance.blockchain`: `blockchain` does not exist in WalletBalance
 *   => Add the fields to WalletBalance
 *
 * - `return 0` for equal items in the sort function is missing
 *   => Re-add it up
 *
 * - Each instance of WalletBalance indicate user balance of a currency from a particular blockchain
 *   This means that user may have balances of USDT in different blockchains
 *   Hence, the hook `useWalletBalances()` will return all balances of all currencies from all the supported blockchains that the user possesses
 *
 *
 * Computational inefficiencies & anti-patterns:
 * - `sortedBalances` relies on `prices` which has no use for the filter and sort
 *   So whenever `prices` change the `sortedBalances` is unnecessarily computed
 *   => Remove `prices` out of the dependency list
 *
 * - `formattedBalances` will be called whenever the `WalletPage` component gets re-rendered
 *   Re-renders may happen when its parent gets re-rendered causing the `formattedBalances` get re-computed
 *   even when `sortedBalances` is not changed (the `balances` is not changed)
 *   => This is a redundant computation. `formatted` can be calculate when building rows
 *   => Remove the computation for `formattedBalances`
 *
 * - `key` prop passed in the `WalletRow` uses the index value of the loop which is not good
 *   => Update to use `${balance.currency}-${balance.blockchain}`
 *   The key is a combination of currency and blockchain because as stated above user may possess USDT from 2 different blockchains, e.g. Osmosis and Etherium
 *
 * - `rows` also is an inefficient computation whenever `WalletPage` is re-rendered even sortedBalances or prices do not change
 *   => put the computation of `rows` into a useMemo with sortedBalances and prices are its dependencies
 *
 *
 * Others:
 * - It's understandable to filter out balances of blockchains having priorities less than -99 (likely as hidden blockchains)
 *   But it's weird when filtering out balances having amounts less than or equal 0
 *   For initial WalletPage without any special conditions, it should show a list of all balances even including 0 amount
 *   (we can later add up a condition to show/hide balances having 0 amount)
 *   => with the assumption of displaying all user possessed balances, then remove the if statement of `balance.amount <= 0`
 *   and simplify the filter predicate callback function
 */

/** */
/** */
/** */

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface BoxProps {
  children: ReactNode;
}

interface Props extends BoxProps {
  userId: string;
}

const classes = {
  row: "",
};

const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
      return 20;
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => getPriority(balance.blockchain) > -99)
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        return 0;
      });
  }, [balances]);

  const rows = useMemo(
    () =>
      sortedBalances.map((balance: WalletBalance) => (
        <WalletRow
          className={classes.row}
          key={`${balance.currency}-${balance.blockchain}`}
          amount={balance.amount}
          usdValue={prices[balance.currency] * balance.amount}
          formattedAmount={balance.amount.toFixed()}
        />
      )),
    [prices, sortedBalances],
  );

  return <div {...rest}>{rows}</div>;
};

function WalletRow({}: {
  className: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}) {
  return null;
}

function useWalletBalances(): WalletBalance[] {
  return [];
}

function usePrices(): Record<string, number> {
  return {};
}
