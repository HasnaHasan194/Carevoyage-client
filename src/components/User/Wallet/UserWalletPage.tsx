import React, { useState, useMemo } from "react";
import {
  useMyWallet,
  useMyWalletTransactions,
  useCreateWalletTopupCheckout,
} from "@/hooks/User/useWallet";
import type {
  WalletTransactionTypeFilter,
  WalletTransactionSort,
} from "@/services/User/walletService";
import { Loader2, ChevronLeft, ChevronRight, Wallet } from "lucide-react";

const CREAM = {
  bg: "#FAF7F2",
  card: "#FFFEFB",
  border: "#E8E2D9",
  muted: "#8B7355",
  primary: "#6B5344",
  accent: "#A08060",
  credit: "#2D6A4F",
  debit: "#9D2B2B",
};

export const UserWalletPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<WalletTransactionTypeFilter>("all");
  const [sort, setSort] = useState<WalletTransactionSort>("newest");
  const limit = 10;
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState<number>(500);

  const txParams = useMemo(
    () => ({
      page,
      limit,
      type: typeFilter,
      sort,
    }),
    [page, limit, typeFilter, sort]
  );

  const {
    data: wallet,
    isLoading: isWalletLoading,
    isError: isWalletError,
  } = useMyWallet();

  const topupMutation = useCreateWalletTopupCheckout();

  const {
    data: transactionsData,
    isLoading: isTxLoading,
    isError: isTxError,
  } = useMyWalletTransactions(txParams);

  const transactions = transactionsData?.transactions ?? [];
  const totalPages = transactionsData?.totalPages ?? 1;
  const total = transactionsData?.total ?? 0;

  if (isWalletError || (!isWalletLoading && !wallet)) {
    return (
      <div
        className="min-h-screen p-6 lg:p-8"
        style={{ backgroundColor: CREAM.bg }}
      >
        <h1 className="text-xl font-semibold mb-2" style={{ color: CREAM.primary }}>
          Wallet
        </h1>
        <p className="text-sm" style={{ color: CREAM.muted }}>
          We couldn&apos;t load your wallet balance. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6 lg:p-8 max-w-4xl mx-auto"
      style={{ backgroundColor: CREAM.bg }}
    >
      <h1
        className="text-2xl font-semibold tracking-tight mb-6"
        style={{ color: CREAM.primary }}
      >
        Wallet
      </h1>

      {/* Balance card */}
      <div
        className="rounded-xl border p-6 mb-8"
        style={{
          backgroundColor: CREAM.card,
          borderColor: CREAM.border,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5" style={{ color: CREAM.accent }} />
            <span className="text-sm font-medium" style={{ color: CREAM.muted }}>
              Current balance
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsTopupOpen(true)}
            className="text-sm rounded-lg border px-3 py-1.5 transition-opacity disabled:opacity-50"
            style={{
              borderColor: CREAM.border,
              backgroundColor: CREAM.bg,
              color: CREAM.primary,
            }}
            disabled={topupMutation.isPending}
          >
            {topupMutation.isPending ? "Redirecting..." : "Add money"}
          </button>
        </div>
        {wallet ? (
          <p className="text-3xl font-semibold tracking-tight" style={{ color: CREAM.primary }}>
            ₹ {wallet.balance.toLocaleString()}
          </p>
        ) : (
          <div className="h-9 w-24 flex items-center">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: CREAM.accent }} />
          </div>
        )}
        <p className="text-xs mt-3" style={{ color: CREAM.muted }}>
          Refunds approved by agencies are credited here.
        </p>
      </div>

      {/* Top-up modal */}
      {isTopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-xl border p-5"
            style={{ backgroundColor: CREAM.card, borderColor: CREAM.border }}
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-base font-semibold" style={{ color: CREAM.primary }}>
                Add money to wallet
              </h3>
              <button
                type="button"
                onClick={() => setIsTopupOpen(false)}
                className="text-sm underline"
                style={{ color: CREAM.muted }}
                disabled={topupMutation.isPending}
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[500, 1000, 2000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopupAmount(amt)}
                  className="rounded-lg border px-3 py-2 text-sm"
                  style={{
                    borderColor: CREAM.border,
                    backgroundColor: topupAmount === amt ? CREAM.bg : CREAM.card,
                    color: CREAM.primary,
                  }}
                  disabled={topupMutation.isPending}
                >
                  ₹ {amt}
                </button>
              ))}
            </div>

            <label className="block text-xs mb-1" style={{ color: CREAM.muted }}>
              Custom amount
            </label>
            <input
              type="number"
              min={1}
              value={topupAmount}
              onChange={(e) => setTopupAmount(Number(e.target.value))}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 mb-4"
              style={{
                borderColor: CREAM.border,
                backgroundColor: CREAM.bg,
                color: CREAM.primary,
              }}
              disabled={topupMutation.isPending}
            />

            <button
              type="button"
              onClick={() => topupMutation.mutate(topupAmount)}
              className="w-full rounded-lg px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: CREAM.accent, color: "#fff" }}
              disabled={topupMutation.isPending || !topupAmount || topupAmount <= 0}
            >
              {topupMutation.isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirecting to Stripe...
                </span>
              ) : (
                "Continue to payment"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Transactions */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: CREAM.card,
          borderColor: CREAM.border,
        }}
      >
        <div
          className="px-4 py-3 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          style={{ borderColor: CREAM.border }}
        >
          <h2 className="text-sm font-semibold" style={{ color: CREAM.primary }}>
            Transactions
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as WalletTransactionTypeFilter);
                setPage(1);
              }}
              className="text-sm rounded-lg border px-3 py-1.5 focus:outline-none focus:ring-1"
              style={{
                borderColor: CREAM.border,
                backgroundColor: CREAM.bg,
                color: CREAM.primary,
              }}
            >
              <option value="all">All</option>
              <option value="CREDIT">Credit</option>
              <option value="DEBIT">Debit</option>
            </select>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as WalletTransactionSort);
                setPage(1);
              }}
              className="text-sm rounded-lg border px-3 py-1.5 focus:outline-none focus:ring-1"
              style={{
                borderColor: CREAM.border,
                backgroundColor: CREAM.bg,
                color: CREAM.primary,
              }}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>

        {isTxLoading && !transactionsData ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: CREAM.accent }} />
          </div>
        ) : isTxError ? (
          <p className="p-6 text-sm" style={{ color: CREAM.muted }}>
            Couldn&apos;t load transactions. Please try again.
          </p>
        ) : transactions.length === 0 ? (
          <p className="p-6 text-sm" style={{ color: CREAM.muted }}>
            No transactions yet.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr
                    className="text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: CREAM.muted, backgroundColor: CREAM.bg }}
                  >
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const isCredit = tx.type === "CREDIT";
                    return (
                      <tr
                        key={tx.id}
                        className="border-t"
                        style={{ borderColor: CREAM.border }}
                      >
                        <td className="px-4 py-3" style={{ color: CREAM.primary }}>
                          {new Date(tx.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: isCredit
                                ? "rgba(45, 106, 79, 0.1)"
                                : "rgba(157, 43, 43, 0.1)",
                              color: isCredit ? CREAM.credit : CREAM.debit,
                            }}
                          >
                            {isCredit ? "Credit" : "Debit"}
                          </span>
                        </td>
                        <td className="px-4 py-3" style={{ color: CREAM.muted }}>
                          {tx.source}
                        </td>
                        <td
                          className="px-4 py-3 text-right font-medium"
                          style={{ color: isCredit ? CREAM.credit : CREAM.debit }}
                        >
                          {isCredit ? "+" : "−"}₹ {tx.amount.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div
                className="flex items-center justify-between gap-4 px-4 py-3 border-t"
                style={{ borderColor: CREAM.border }}
              >
                <span className="text-xs" style={{ color: CREAM.muted }}>
                  {total} transaction{total !== 1 ? "s" : ""}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    style={{
                      borderColor: CREAM.border,
                      backgroundColor: CREAM.card,
                      color: CREAM.primary,
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs min-w-16 text-center" style={{ color: CREAM.muted }}>
                    {page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    style={{
                      borderColor: CREAM.border,
                      backgroundColor: CREAM.card,
                      color: CREAM.primary,
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
