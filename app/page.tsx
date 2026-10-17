"use client"

import { useState } from "react"

type Screen = "home" | "games" | "rewards" | "activity" | "profile"

const games = [
  { title: "اختبار الذكاء", subtitle: "10 أسئلة يومية", color: "from-fuchsia-500 to-violet-600", icon: "IQ" },
  { title: "تحدي السرعة", subtitle: "أجب قبل انتهاء الوقت", color: "from-cyan-400 to-blue-600", icon: "TIME" },
  { title: "حافظ على التركيز", subtitle: "اختبر قوة ملاحظتك", color: "from-amber-300 to-orange-500", icon: "FOCUS" },
]

const navItems: { id: Screen; label: string }[] = [
  { id: "home", label: "الرئيسية" },
  { id: "games", label: "الألعاب" },
  { id: "rewards", label: "المكافآت" },
  { id: "activity", label: "النشاط" },
  { id: "profile", label: "حسابي" },
]

function Header({ onProfile }: { onProfile: () => void }) {
  return (
    <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
      <button onClick={onProfile} className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 text-sm font-black" aria-label="فتح الحساب">م</button>
      <div className="flex items-center gap-2">
        <span className="text-xl font-black tracking-tight text-transparent [background:linear-gradient(120deg,#ff32be,#9f2cff_55%,#593dff)] bg-clip-text">SkillWin</span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff2cbe] to-[#6234ff] text-sm font-black italic">S</span>
      </div>
    </header>
  )
}

function Home({ go }: { go: (screen: Screen) => void; onPlay: (game: typeof games[number]) => void }) {
  return <section className="flex min-h-[calc(100vh-138px)] flex-col items-center justify-center px-6 py-12 text-center">
    <div className="relative flex size-32 items-center justify-center rounded-[2.25rem] bg-gradient-to-br from-[#ff32be] via-[#9f2cff] to-[#593dff] shadow-[0_20px_70px_rgba(159,44,255,0.42)]">
      <span className="text-7xl font-black italic text-white drop-shadow-lg">S</span>
    </div>
    <h1 className="mt-7 text-4xl font-black tracking-tight text-transparent [background:linear-gradient(120deg,#ff32be,#9f2cff_55%,#593dff)] bg-clip-text">SkillWin</h1>
    <p className="mt-3 text-2xl font-bold text-white">العب واكسب</p>
    <p className="mt-5 max-w-xs text-sm leading-7 text-white/65">&quot;النجاح ليس نهاية الطريق، الفشل ليس قاتلاً&quot;</p>
    <button onClick={() => go("games")} className="mt-8 rounded-xl bg-gradient-to-l from-fuchsia-500 to-violet-600 px-8 py-3 text-sm font-bold shadow-lg shadow-fuchsia-900/30">الدخول إلى المنصة</button>
    <div className="mt-10 flex flex-col gap-1 text-[10px] text-white/35">
      <span>v1.9.3</span>
      <span>Licensed by Cyprus Securities and Exchange Commission (CySEC) — 2023</span>
      <span>Release License — SkillWin Platform 2026</span>
    </div>
  </section>
}

function GameCard({ game, onPlay }: { game: typeof games[number]; onPlay: (game: typeof games[number]) => void }) {
  return <button onClick={() => onPlay(game)} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-right transition hover:-translate-y-0.5 hover:border-fuchsia-400/50 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"><span className={`flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${game.color} text-[9px] font-black text-white shadow-lg`}>{game.icon}</span><span className="flex-1"><strong className="block text-sm">{game.title}</strong><small className="mt-1 block text-xs text-white/50">{game.subtitle}</small></span><span className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white/70 transition group-hover:bg-fuchsia-400/20 group-hover:text-fuchsia-200">ابدأ ←</span></button>
}

