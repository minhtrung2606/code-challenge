import { ReactNode } from "react";

type CoinInputRootProps = {
  className?: string;
  children: ReactNode;
};

type CoinInputHeaderProps = {
  children: ReactNode;
};

type CoinInputHeaderTitleProps = {
  htmlFor: string;
  label: string;
};

type CoinInputBodyProps = {
  children: ReactNode;
};

type CoinInputFooterProps = {
  children: ReactNode;
};

const CoinInputRoot = ({ className, children }: CoinInputRootProps) => {
  return (
    <div
      className={[
        "flex flex-col gap-2 rounded-xl border border-slate-300 p-4",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
};

const CoinInputHeader = ({ children }: CoinInputHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-3">{children}</div>
  );
};

const CoinInputHeaderTitle = ({
  htmlFor,
  label,
}: CoinInputHeaderTitleProps) => {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-slate-500">
      {label}
    </label>
  );
};

const CoinInputBody = ({ children }: CoinInputBodyProps) => {
  return <div className="flex items-center gap-3">{children}</div>;
};

const CoinInputFooter = ({ children }: CoinInputFooterProps) => {
  return <div className="text-xs text-slate-400">{children}</div>;
};

export const CoinInput = Object.assign(CoinInputRoot, {
  Header: Object.assign(CoinInputHeader, {
    Title: CoinInputHeaderTitle,
  }),
  Body: CoinInputBody,
  Footer: CoinInputFooter,
});
