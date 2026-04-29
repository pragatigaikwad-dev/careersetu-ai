import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-blue-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            CS
          </span>
          <span className="text-lg font-semibold tracking-tight text-blue-900">
            CareerSetu AI
          </span>
        </Link>
        <div className="flex w-full items-center gap-4 text-sm font-medium text-blue-700 sm:w-auto sm:gap-5">
          <Link
            href="/interview"
            className="transition duration-200 hover:-translate-y-0.5 hover:text-blue-500"
          >
            Interview
          </Link>
          <Link
            href="/chat"
            className="transition duration-200 hover:-translate-y-0.5 hover:text-blue-500"
          >
            Chat
          </Link>
          <Link
            href="/results"
            className="transition duration-200 hover:-translate-y-0.5 hover:text-blue-500"
          >
            Results
          </Link>
          <Link
            href="/demo"
            className="rounded-lg bg-purple-100 px-3 py-1 text-purple-700 transition duration-200 hover:bg-purple-200 hover:text-purple-800"
          >
            Demo
          </Link>
        </div>
      </nav>
    </header>
  );
}
