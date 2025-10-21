"use client"
import { useEffect, useState } from "react";
import Chart from "./Chart"
import { useQuery } from "@tanstack/react-query";

function ChartContainer() {
  async function fetchCryptoData() {
    const res = await fetch(
      "https://api.binance.com/api/v3/klines?symbol=SOLUSDT&interval=30m&limit=336"
    );
    const json = await res.json();

    const formatted = json.map((item: string[]) => {
      const timestamp = item[0];
      const date = new Date(timestamp);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return {
        time: `${year}-${month}-${day} ${hours}:${minutes}`,
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
      };
    });

    return formatted;
  }
  const { data: dataCandle, isLoading, isError } = useQuery({
    queryKey: ["sol-candles"],
    queryFn: fetchCryptoData,
    refetchInterval: 1000, // ← replaces setInterval
  });


  if (isLoading && !dataCandle) return <div className="flex justify-center items-center h-full">Loading...</div>;
  return (
    <Chart
      dataCandels={dataCandle}
    // dataLine={dataLine}
    />

  )
}

export default ChartContainer

// dynamic
