import { Side } from "@/common-types/orderbook";
import {
  calculateMarketSpread,
  calculateMidPrice,
  parseRawOrderbookLevels,
  sortRawOrderbookLevels,
} from "./utils";

describe("calculateMidPrice", () => {
  it("returns the average of bestBid and bestAsk", () => {
    expect(calculateMidPrice(100, 200)).toBe(150);
  });

  it("returns NaN when bestBid is NaN", () => {
    expect(calculateMidPrice(NaN, 200)).toBeNaN();
  });

  it("returns NaN when bestAsk is NaN", () => {
    expect(calculateMidPrice(100, NaN)).toBeNaN();
  });
});

describe("calculateMarketSpread", () => {
  it("returns correct absolute and percentage spread", () => {
    const spread = calculateMarketSpread(100, 102);
    expect(spread.absolute).toBe(2);
    expect(spread.percentage).toBeCloseTo(2);
  });

  it("returns NaN when bestBid is NaN", () => {
    const spread = calculateMarketSpread(NaN, 102);
    expect(spread.absolute).toBeNaN();
    expect(spread.percentage).toBeNaN();
  });

  it("returns NaN when bestAsk is NaN", () => {
    const spread = calculateMarketSpread(100, NaN);
    expect(spread.absolute).toBeNaN();
    expect(spread.percentage).toBeNaN();
  });

  it("returns percentage 0 when bestBid is 0", () => {
    const spread = calculateMarketSpread(0, 10);
    expect(spread.percentage).toBe(0);
  });
});

describe("sortRawOrderbookLevels", () => {
  const levels = [
    { price: "200", quantity: "1" },
    { price: "100", quantity: "2" },
    { price: "300", quantity: "3" },
  ];

  it("sorts asks ascending", () => {
    const sorted = sortRawOrderbookLevels(levels, Side.Ask);
    expect(sorted.map((l) => l.price)).toEqual(["100", "200", "300"]);
  });

  it("sorts bids descending", () => {
    const sorted = sortRawOrderbookLevels(levels, Side.Bid);
    expect(sorted.map((l) => l.price)).toEqual(["300", "200", "100"]);
  });

  it("does not mutate original array", () => {
    const original = [...levels];
    sortRawOrderbookLevels(levels, Side.Ask);
    expect(levels).toEqual(original);
  });
});

describe("parseRawOrderbookLevels", () => {
  const levels = [
    { price: "100", quantity: "2" },
    { price: "200", quantity: "3" },
    { price: "300", quantity: "1" },
  ];

  it("parses price and quantity as numbers", () => {
    const parsed = parseRawOrderbookLevels(levels, 3);
    expect(parsed[0].price).toBe(100);
    expect(parsed[0].quantity).toBe(2);
  });

  it("accumulates total correctly", () => {
    const parsed = parseRawOrderbookLevels(levels, 3);
    expect(parsed[0].total).toBe(2);
    expect(parsed[1].total).toBe(5);
    expect(parsed[2].total).toBe(6);
  });

  it("respects the limit", () => {
    const parsed = parseRawOrderbookLevels(levels, 2);
    expect(parsed).toHaveLength(2);
  });

  it("returns empty array when input is empty", () => {
    expect(parseRawOrderbookLevels([], 10)).toEqual([]);
  });
});