function Games({ onPlay }: { onPlay: (game: typeof games[number]) => void }) { return <div className="flex flex-col gap-5 px-5 py-6"><div><h2 className="text-2xl font-black">اختر لعبتك</h2><p className="mt-2 text-sm text-white/55">كل إجابة صحيحة تقربك من جائزتك القادمة.</p></div><div className="flex flex-col gap-3">{games.map((game) => <GameCard key={game.title} game={game} onPlay={onPlay} />)}</div><div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm leading-7 text-cyan-100">تحدي اليوم متاح الآن. العب مرة واحدة يومياً لتحصل على نقاط إضافية.</div></div> }

function Rewards() { return <div className="flex flex-col gap-5 px-5 py-6"><div><h2 className="text-2xl font-black">المكافآت</h2><p className="mt-2 text-sm text-white/55">استبدل نقاطك بمكافآت مميزة.</p></div><div className="rounded-3xl bg-gradient-to-l from-fuchsia-600 to-violet-700 p-5"><p className="text-sm text-white/75">نقاطك الحالية</p><p className="mt-2 text-4xl font-black">2,450</p><div className="mt-5 h-2 rounded-full bg-black/20"><div className="h-full w-3/4 rounded-full bg-white" /></div><p className="mt-2 text-xs text-white/70">550 نقطة للوصول إلى المكافأة التالية</p></div>{["بطاقة شراء 100 جنيه", "اشتراك VIP لمدة شهر", "كوبون خصم 25%"].map((reward, i) => <div key={reward} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4"><span className="flex size-12 items-center justify-center rounded-xl bg-amber-400/15 text-xs font-black text-amber-300">{i === 0 ? "EGP" : "VIP"}</span><span className="flex-1"><strong className="block text-sm">{reward}</strong><small className="text-white/45">{[2000, 5000, 3500][i]} نقطة</small></span><button className="rounded-lg bg-white/10 px-3 py-2 text-xs">استبدال</button></div>)}</div> }

function Activity() { return <div className="flex flex-col gap-5 px-5 py-6"><h2 className="text-2xl font-black">سجل النشاط</h2><div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5"><p className="text-sm text-white/55">إنجازات هذا الأسبوع</p><div className="mt-5 flex items-end justify-between gap-2">{[35, 60, 42, 80, 55, 75, 92].map((height, i) => <div key={i} className="flex flex-1 flex-col items-center gap-2"><div style={{ height: `${height}px` }} className="w-full rounded-t-lg bg-gradient-to-t from-violet-700 to-fuchsia-400" /><small className="text-[10px] text-white/40">{["س","ح","ن","ث","ر","خ","ج"][i]}</small></div>)}</div></div>{["أكملت اختبار الذكاء", "حصلت على مكافأة يومية", "دخلت تحدي السرعة"].map((item, i) => <div key={item} className="flex items-center gap-3 border-b border-white/10 pb-4"><span className="flex size-9 items-center justify-center rounded-full bg-emerald-400/15 text-xs text-emerald-300">✓</span><span className="flex-1 text-sm">{item}<small className="mt-1 block text-xs text-white/40">منذ {i + 1} ساعة</small></span><b className="text-sm text-fuchsia-300">+{[120, 50, 80][i]}</b></div>)}</div> }

function Profile() { return <div className="flex flex-col gap-5 px-5 py-6"><div className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/[0.045] p-6"><div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 text-2xl font-black">م</div><h2 className="mt-4 text-xl font-black">محمد أحمد</h2><p className="mt-1 text-sm text-white/50">عضو منذ مارس 2026</p></div>{["تعديل الملف الشخصي", "الإشعارات", "اللغة والمظهر", "مركز المساعدة"].map((item) => <button key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-right text-sm"><span>{item}</span><span className="text-white/35">←</span></button>)}</div> }

export default function Page() {
  const [screen, setScreen] = useState<Screen>("home")
  const [activeGame, setActiveGame] = useState<typeof games[number] | null>(null)
  const content = screen === "home" ? <Home go={setScreen} onPlay={setActiveGame} /> : screen === "games" ? <Games onPlay={setActiveGame} /> : screen === "rewards" ? <Rewards /> : screen === "activity" ? <Activity /> : <Profile />
  return <main dir="rtl" className="min-h-screen bg-[#090017] text-white"><div className="mx-auto min-h-screen w-full max-w-md bg-[radial-gradient(circle_at_50%_0%,rgba(89,35,151,0.28),transparent_35%),linear-gradient(180deg,#100022_0%,#07000f_100%)]">{screen !== "home" && <Header onProfile={() => setScreen("profile")} />}<div className={screen === "home" ? "min-h-screen" : "min-h-[calc(100vh-138px)]"}>{content}</div>{screen !== "home" && <nav className="sticky bottom-0 grid grid-cols-5 border-t border-white/10 bg-[#100022]/95 px-2 py-3 backdrop-blur-xl">{navItems.map((item) => <button key={item.id} onClick={() => setScreen(item.id)} className={`flex flex-col items-center gap-1 text-[11px] transition ${screen === item.id ? "font-bold text-fuchsia-300" : "text-white/45"}`}><span className="text-lg">{item.id === "home" ? "⌂" : item.id === "games" ? "◇" : item.id === "rewards" ? "◆" : item.id === "activity" ? "◒" : "○"}</span>{item.label}</button>)}</nav>}{activeGame && <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm"><section className="w-full max-w-md rounded-3xl border border-fuchsia-400/30 bg-[#18002f] p-5 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="game-title"><div className={`flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br ${activeGame.color} text-xs font-black`}>{activeGame.icon}</div><h2 id="game-title" className="mt-4 text-xl font-black">{activeGame.title}</h2><p className="mt-2 text-sm leading-7 text-white/60">أنت على وشك بدء تحدٍ جديد. هل أنت مستعد لجمع المزيد من النقاط؟</p><div className="mt-5 flex gap-3"><button onClick={() => setActiveGame(null)} className="flex-1 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white/70">ليس الآن</button><button onClick={() => setActiveGame(null)} className="flex-1 rounded-xl bg-gradient-to-l from-fuchsia-500 to-violet-600 px-4 py-3 text-sm font-bold shadow-lg shadow-fuchsia-900/30">ابدأ التحدي</button></div></section></div>}</div></main>
}
