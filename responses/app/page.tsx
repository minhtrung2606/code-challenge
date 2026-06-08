import Link from "next/link";

const candidate = {
  name: "Nguyen Minh Trung",
  email: "minhtrung2606@gmail.com",
  githubRepo:
    "https://github.com/minhtrung2606/code-challenge/tree/main/responses",
  previewUrl: "https://your-preview-url.vercel.app",
};

const responsePages = [
  {
    title: "Problem 1",
    descriptions: ["Three ways to sum to n", "Response visualization"],
    href: "/utils/sum-to-n",
  },
  {
    title: "Problem 2",
    descriptions: ["Fancy Form", "Response visualization"],
    href: "/swap",
  },
  {
    title: "Problem 3",
    descriptions: ["Messy React", "Review and refactor code"],
    href: "https://github.com/minhtrung2606/code-challenge/tree/main/src/problem3/response.md",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-svh bg-slate-50 text-slate-950">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 sm:py-24">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Take-home assignment responses
            </h1>

            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              This page contains my submitted responses, source code, and live
              preview for the interview take-home assignment.
            </p>
          </div>
        </div>

        <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-slate-500">Candidate</p>
            <h2 className="text-2xl font-semibold">{candidate.name}</h2>
            <p>
              <a
                href={`mailto:${candidate.email}`}
                className="mt-2 text-sm font-medium text-slate-900 underline underline-offset-4 hover:text-slate-600"
              >
                {candidate.email}
              </a>
            </p>
            <p className="text-slate-600 space-x-1 mt-2">
              <span>Apply position:</span>
              <span className="font-bold">Frontend Engineer</span>
            </p>
          </div>

          <div className="grid gap-3 sm:justify-end h-fit">
            <a
              href={candidate.githubRepo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium transition hover:bg-slate-100"
            >
              View GitHub Repository
            </a>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Responses</h2>
            <p className="mt-2 text-slate-600">
              Navigate to each response page below.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {responsePages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex h-full flex-col justify-between gap-8">
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs font-medium">{page.title}</div>
                    <div>
                      {page.descriptions.map((desc, index) => (
                        <div
                          key={desc}
                          className={[
                            "leading-6 text-slate-600",
                            index === 0 ? "text-lg font-bold" : "text-sm",
                            index > 0 ? "mt-3" : "",
                          ].join(" ")}
                        >
                          {desc}
                        </div>
                      ))}
                    </div>
                  </div>

                  <span className="text-sm font-medium text-slate-900 transition group-hover:translate-x-1">
                    View response →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
