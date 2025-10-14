function CardHow({ title, text, idx }: { title: string, text: string, idx: number }) {
  return (
    <div className="flex flex-col text-start justify-center  overflow-hidden max-w-72 border ps-16 pe-9 py-24 border-zinc-800 relative">
      <div className="space-y-5">
        <h2 className="text-xl font-semibold text-end">
          {title}
        </h2>
        <p className="text-end text-zinc-400/70">
          {text}
        </p>
      </div>
      <div className="absolute -left-13 text-zinc-800 text-[200px] -z-10 font-semibold ">
        0{idx + 1}
      </div>
      <div>
        <div className="absolute top-0 left-0 w-10 h-20 border-t-2 border-l-2 border-zinc-400/85" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-zinc-400/85" />
        <div className="absolute bottom-0 left-0 w-10 h-13 border-b-2 border-l-2 border-zinc-400/85" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-zinc-400/85" />
      </div>

    </div>
  )
}

export default CardHow
