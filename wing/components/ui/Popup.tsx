function Popup({ text, yesFn, noFn }: { text: string, yesFn: () => void, noFn: () => void }) {
  return (
    <div className="fixed inset-0 h-full w-full flex justify-center items-center bg-zinc-800/90 px-3 sm:px-10 z-50 max-h-screen ">
      <div className="bg-zinc-700/30 p-1 rounded-xl">
        <div className="bg-zinc-800/70 px-10 py-12 min-w-64 space-y-5 rounded-xl">
          <p className="text-center text-lg font-medium">{text}</p>
          <div className="flex justify-center  gap-3">
            <button
              onClick={yesFn}
              className="border px-4 py-1 bg-red-700/50 outline-0 border-red-500 cursor-pointer"
            >
              Yes
            </button>
            <button
              onClick={noFn}
              className="border px-4 bg-green-700/5 border-green-400 cursor-pointer"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup
