import { useMemo, useState } from "react";
import Image from "next/image";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import priceFormatter from "../utils/priceFormatter";
import timeFormat from "../utils/timeFormat";
import MarketCapChart from "./MarketCapChart";
import NavChart from "./NavChart";
import arrowRed from "../public/arrow_red.svg";
import arrowGreen from "../public/arrow_green.svg";
import SentimentCheck from "./SentimentCheck";
import { mean } from "d3-array";
import content from "../content/en_EN.json";

const getDate = (d) => new Date(d[0]);
const getNavDate = (d) => d.timestamp;
const getPieValue = (d) => d[1];

const SubCharts = ({ underlyingData, marketCap, play }) => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const inceptionPerc = useMemo(() => {
    return ((play.market_data.current_price.usd - 1) * 100).toFixed();
  }, [play.market_data.current_price.usd]);

  const markeCapMeanLastWeek = () => {
    const lastWeek = marketCap.filter((d) => getDate(d) >= weekAgo);
    let lastWeekPerDay = [];
    let todayCounter = Date.now();
    for (let i = 0; i < 7; i++) {
      const days = lastWeek.filter(
        (d) =>
          getDate(d) <= todayCounter &&
          getDate(d) >= todayCounter - 24 * 60 * 60 * 1000
      );
      const meanPrice = mean(days.map((d) => getPieValue(d)));
      const dayMean = [todayCounter, meanPrice];
      lastWeekPerDay.push(dayMean);
      todayCounter -= 24 * 60 * 60 * 1000;
    }

    return lastWeekPerDay.reverse();
  };

  const lastWeekPrices = markeCapMeanLastWeek();

  const lastWeekMeanNav = () => {
    const lastWeek = underlyingData.filter((d) => getNavDate(d) >= weekAgo);
    let lastWeekPerDay = [];
    let todayCounter = Date.now();
    for (let i = 0; i < 7; i++) {
      const days = lastWeek.filter(
        (d) =>
          getNavDate(d) <= todayCounter &&
          getNavDate(d) >= todayCounter - 24 * 60 * 60 * 1000
      );
      const meanPrice = mean(days.map((d) => d.nav));
      const dayMean = [todayCounter, meanPrice];
      lastWeekPerDay.push(dayMean);
      todayCounter -= 24 * 60 * 60 * 1000;
    }
    return lastWeekPerDay.reverse();
  };

  const lastWeekMeanNavData = lastWeekMeanNav();

  const [mcapPrice, setMcapPrice] = useState(
    getPieValue(lastWeekPrices[lastWeekPrices.length - 1])
  );
  const [mcapDate, setMcapDate] = useState(
    timeFormat(getDate(lastWeekPrices[lastWeekPrices.length - 1]))
  );

  const [navPrice, setNavPrice] = useState(
    getPieValue(lastWeekMeanNavData[lastWeekMeanNavData.length - 1])
  );

  const [navDate, setNavDate] = useState(
    getDate(lastWeekMeanNavData[lastWeekMeanNavData.length - 1])
  );

  return (
    <section className="mb-10 gap-y-4 md:gap-4 grid auto-rows-fr grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <div className="flex flex-col">
        <h4 className="font-bold text-white mb-2">{content.subcharts.nav}</h4>
        <div className="w-full flex flex-1 flex-col border border-deeper_purple rounded-lg py-2 px-4">
          <div className="w-full flex flex-wrap justify-between items-center">
            <p className="text-gradient text-2xl">
              {priceFormatter.format(navPrice)}
            </p>
            <p className="text-sm text-deep_purple">{timeFormat(navDate)}</p>
          </div>
          <div className="w-full flex flex-col flex-1 mb-2">
            <ParentSize>
              {({ width, height }) => (
                <NavChart
                  width={width}
                  height={height}
                  lastWeekMeanNavData={lastWeekMeanNavData}
                  setNavPrice={setNavPrice}
                  setNavDate={setNavDate}
                />
              )}
            </ParentSize>
          </div>
        </div>
      </div>
      <div className="flex flex-col order-none md:order-last lg:order-none">
        <h4 className="font-bold text-white mb-2">
          {content.subcharts.marketcap}
        </h4>
        <div className="flex flex-col flex-1 border border-deeper_purple rounded-lg py-2 px-4">
          <div className="flex flex-wrap justify-between items-center">
            <p className="flex text-gradient text-2xl">
              {priceFormatter.format(mcapPrice)}
            </p>
            <p className="flex text-sm text-deep_purple">{mcapDate}</p>
          </div>
          <div className="w-full flex flex-col flex-1 mb-2">
            <ParentSize>
              {({ width, height }) => (
                <MarketCapChart
                  width={width}
                  height={height}
                  setMcapPrice={setMcapPrice}
                  setMcapDate={setMcapDate}
                  marketcapData={lastWeekPrices}
                />
              )}
            </ParentSize>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <h4 className="font-bold text-white mb-2">
          {content.subcharts.inception}
        </h4>
        <div className="h-24 flex border border-deeper_purple rounded-lg p-4 justify-center items-center mb-4">
          <p className="text-gradient text-4xl mr-3">+ {inceptionPerc}%</p>
          <Image src={inceptionPerc >= 0 ? arrowGreen : arrowRed} alt="Arrow" />
        </div>
        <h4 className="font-bold text-white mb-2">
          {content.subcharts.sentiment.title}
        </h4>
        <SentimentCheck />
      </div>
    </section>
  );
};

export default SubCharts;
