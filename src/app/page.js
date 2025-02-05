
import Link from "next/link";

export default function Home() {
  return (

      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col gap-4">
          <h2 className="text-heading">Click below to login</h2>
          <div className="flex mx-auto">
            <Link href="/login">
              <button className="hover:scale-105 rounded-md ring-2 px-4 py-1 ring-white">Login &rarr;</button>
            </Link>
          </div>
        </div>
      </div>

  );
}
