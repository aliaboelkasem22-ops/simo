"use client"

import { useEffect, useState } from "react"
import { ArrowDownLeft, Bell, ChevronLeft, CircleDollarSign, Home, Plus, RefreshCw, ReceiptText, Trophy, User, Wallet } from "lucide-react"

type Tab = "home" | "wallet" | "alerts" | "competitions" | "finance" | "account"

const nav = [
  { id: "account" as Tab, label: "حسابي", icon: User },
  { id: "wallet" as Tab, label: "المحفظة", icon: Wallet },
  { id: "alerts" as Tab, label: "الإشعارات", icon: Bell },
  { id: "competitions" as Tab, label: "المسابقات", icon: Trophy },
  { id: "finance" as Tab, label: "المالية و النسخ", icon: ReceiptText },
  { id: "home" as Tab, label: "الرئيسية", icon: Home },
]

export default function Page() {
  const [intro, setIntro] = useState(true)
  const [tab, setTab] = useState<Tab>("home")
  const [balance, setBalance] = useState(0)
  const [notice, setNotice] = useState("")

  useEffect(() => {
    const timer = window.setTimeout(() => setIntro(false), 1800)
    return () => window.clearTimeout(timer)
  }, [])

  const action = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(""), 2200)
  }

  if (intro) {
    return <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#080809] text-white"><section className="flex min-h-screen w-full max-w-[520px] flex-col items-center justify-center px-8 text-center"><div className="mb-36 flex size-28 flex-col items-center justify-center rounded-full border-[6px] border-[#1483ca] text-[#ff7b13] shadow-[0_0_28px_rgba(20,131,202,.2)]"><span className="text-7xl font-black leading-none">?</span><span className="-mt-1 text-sm font-black tracking-wide text-[#1483ca]">SKILL WIN</span></div><h1 className="text-4xl font-black tracking-tight">SkillWin</h1><p className="mt-3 text-xl text-white/45">العب واكسب</p><p className="mt-16 text-xl text-white/50">&quot;النجاح ليس نهاية الطريق، الفشل ليس قاتلاً&quot;</p><div className="mt-20 flex items-center gap-5"><i className="size-4 rounded-full border-2 border-white/20" /><i className="size-4 rounded-full border-2 border-white/20" /><i className="size-4 rounded-full border-2 border-white/20" /><i className="size-4 rounded-full border-2 border-[#6f602d]" /><i className="size-7 rounded-full bg-[#ffc329] shadow-[0_0_22px_#ffc329]" /></div><p className="mt-14 font-bold text-[#d8ac18]">v1.9.3</p><p className="mt-8 text-xs leading-7 text-white/20">Licensed by Cyprus Securities and Exchange Commission (CySEC) — 2023<br />Release License — SkillWin Platform 2026</p></section></main>
  }

  return <main dir="rtl" className="min-h-screen bg-[#080809] text-white"><div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col bg-[#09090a] pb-24">
    <header className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4"><button aria-label="فتح الحساب" onClick={() => setTab("account")} className="flex size-12 items-center justify-center rounded-2xl bg-[#ee3037] text-2xl font-black shadow-[0_8px_24px_rgba(238,48,55,.22)]">S</button><div className="flex items-center gap-3"><div className="text-right leading-tight"><p className="text-sm text-white/50">مرحباً</p><p className="font-black">محمد</p></div><span className="size-3 rounded-full bg-[#20cf61]" /></div></header>
    {tab === "home" ? <><section className="border-b border-white/[0.06] px-4 py-5"><div className="flex gap-3"><button onClick={() => action("تم طلب السحب")} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#ef3941]/40 bg-[#321113] py-3 text-lg font-bold text-[#ff676d]"><ArrowDownLeft /> سحب</button><button onClick={() => action("تم فتح صفحة الإيداع")} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#20ca5d] py-3 text-lg font-bold shadow-[0_8px_25px_rgba(32,202,93,.2)]"><Plus /> إيداع</button><div className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#8c5b06] bg-[#291f0c] text-[#ffc21c]"><CircleDollarSign /><span><small className="block text-xs text-white/45">الرصيد</small><b className="text-xl">{balance}</b></span></div></div></section><section className="px-5 pb-8 pt-16 text-center"><p className="text-2xl text-white/45">رصيدك</p><p className="mt-5 text-7xl font-black">{balance}</p><p className="mt-2 text-3xl text-white/45">عملة</p><p className="mt-5 text-xl text-white/45">ج.م <span className="text-[#20cf61]">{balance}</span></p><div className="mt-14 grid grid-cols-3 gap-5"><button onClick={() => action("لا يوجد رصيد للسحب")} className="flex flex-col items-center gap-4 text-xl font-bold"><span className="flex size-32 items-center justify-center rounded-full border-2 border-[#6c2429] bg-[#210d0f] text-5xl text-[#fb4b52]"><ArrowDownLeft /></span>سحب</button><button onClick={() => action("تم تحديث الرصيد")} className="flex flex-col items-center gap-4 text-xl font-bold"><span className="flex size-32 items-center justify-center rounded-full bg-[#222225] text-5xl text-white/50"><RefreshCw /></span>تحديث</button><button onClick={() => { setBalance(400); action("تم تحديث رصيدك") }} className="flex flex-col items-center gap-4 text-xl font-bold"><span className="flex size-32 items-center justify-center rounded-full bg-[#20ca5d] text-6xl shadow-[0_12px_35px_rgba(32,202,93,.25)]"><Plus /></span>إيداع</button></div></section><section className="mx-5 grid grid-cols-2 divide-x divide-white/10 rounded-3xl bg-[#161617] py-6 text-center"><div><b className="text-3xl">0</b><p className="mt-2 text-white/40">إحالات</p></div><div><b className="text-3xl">0</b><p className="mt-2 text-white/40">لعب</p></div></section><button onClick={() => setTab("competitions")} className="mx-5 mt-8 rounded-[30px] bg-gradient-to-br from-[#ffab0b] to-[#ff6b0b] p-7 text-right shadow-[0_14px_35px_rgba(255,134,12,.16)]"><div className="flex items-center gap-5"><span className="flex size-20 items-center justify-center rounded-3xl bg-white/20 text-5xl"><Trophy /></span><span><strong className="block text-4xl font-black">العب واكسب</strong><small className="text-xl">اربح 400 عملة في دقائق</small></span></div><div className="mt-7 grid grid-cols-2 gap-4"><div className="rounded-2xl bg-white/20 p-4 text-center"><p>الجائزة</p><b className="text-3xl">400</b></div><div className="rounded-2xl bg-black/15 p-4 text-center"><p>الرسوم</p><b className="text-3xl">250</b></div></div><div className="mt-5 rounded-2xl bg-[#ffd39a] px-5 py-4 text-center text-xl font-black text-[#d66e08]">اشحن رصيدك أولاً <ChevronLeft className="inline" /></div></button></> : <Inner tab={tab} action={action} />}
  </div>{notice && <div className="fixed bottom-24 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black shadow-xl">{notice}</div>}<nav className="fixed bottom-0 left-1/2 z-10 grid w-full max-w-[520px] -translate-x-1/2 grid-cols-6 border-t border-white/[0.08] bg-[#101011]/95 px-2 py-3 backdrop-blur-xl">{nav.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`flex flex-col items-center gap-2 rounded-2xl py-2 text-[11px] transition ${tab === id ? "bg-[#321113] font-bold text-[#ff4b52]" : "text-white/45"}`}><Icon className="size-7" />{label}</button>)}</nav></main>
}

function Inner({ tab, action }: { tab: Tab; action: (message: string) => void }) {
  const content: Record<Tab, { title: string; body: string }> = { home: { title: "الرئيسية", body: "" }, wallet: { title: "المحفظة", body: "تابع رصيدك وعمليات الإيداع والسحب من هنا." }, alerts: { title: "الإشعارات", body: "لا توجد إشعارات جديدة حالياً." }, competitions: { title: "المسابقات", body: "اختر مسابقة وابدأ اللعب واربح العملات." }, finance: { title: "المالية و النسخ", body: "كل تقاريرك وحركاتك المالية في مكان واحد." }, account: { title: "حسابي", body: "محمد أحمد\nعضو منذ مارس 2026" } }
  const item = content[tab]
  return <section className="flex flex-1 flex-col px-5 pt-12"><h1 className="text-4xl font-black">{item.title}</h1><div className="mt-8 whitespace-pre-line rounded-3xl border border-white/10 bg-[#161617] p-6 text-lg leading-9 text-white/60">{item.body}</div><button onClick={() => action("تم تنفيذ الإجراء")} className="mt-6 rounded-2xl bg-[#20ca5d] px-5 py-4 text-lg font-bold">ابدأ الآن</button></section>
}
