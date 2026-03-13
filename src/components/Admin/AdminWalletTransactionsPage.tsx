import React, { useState, useMemo } from "react";
import {
  useMyWallet,
  useMyWalletTransactions,
} from "@/hooks/User/useWallet";
import type {
  WalletTransactionTypeFilter,
  WalletTransactionSort,
  PaginatedWalletTransactionsResponse,
  WalletTransaction,
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

export const AdminWalletTransactionsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<WalletTransactionTypeFilter>("all");
  const [sort, setSort] = useState<WalletTransactionSort>("newest");
  const limit = 10;

  const txParams = useMemo(
    () => ({
      page,
      limit,
      type: typeFilter,
      sort,
    }),
    [page, limit, typeFilter, sort]
  );

  const { data: wallet, isLoading: isWalletLoading } = useMyWallet();
  const {
    data: transactionsData,
    isLoading: isTxLoading,
    isError: isTxError,
  } = useMyWalletTransactions(txParams);

  const transactionsResponse =
    transactionsData as PaginatedWalletTransactionsResponse | undefined;
  const transactions: WalletTransaction[] =
    transactionsResponse?.transactions ?? [];
  const totalPages = transactionsResponse?.totalPages ?? 1;
  const total = transactionsResponse?.total ?? 0;

  return (
    <div
      className="min-h-screen p-6 lg:p-8"
      style={{ backgroundColor: CREAM.bg }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: CREAM.primary }}
        >
          Wallet
        </h1>
        <p className="text-sm" style={{ color: CREAM.muted }}>
          Platform (admin) balance and transactions.
        </p>

        {/* Platform balance card */}
        <div
          className="rounded-xl border p-6 max-w-md"
          style={{
            backgroundColor: CREAM.card,
            borderColor: CREAM.border,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5" style={{ color: CREAM.accent }} />
            <span className="text-sm font-medium" style={{ color: CREAM.muted }}>
              Platform balance
            </span>
          </div>
          {isWalletLoading || !wallet ? (
            <div className="h-9 flex items-center">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: CREAM.accent }} />
            </div>
          ) : (
            <p className="text-3xl font-semibold tracking-tight" style={{ color: CREAM.primary }}>
              ₹ {wallet.balance.toLocaleString()}
            </p>
          )}
        </div>

        {/* Transactions — admin wallet only */}
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
              Failed to load transactions. Please try again.
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
    </div>
  );
};
