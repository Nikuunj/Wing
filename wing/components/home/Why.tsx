import { why } from "@/utils/data"
import Card from "./CardWhy"

function Why() {
  const render = why.map((val, idx) => <Card key={idx} text={val.text} Logo={val.logo} title={val.title} />)
  return (
    <div className="flex flex-col justify-center items-center gap-17">
      <div className="text-center space-y-5">
        <h2 className="text-4xl font-bold">Why Wing ?</h2>
        <p className="text-zinc-400 text-lg">Built for creators who value freedom and direct support</p>
      </div>
      <div className="flex flex-wrap gap-14 justify-center px-3">
        {render}
      </div>
    </div>
  )
}

export default Why
