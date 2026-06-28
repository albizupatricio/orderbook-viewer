import { Suspense } from "react";
import { OrderbookViewer } from "@/app/components/orderbook/OrderbookViewer/OrderbookViewer";
import { TOP_TICKERS, getTickersInfo } from "@/services/marketDataService";

const LOADING_FALLBACK = (
  <OrderbookViewer tickersInfo={TOP_TICKERS} isLoading />
);

export default function HomePage() {
  return (
    <main className="bg-black min-h-screen p-4 sm:p-8 overflow-y-auto">
      <h1 className="text-2xl font-semibold text-ov-default mb-6 pb-4">
        Frontend Challenge
      </h1>
      <Suspense fallback={LOADING_FALLBACK}>
        <TickerLoader />
      </Suspense>
    </main>
  );
}

async function TickerLoader() {
  let tickers = TOP_TICKERS;
  let hasError = false;

  try {
    tickers = await getTickersInfo();
  } catch {
    hasError = true;
  }

  return <OrderbookViewer tickersInfo={tickers} hasError={hasError} />;
}
