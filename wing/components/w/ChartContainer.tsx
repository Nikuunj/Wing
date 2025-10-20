"use client"
import { useEffect, useState } from "react";
import Chart from "./Chart"

function ChartContainer() {
  const [dataCandle, setDataCandle] = useState([]);
  // const [dataLine, setDataLine] = useState([])
  useEffect(() => {
    async function fetchCryptoData() {
      try {
        const res = await fetch(
          "https://api.binance.com/api/v3/klines?symbol=SOLUSDT&interval=30m&limit=336"
        );
        const json = await res.json();


        const formatted = json.map((item: any) => {
          const timestamp = item[0]; // milliseconds from Binance
          const date = new Date(timestamp);

          // Format date and time
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
            close: parseFloat(item[4])
          }
        });


        setDataCandle(formatted);
        // const formattedLine = json.map((item: any) => {
        //   const timestamp = item[0]; // milliseconds from Binance
        //   const date = new Date(timestamp);
        //
        //   // Format date and time
        //   const year = date.getFullYear();
        //   const month = String(date.getMonth() + 1).padStart(2, "0");
        //   const day = String(date.getDate()).padStart(2, "0");
        //   const hours = String(date.getHours()).padStart(2, "0");
        //   const minutes = String(date.getMinutes()).padStart(2, "0");
        //
        //   return {
        //     time: `${year}-${month}-${day} ${hours}:${minutes}`,
        //     value: parseFloat(item[4])
        //   }
        // });
        //
        // setDataLine(formattedLine)
        const interval = setInterval(fetchCryptoData, 1000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    }

    fetchCryptoData();
  }, []);
  /// want to show crypto price data and pass to like thhis formae so how i 
  return (
    <Chart
      dataCandels={dataCandle}
    // dataLine={dataLine}
    />

  )
}

export default ChartContainer

// dynamic
