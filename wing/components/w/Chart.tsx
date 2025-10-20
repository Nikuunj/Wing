"use client"
import { AreaSeries, createChart, ColorType, UTCTimestamp, CandlestickSeries, LineSeries } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

interface Props {
  // dataLine: {
  //   time: string;
  //   value: number;
  // }[];
  dataCandels: {
    time: string;
    low: number;
    high: number;
    open: number;
    close: number
  }[];
  colors?: {
    backgroundColor: string;
    lineColor: string;
    textColor: string;
    areaTopColor: string;
    areaBottomColor: string;
  }
}


function Chart({
  // dataLine,
  dataCandels,
  colors = {
    backgroundColor: '#18181b',
    lineColor: '#3b82f6',
    textColor: "#a1a1aa",
    areaTopColor: '#52525b ',
    areaBottomColor: 'rgba(59, 130, 246, 0.1)',
  } }: Props) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {

    if (!chartContainerRef.current) return;


    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors.backgroundColor },
        textColor: colors.textColor,
      },
      grid: {
        vertLines: {
          color: '#27272a'
        },
        horzLines: {
          color: '#27272a'
        }
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const candleChart = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
      wickUpColor: '#26a69a', wickDownColor: '#ef5350',
    })

    // const lineChart = chart.addSeries(LineSeries, {
    //   color: '#2962FF',
    //   lineWidth: 1,
    // })
    // const formattedLineData = dataLine.map(c => ({
    //   ...c,
    //   time: Math.floor(new Date(c.time).getTime() / 1000) as UTCTimestamp
    // }));
    //
    // lineChart.setData(formattedLineData);
    const formattedData = dataCandels.map(c => ({
      ...c,
      time: Math.floor(new Date(c.time).getTime() / 1000) as UTCTimestamp
    }));

    candleChart.setData(formattedData);

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };
    chart.timeScale().fitContent()
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [dataCandels, colors.backgroundColor, colors.lineColor, colors.textColor, colors.areaTopColor, colors.areaBottomColor])
  return (
    <div ref={chartContainerRef} className='h-full bg-zinc-900 -z-20' />
  )
}

export default Chart
