function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-between px-6 py-16">
        <div className="max-w-2xl">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            AI-Powered School Health Platform
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight text-slate-900">
            Smarter Student Health,
            <span className="text-blue-600"> Safer Schools.</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            VitaLearn Nexus is an AI-powered Digital Student Health Passport
            that helps schools, parents, teachers and doctors collaborate to
            keep every student healthier and safer.
          </p>

          <div className="mt-10 flex gap-4">
            <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              Get Started
            </button>

            <button className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100">
              Learn More
            </button>
          </div>
        </div>

        <div className="hidden lg:flex h-112.5 w-112.5 items-center justify-center rounded-3xl bg-blue-100 text-center">
          <p className="text-xl font-semibold text-blue-700">
            Healthcare Illustration
            <br />
            (We'll replace this later)
          </p>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;