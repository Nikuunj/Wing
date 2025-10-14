import { howitwork } from "@/utils/data";
import CardHow from "./CardHow";

function HowItWoork() {
  const render = howitwork.map((val, idx) => <CardHow key={idx + val.text} text={val.text} title={val.title} idx={idx} />);
  return (
    <div className="flex flex-col justify-center items-center gap-17">
      <div className="text-center space-y-5">
        <h2 className="text-4xl font-bold">How It works ?</h2>
        <p className="text-zinc-400 text-lg">Three simple steps to support creators</p>
      </div>
      <div className="flex flex-wrap gap-14 justify-center px-3">
        {render}
      </div>
    </div>
  )
}

export default HowItWoork
