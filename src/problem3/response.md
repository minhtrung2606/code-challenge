## Explanations

### Assumptions:

- For `balance.blockchain`: the field `blockchain` does not exist in `WalletBalance`

  => Add the fields to WalletBalance

- `return 0` for equal items in the sort function is missing

  => Re-add it up

- Each instance of `WalletBalance` indicates user balance of a currency from a particular blockchain

  This means that user may have balances of USDT, for example, in different blockchains

  Hence, the hook `useWalletBalances()` will return all balances of all currencies from all the supported blockchains that the user possesses

### Computational inefficiencies & anti-patterns:

- `sortedBalances` relies on `prices` which has no use for the filter and sort.

  So whenever `prices` change the `sortedBalances` is unnecessarily computed

  => Remove `prices` out of the dependency list

- `formattedBalances` will be called whenever the `WalletPage` component gets re-rendered.

  Re-renders may happen when its parent gets re-rendered causing the `formattedBalances` get re-computed
  even when `sortedBalances` is not changed (the `balances` is not changed)

  => This is a redundant computation.

  Also, `formatted` can be calculated when building rows

  => Remove the computation for `formattedBalances`

- `key` prop passed in the `WalletRow` uses the index of the loop which is not good

  Update to use `${balance.currency}-${balance.blockchain}`
  The key is a combination of currency and blockchain because as stated above user may possess USDT from 2 different blockchains, e.g. Osmosis and Etherium

- `rows` is also an inefficient computation whenever `WalletPage` is re-rendered even `sortedBalances` or `prices` does not change

  => put the computation of `rows` into a **useMemo** with `sortedBalances` and `prices` are its dependencies

### Others:

- It's understandable to filter out balances of blockchains having priorities less than -99 (likely treated as hidden/unsupported blockchains)

  But it's weird when filtering out balances having amounts less than or equal 0

  For initial `WalletPage` without any special conditions, it should show a list of all balances even including 0 amount
  (we can later add up a condition to show/hide balances having 0 amount)

  => with the assumption of displaying all user balances, remove the `if` statement of `balance.amount <= 0`
  and simplify the filter predicate callback function

## Refactored version

```
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
          usdValue={prices[balance.currency]  balance.amount}
          formattedAmount={balance.amount.toFixed()}
        >
      )),
    [prices, sortedBalances],
  );

  return <div {...rest}>{rows}<div>;
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
```

## Origin problem code block

```
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

	const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}
```
