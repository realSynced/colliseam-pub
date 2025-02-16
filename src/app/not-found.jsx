import Image from "next/image";
import Link from "next/link";
import image404 from "../../public/images/error-404.webp";

export default function Error() {
  return (
    <div className={`font-bold h-screen w-full flex flex-col items-center justify-center`}>
      <Image src={image404} width={350} height={"auto"} />
      <div className="text-center w-1/3 flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold text-white mt-5">Page Not Found</h1>
        <p className="my-5 text-lg font-semibold w-3/5 text-white/75">The page you were looking for was not found.</p>
        <Link
          href="/"
          className="bg-primary px-4 py-2 rounded-full font-bold text-sm text-white hover:bg-primaryHover"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
