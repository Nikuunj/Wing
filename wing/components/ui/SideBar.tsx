import { navbarLink } from "@/utils/data";
import { ArrowBigLeft, ChevronRight, LucideProps } from "lucide-react";
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import BorderDiv from "./BorderDiv";

function SideBar({ open, closeOpen }: { open: boolean, closeOpen: () => void }) {
  const render = navbarLink.map((val, idx) =>
    <LinkComponent key={idx + val.title} text={val.title} to={val.to} closeOpen={closeOpen} Icon={val.icon} />
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed top-0 right-0 z-20 min-h-screen w-64 bg-zinc-900  flex flex-col pt-20 ps-7 pe-3 space-y-5"
        >
          {render}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function LinkComponent({ text, to, closeOpen, Icon }: {
  text: string, to: string, closeOpen: () => void, Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}) {
  return (
    <BorderDiv borderSize={"w-1 h-1"} borderWidth={1}>
      <div onClick={closeOpen} className="cursor-pointer bg-zinc-800/70">
        <Link href={to}
          className="flex gap-3  p-2  rounded-lg  transition-all 
        duration-200 justify-between items-center pe-3 hover:pe-2"
        >
          <span className="flex gap-3 items-center ">
            <Icon className="w-4.5 h-4.5 text-purple-300 drop-shadow-[0px_0px_5px] drop-shadow-blue-400" />{text}
          </span>
          <ChevronRight className="w-4.5 h-4.5 text-zinc-400" />
        </Link>
      </div>
    </BorderDiv>
  )
}
export default SideBar
