function CardFeature({ text, title }: { text: string, title: string }) {
  return (
    <div className="flex flex-col justify-center rounded-3xl items-center max-w-72 border-dashed border px-8 py-16 space-y-7 border-zinc-800 relative">
      <div className="space-y-5">
        <p className="text-xl font-semibold">
          {title}
        </p>
        <p className="text-zinc-400">
          {text}
        </p>
      </div>
      <div>
        <div className="absolute bottom-0 right-0 w-20 h-10 rounded-br-3xl border-r-2 border-b-2 border-zinc-400/85" />
        <div className="absolute bottom-0 left-0 w-20 h-10 rounded-bl-3xl border-l-2 border-b-2 border-zinc-400/85 " />
        <div className="absolute top-0 right-0 w-20 h-10 rounded-tr-3xl border-r-2 border-t-2 border-zinc-400/85" />
        <div className="absolute top-0 left-0 w-20 h-10 rounded-tl-3xl border-l-2 border-t-2 border-zinc-400/85" />
        <div className="absolute top-0 right-7/15 w-5 border-t-2 rounded-b-full h-3 bg-transparent border-amber-400 shadow-[0px_5px_20px] shadow-amber-300 " />
      </div>

    </div>
  )
}

export default CardFeature
