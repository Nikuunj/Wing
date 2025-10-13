import Image from "next/image"
import logo from '@/public/logo.svg';

export const Navbar = () => {
  return (
    <div className="border border-zinc-800 py-2.5 px-10  flex justify-between items-center fixed max-w-screen min-w-screen top-0">
      <div className={`h-10 w-10`}>
        <Image
          src={logo}
          alt="logo"
          width={200}
          height={200}
        />
      </div>
      <div className={``}>
        2
      </div>
    </div>
  )
}
