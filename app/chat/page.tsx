"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

type Setup = {
  role: string;
  language: string;
};

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type SpeechRecognitionEventLike = Event & {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const kickoffMessage = "Start the mock interview now. Ask your first question.";

export default function ChatPage() {
  const router = useRouter();
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const setup = useMemo<Setup | null>(() => {
    if (!hydrated) {
      return null;
    }
    const rawSetup = localStorage.getItem("careersetu.setup");
    return rawSetup ? (JSON.parse(rawSetup) as Setup) : null;
  }, [hydrated]);

  const resumeContext = useMemo<string | null>(() => {
    if (!hydrated) {
      return null;
    }
    const rawResume = localStorage.getItem("careersetu.resume");
    return rawResume || null;
  }, [hydrated]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const hasStarted = useMemo(
    () => messages.some((message) => message.role === "assistant"),
    [messages],
  );
  const aiQuestionCount = useMemo(
    () =>
      Math.min(
        5,
        messages.filter(
          (message) =>
            message.role === "assistant" &&
            !message.content.toUpperCase().includes("INTERVIEW_COMPLETE") &&
            message.content.trim().length > 0,
        ).length,
      ),
    [messages],
  );
  const progressPercent = Math.min(100, (aiQuestionCount / 5) * 100);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const maybeWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition =
      maybeWindow.SpeechRecognition ?? maybeWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new Recognition();
    recognition.lang = setup?.language === "Hindi" ? "hi-IN" : setup?.language === "Marathi" ? "mr-IN" : "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();
      if (transcript) {
        setCurrentAnswer(transcript);
      }
    };
    recognition.onerror = () => {
      setError("Voice input failed. Please try again or type your answer.");
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setSpeechSupported(true);

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [hydrated, setup?.language]);

  useEffect(() => {
    if (!hydrated || !setup || hasStarted) {
      return;
    }
    const startInterview = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch("/api/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: setup.role,
            language: setup.language,
            messages: [{ role: "user", content: kickoffMessage }],
            ...(resumeContext && { resumeContext }),
          }),
        });

        const data = (await response.json()) as { response?: string; error?: string };
        if (!response.ok || !data.response) {
          throw new Error(data.error ?? "Failed to get first question.");
        }

        const nextMessages: ChatMessage[] = [{ role: "assistant", content: data.response }];
        setMessages(nextMessages);
        localStorage.setItem("careersetu.chat", JSON.stringify(nextMessages));
      } catch (requestError) {
        setError(
          requestError instanceof Error ? requestError.message : "Unable to start interview.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void startInterview();
  }, [hasStarted, hydrated, setup]);

  useEffect(() => {
    if (!scrollerRef.current) {
      return;
    }
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messages, isLoading]);

  const submitAnswer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!setup || !currentAnswer.trim() || isLoading) {
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: currentAnswer.trim() };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setCurrentAnswer("");
    setIsLoading(true);
    setError("");
    localStorage.setItem("careersetu.chat", JSON.stringify(nextMessages));

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: setup.role,
          language: setup.language,
          messages: [
            { role: "user", content: kickoffMessage },
            ...nextMessages.map((message) => ({
              role: message.role,
              content: message.content,
            })),
          ],
          ...(resumeContext && { resumeContext }),
        }),
      });

      const data = (await response.json()) as { response?: string; error?: string };
      if (!response.ok || !data.response) {
        throw new Error(data.error ?? "Failed to fetch AI response.");
      }

      const aiMessage: ChatMessage = { role: "assistant", content: data.response };
      const updatedMessages = [...nextMessages, aiMessage];

      setMessages(updatedMessages);
      localStorage.setItem("careersetu.chat", JSON.stringify(updatedMessages));

      if (data.response.toUpperCase().includes("INTERVIEW_COMPLETE")) {
        const scoreMatch = data.response.match(/(\d+(?:\.\d+)?)\s*\/\s*10/i);
        const parsedScore = scoreMatch ? Math.round(Number(scoreMatch[1])) : 0;
        localStorage.setItem(
          "careersetu.results",
          JSON.stringify({
            score: parsedScore,
            strengths: ["See final feedback below."],
            weaknesses: ["See final feedback below."],
            tips: ["See final feedback below."],
            finalFeedback: data.response,
          }),
        );
        router.push("/results");
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to continue interview.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current || isLoading) {
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    setError("");
    setIsListening(true);
    recognitionRef.current.start();
  };

  if (!hydrated) {
    return (
      <section className="mx-auto w-full max-w-5xl px-3 py-6 sm:px-6 sm:py-8">
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Loading interview...</p>
        </div>
      </section>
    );
  }

  if (!setup) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-lg shadow-blue-100/50">
          <h1 className="text-2xl font-bold text-blue-950">No Interview Setup Found</h1>
          <p className="mt-3 text-slate-600">
            Please select role and language before starting the chat.
          </p>
          <Link
            href="/interview"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-blue-700"
          >
            Go to Interview Setup
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-3 py-6 sm:px-6 sm:py-8 animate-fade-in">
      <div className="mb-5 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800">
          Role: {setup.role}
        </span>
        <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800">
          Language: {setup.language}
        </span>
      </div>

      <div className="mb-4 rounded-xl border border-blue-100 bg-white p-3 shadow-sm">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-semibold text-blue-900">
            Question {Math.max(aiQuestionCount, 1)} of 5
          </span>
          <span className="text-slate-600">{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2 rounded-full bg-blue-100">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${Math.max(progressPercent, 6)}%` }}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-lg shadow-blue-100/50">
        <div className="border-b border-blue-100 bg-blue-600 px-5 py-4 text-white">
          <h1 className="text-lg font-semibold">Mock Interview Chat</h1>
          <p className="text-sm text-blue-100">WhatsApp style live AI interview</p>
        </div>

        <div
          ref={scrollerRef}
          className="h-[56vh] space-y-3 overflow-y-auto bg-blue-50/60 p-4 sm:p-5"
        >
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}-${message.content.slice(0, 12)}`}
              className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm sm:max-w-[75%] ${
                  message.role === "assistant"
                    ? "rounded-bl-sm bg-blue-600 text-white"
                    : "rounded-br-sm border border-slate-200 bg-white text-slate-800"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-sm bg-blue-600 px-4 py-2.5 text-sm text-white shadow-sm">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={submitAnswer} className="space-y-3 border-t border-blue-100 p-4 sm:p-5">
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex items-end gap-3">
            <textarea
              value={currentAnswer}
              onChange={(event) => setCurrentAnswer(event.target.value)}
              rows={2}
              placeholder="Type your answer..."
              className="min-h-[48px] flex-1 resize-none rounded-xl border border-blue-200 bg-white px-3 py-2 text-slate-800 outline-none ring-blue-200 transition focus:ring-2"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={!speechSupported || isLoading}
              title={speechSupported ? "Voice input" : "Voice input not supported"}
              className={`rounded-xl border px-4 py-2.5 font-semibold transition duration-200 ${
                isListening
                  ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                  : "border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {isListening ? "Stop" : "Mic"}
            </button>
            <button
              type="submit"
              disabled={isLoading || !currentAnswer.trim()}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send
            </button>
          </div>
          {isListening && (
            <p className="text-xs font-medium text-blue-700">Listening... speak now.</p>
          )}
          {!speechSupported && (
            <p className="text-xs text-slate-500">
              Voice input is not supported in this browser. Please type your answer.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
