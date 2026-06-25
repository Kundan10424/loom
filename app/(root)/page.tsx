import { Button } from "@/components/ui/button";
import { SquareArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="z-20 flex flex-col items-center min-h-screen justify-start py-2 -mt-20">
      <div className="flex flex-col jusify-center items-center mt-20">
        <Image src={"./hero.svg"} alt="Hero" width={250} height={250} />
        <h1 className="z-20 text-6xl mt-5 font-extrabold text-center bg-clip-text text-transparent bg-linear-to-r from-violet-500 via-indigo-500 to-blue-500 dark:from-violet-600 dark:via-indigo-600 dark:to-blue-600 tracking-tight leading-[1.3]">
          Code With Intelligence
        </h1>

        <p className="mt-2 text-lg text-center text-zinc-500 dark:text-zinc-400 px-5 py-5 max-w-2xl">
          Say goodbye to tedious coding tasks and hello to seamless
          productivity. With Loom, you can generate code snippets, get instant
          code suggestions, and automate repetitive coding tasks, all within
          your favorite code editor. Whether you&apos;re a beginner or an
          experienced developer, Loom is here to help you code smarter, faster,
          and more efficiently. Try Loom today and unlock your coding potential!
        </p>

        <Link href="/dashboard">
          <Button variant={"brand"} className="mb-4 cursor-pointer" size={"lg"}>
            Get Started
            <SquareArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
