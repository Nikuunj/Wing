import { feature } from "@/utils/data"
import CardFeature from "./CardFeature"

function Feature() {
  const render = feature.map((val, idx) => <CardFeature key={idx + val.text} text={val.text} title={val.title} />)
  return (
    <div className="flex flex-col justify-center items-center gap-17">
      <div className="text-center space-y-5">
        <h2 className="text-4xl font-bold">Features</h2>
        <p className="text-zinc-400 text-lg">Discover the features that make every tip decentralized and trustless.</p>
      </div>
      <div className="flex flex-wrap gap-14 justify-center px-3 max-w-6xl">
        {render}
      </div>
    </div>
  )
}

export default Feature
