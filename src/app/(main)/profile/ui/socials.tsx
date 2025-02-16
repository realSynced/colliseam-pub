import Link from "next/link";

export default function SideNav() {
  return (
    <div className={`bg-neutral-200 font-bold text-center p-4 rounded-2xl border`}>
      <div className="flex flex-col rounded-2xl p-4">
        <div>
          <h1 className="text-4xl text-neutral-400">SOCIALS</h1>
        </div>
      </div>
      <div className="flex flex-col space-y-6 mt-2 rounded-2xl p-4 bg-slate-100/50">
        <div>
          <Link href="" className="transition-all duration-100 ease-in-out hover:text-neutral-500 hover:scale-110">
            Social 1
          </Link>
        </div>
        <div>
          <Link href="" className="transition-all duration-100 ease-in-out hover:text-neutral-500 hover:scale-110">
            Social 1
          </Link>
        </div>
        <div>
          <Link href="" className="transition-all duration-100 ease-in-out hover:text-neutral-500 hover:scale-110">
            Social 1
          </Link>
        </div>
        <div>
          <Link href="" className="transition-all duration-100 ease-in-out hover:text-neutral-500 hover:scale-110">
            Social 1
          </Link>
        </div>
      </div>
    </div>
  );
}
