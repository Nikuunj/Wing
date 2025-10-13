import { Meteors } from "@/components/ui/meteors";
import Image from "next/image";
import logo from "@/public/logo.svg"

function Hero() {
  return (
    <div className="w-full">
      <Meteors number={15} />
      <div className=" min-h-screen flex justify-center items-center">
        <p className=" text-5xl/13 sm:text-7xl/18 md:text-8xl/27 lg:text-9xl/33 w-3/4 sm:w-2/3 font-bold text-center text-balance capitalize">

          Fund give you {' '}
          <span className="inline-block -space-x-4 sm:-space-x-6 md:-space-x-8 lg:-space-x-10">
            <span className="z-10">wings</span> <Image src={logo} className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-13 lg:h-13 lg:top-5 md:top-2 relative md:right-1 -z-10 inline-block align-top" alt={'logo'}></Image>
          </span>
        </p>
      </div>
    </div>
  )
}

export default Hero
