
import Link from "next/link";

export const metadata = {
  title: "404 - KiKi",
  description:
    "Seems you've naviagted to the wrong page. Please click the button to head back to the site.",
};

export default function NotFound() {
  return (
    <div
      className="h-screen w-screen flex items-center justify-center"
      style={{
        backgroundImage: "url(/blue-bg.jpg)",
        objectFit: "cover"
      }}
    >
      <div className="flex flex-col items-center text-center px-4">
        <h1 className="text-[#233E97] text-[50px] font-bold mb-2">404</h1>
        <p className="text-[#1c0d0e] text-lg mb-6 font-semibold">
          Oops! The page you&apos;re looking for does not exist.
        </p>
        <Link href={"/dashboard"} className="h-12 bg-[#233E97] w-fit px-5 flex justify-center items-center text-white text-sm rounded-lg cursor-pointer">Back to Home</Link>
        <span className="my-10 text-sm">
          Having trouble? Contact our <br />{" "}
          <Link href={"#"} className="text-[#233E97] underline">
            help center
          </Link>
        </span>
      </div>
    </div>
  );
}
