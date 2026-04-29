"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const fullTagline = "Your smart bridge to a successful career";

const features = [
  {
    title: "AI Mock Interview",
    description:
      "Practice role-specific interview questions with an AI coach designed for campus placements.",
    icon: "AI",
  },
  {
    title: "Multilingual Support",
    description:
      "Interview confidently in English, Hindi, or Marathi based on your comfort and goals.",
    icon: "ML",
  },
  {
    title: "Instant Feedback",
    description:
      "Get quick strengths and improvement points after each interview session.",
    icon: "IF",
  },
  {
    title: "Performance Tracking",
    description:
      "Track progress over time and build consistency before your real interviews.",
    icon: "PT",
  },
];

export default function Home() {
  const [typedTagline, setTypedTagline] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setTypedTagline(fullTagline.slice(0, index));
      if (index >= fullTagline.length) {
        window.clearInterval(interval);
      }
    }, 45);

    return () => window.clearInterval(interval);
  }, [mounted]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 p-8 text-white shadow-2xl shadow-blue-300/40 sm:p-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-up">
            <Image
              src="/careersetu-logo.png"
              alt="CareerSetu AI logo"
              width={620}
              height={310}
              className="mx-auto h-auto w-full max-w-lg rounded-2xl border border-white/30 bg-white/90 p-2 shadow-lg"
              priority
            />
          </div>
          <h1 className="mt-5 animate-fade-up text-4xl font-bold tracking-tight sm:text-6xl">
            CareerSetu AI
          </h1>
          <p
            className="mx-auto mt-5 min-h-8 max-w-2xl animate-fade-up text-base text-blue-100 sm:text-xl"
            style={{ animationDelay: "120ms" }}
          >
            {typedTagline}
            <span className="ml-0.5 inline-block w-2 animate-pulse">|</span>
          </p>
          <Link
            href="/interview"
            className="mt-9 inline-flex animate-fade-up items-center justify-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-blue-50"
            style={{ animationDelay: "220ms" }}
          >
            Start Mock Interview
          </Link>
        </div>
      </div>

      <div className="mt-12 animate-fade-up" style={{ animationDelay: "320ms" }}>
        <h2 className="text-center text-3xl font-bold text-blue-950">Our Features</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600">
          Everything you need to prepare smarter, speak confidently, and improve faster.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="animate-fade-up rounded-2xl border border-blue-100 bg-white p-5 shadow-md shadow-blue-100/40 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ animationDelay: `${420 + index * 90}ms` }}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
                {feature.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-blue-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
