"use client";

import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b border-blue-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-600">CareerSetu AI</span>
            </div>
            <Link
              href="/interview"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Try Interview
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Video */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              CareerSetu AI Demo
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Byte Battle Hackathon 2K26 - Your smart bridge to a successful career
            </p>
          </div>

          {/* Video Embed Placeholder */}
          <div className="mt-10">
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-lg">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600">
                    <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Watch Demo</h3>
                  <p className="mt-2 text-sm text-gray-600">YouTube video placeholder</p>
                  <p className="mt-1 text-xs text-gray-500">Add your demo video link here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            <div className="rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-blue-600">5</div>
              <div className="mt-2 text-sm font-medium text-gray-900">Questions</div>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-blue-600">3</div>
              <div className="mt-2 text-sm font-medium text-gray-900">Languages</div>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-blue-600">Instant</div>
              <div className="mt-2 text-sm font-medium text-gray-900">AI Feedback</div>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-blue-600">Free</div>
              <div className="mt-2 text-sm font-medium text-gray-900">To Use</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white shadow-xl sm:p-12">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to Practice?</h2>
            <p className="mt-4 text-lg text-blue-100">
              Start your mock interview journey with AI-powered feedback
            </p>
            <Link
              href="/interview"
              className="mt-8 inline-flex rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition hover:scale-105 hover:shadow-xl"
            >
              Try It Now
            </Link>
          </div>
        </div>
      </section>

      {/* Team & Project Info */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Team Section */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Meet the Team</h3>
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h4 className="font-semibold text-gray-900">Pragati Gaikwad</h4>
                  <p className="text-sm text-gray-600">Full-Stack Developer & AI Integration</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h4 className="font-semibold text-gray-900">Apeksha Gadade</h4>
                  <p className="text-sm text-gray-600">UI/UX Designer & Frontend Developer</p>
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Project Details</h3>
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h4 className="font-semibold text-gray-900">CareerSetu AI</h4>
                  <p className="text-sm text-gray-600">Byte Battle Hackathon 2K26</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h4 className="font-semibold text-gray-900">Mission</h4>
                  <p className="text-sm text-gray-600">Empowering Indian college students with AI-powered interview practice</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">Built With</h3>
            <p className="mt-2 text-gray-600">Modern tech stack for optimal performance</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <div className="text-lg font-bold text-gray-900">Next.js</div>
              <div className="text-xs text-gray-600">Framework</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <div className="text-lg font-bold text-gray-900">Groq AI</div>
              <div className="text-xs text-gray-600">LLM API</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <div className="text-lg font-bold text-gray-900">Web Speech</div>
              <div className="text-xs text-gray-600">Voice API</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <div className="text-lg font-bold text-gray-900">Tailwind</div>
              <div className="text-xs text-gray-600">Styling</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <div className="text-lg font-bold text-gray-900">TypeScript</div>
              <div className="text-xs text-gray-600">Type Safety</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <div className="text-lg font-bold text-gray-900">Vercel</div>
              <div className="text-xs text-gray-600">Deployment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © 2024 CareerSetu AI - Byte Battle Hackathon 2K26
            </p>
            <div className="mt-4 flex justify-center gap-6">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/interview" className="text-sm text-gray-600 hover:text-gray-900">
                Start Interview
              </Link>
              <Link href="/chat" className="text-sm text-gray-600 hover:text-gray-900">
                Practice
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
