import { LucideProps } from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

interface CardProps {
  title: string
  text: string
  Logo: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}

function Card({ title, text, Logo }: CardProps) {
  return (
    <div className="flex flex-col justify-center rounded-3xl items-center max-w-72 border-dashed border px-8 py-16 space-y-7 border-zinc-800 relative">
      <div className="p-3 rounded-lg bg-white/10 self-start drop-shadow-[0px_0px_5px] drop-shadow-blue-600">
        <Logo className="text-gray-400" />
      </div>
      <div className="space-y-5">
        <p className="text-xl font-semibold">
          {title}
        </p>
        <p className="text-zinc-400">
          {text}
        </p>
      </div>
      <div>
        <div className="absolute top-0 left-0 w-10 h-20 border-t-2 border-l-2 rounded-tl-3xl border-zinc-400/85"></div>

        <div className="absolute bottom-0 left-0 w-20 h-10 border-l-2 border-b-2 rounded-bl-3xl border-zinc-400/85"></div>
        <div className="absolute bottom-0 left-0 w-20 h-10 border-r-2 border-t-2 rounded-tr-3xl border-zinc-400/85"></div>

        <div className="absolute top-0 right-0 w-20 h-10 border-r-2 border-t-2 rounded-tr-3xl border-zinc-400/85"></div>
        <div className="absolute top-0 right-0 w-20 h-10 border-l-2 border-b-2 rounded-bl-3xl border-zinc-400/85"></div>

        <div className="absolute bottom-0 right-0 w-10 h-20 border-r-2 border-b-2 rounded-br-3xl border-zinc-500/85"></div>
      </div>
    </div>
  )
}

export default Card
