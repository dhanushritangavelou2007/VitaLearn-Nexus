function HeroSection() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 py-20 md:flex-row">

        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2">

          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2">
            <span className="text-sm font-semibold text-blue-700">
              🩺 AI-Powered School Health Platform
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-slate-900 md:text-6xl">
            Smarter Student Health,
            <br />
            <span className="text-blue-600">
              Safer Schools.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">
            VitaLearn Nexus is an AI-powered Digital Student Health Passport
            that enables teachers, parents, doctors, parents, students and
            schools to collaborate through secure health records, symptom
            tracking, AI-assisted health summaries and centralized student
            healthcare management.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">

            <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              Get Started
            </button>

            <button className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100">
              ▶ Watch Demo
            </button>

          </div>

          {/* Statistics */}
          <div className="mt-12 flex flex-wrap gap-8">

            <div>
              <h2 className="text-3xl font-bold text-blue-600">500+</h2>
              <p className="text-slate-600">Students</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-blue-600">25+</h2>
              <p className="text-slate-600">Schools</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-blue-600">1000+</h2>
              <p className="text-slate-600">Health Records</p>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="mt-16 flex w-full justify-center md:mt-0 md:w-1/2">

          <div className="rounded-3xl bg-white p-8 shadow-2xl">

            <div className="flex h-96 w-80 items-center justify-center rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50">

              <div className="text-center">

                <div className="text-7xl">
                  🏥
                </div>

                <h2 className="mt-4 text-2xl font-bold text-slate-800">
                  Digital Student
                  <br />
                  Health Passport
                </h2>

                <p className="mt-3 text-slate-500">
                  AI-powered Healthcare
                  <br />
                  for Schools
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default HeroSection;