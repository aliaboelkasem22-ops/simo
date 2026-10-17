export default function Page() {
  return (
    <main dir="rtl" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090017] px-6 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(89,35,151,0.24),transparent_36%),linear-gradient(180deg,#100022_0%,#07000f_100%)]" />
      <div className="absolute -right-24 top-1/3 size-80 rounded-full bg-fuchsia-600/10 blur-3xl" />
      <div className="absolute -left-32 bottom-10 size-96 rounded-full bg-violet-800/10 blur-3xl" />

      <section className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-7 flex items-center gap-3">
          <div className="relative flex size-16 items-center justify-center rounded-[1.35rem] bg-gradient-to-br from-[#ff2cbe] via-[#a82aff] to-[#5b36ff] shadow-[0_0_36px_rgba(195,44,255,0.35)]">
            <div className="absolute inset-[3px] rounded-[1.15rem] border border-white/20" />
            <span className="text-3xl font-black italic tracking-tighter">S</span>
          </div>
          <h1 className="text-5xl font-black tracking-[-0.08em] text-transparent [background:linear-gradient(120deg,#ff32be,#9f2cff_55%,#593dff)] bg-clip-text">SkillWin</h1>
        </div>
        <p className="text-2xl font-bold tracking-tight text-white">العب واكسب</p>
        <p className="mt-9 max-w-xs text-lg leading-9 text-white/75">&quot;النجاح ليس نهاية الطريق،<br />الفشل ليس قاتلاً&quot;</p>
        <div className="mt-16 h-px w-28 bg-gradient-to-l from-transparent via-fuchsia-400/50 to-transparent" />
        <p className="mt-7 text-xs font-medium tracking-[0.18em] text-white/45">الإصدار 1.9.3</p>
        <p className="mt-4 text-[11px] leading-6 text-white/35">مرخص من هيئة الأوراق المالية والبورصات القبرصية (CySEC) — 2023</p>
        <p className="mt-2 text-[11px] text-white/35">رخصة الإصدار — منصة SkillWin 2026</p>
      </section>
    </main>
  )
}

