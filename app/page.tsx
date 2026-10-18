"use client"

import { useCallback, useEffect, useState } from "react"
import { ForeignDeposit, type ForeignMethod } from "@/components/foreign-deposit"
import { EgyptDeposit } from "@/components/egypt-deposit"
import { ArrowDownLeft, Bell, ChevronLeft, CircleDollarSign, Home, LogOut, Plus, RefreshCw, ReceiptText, Settings, Trophy, User, Wallet, X } from "lucide-react"

type Tab = "home" | "wallet" | "alerts" | "competitions" | "finance" | "account"
type Screen = "landing" | "auth" | "login" | "email-login" | "quick" | "forgot" | "verify" | "signup-name" | "signup-phone" | "signup-password" | "app"
type ModalType = "deposit" | "withdraw" | "game" | null

const nav: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "account", label: "حسابي", icon: User },
  { id: "wallet", label: "المحفظة", icon: Wallet },
  { id: "alerts", label: "الإشعارات", icon: Bell },
  { id: "competitions", label: "المسابقات", icon: Trophy },
  { id: "finance", label: "المالية", icon: ReceiptText },
  { id: "home", label: "الرئيسية", icon: Home },
]

export default function Page() {
  const [intro, setIntro] = useState(true)
  const [screen, setScreen] = useState<Screen>("landing")
  const [tab, setTab] = useState<Tab>("home")
  const [balance, setBalance] = useState(0)
  const [modal, setModal] = useState<ModalType>(null)
  const [toast, setToast] = useState("")
  const [code, setCode] = useState("")
  const [verificationPhone, setVerificationPhone] = useState("")
  const [verificationMode, setVerificationMode] = useState<"signup" | "quick">("quick")
  const [authError, setAuthError] = useState("")
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    const savedSession = window.localStorage.getItem("skillwin_logged_in")
    if (savedSession === "true") {
      setIntro(false)
      setScreen("app")
      return
    }

  }, [])

  const finishIntro = useCallback(() => setIntro(false), [])
  const notify = (message: string) => { setToast(message); setTimeout(() => setToast(""), 2200) }

  if (intro) return <Splash onDone={finishIntro} />
  if (screen === "landing") return <Landing setScreen={setScreen} notify={notify} />
  if (screen === "auth" || screen === "login" || screen === "email-login" || screen === "quick" || screen === "signup-name" || screen === "signup-phone" || screen === "signup-password") return <AuthWithSupabase screen={screen} setScreen={setScreen} setVerificationPhone={setVerificationPhone} setVerificationMode={setVerificationMode} setAuthError={setAuthError} authError={authError} authLoading={authLoading} setAuthLoading={setAuthLoading} />
  if (screen === "forgot") return <Forgot setScreen={setScreen} />
  if (screen === "verify") return <Verify code={code} setCode={setCode} setScreen={setScreen} phone={verificationPhone} mode={verificationMode} setAuthError={setAuthError} setAuthLoading={setAuthLoading} authLoading={authLoading} />

  return <main dir="rtl" className="min-h-screen bg-[#080809] text-white"><div className="mx-auto min-h-screen w-full max-w-[520px] bg-[#09090a] pb-24">
    <header className="flex items-center justify-between border-b border-white/[.06] px-4 py-4"><button onClick={() => setTab("account")} className="flex size-12 items-center justify-center rounded-2xl bg-[#ed3039] text-2xl font-black">S</button><div className="flex items-center gap-3"><div className="text-right"><p className="text-xs text-white/45">مرحباً</p><p className="font-black">محمد</p></div><span className="size-3 rounded-full bg-[#21ce61]" /></div></header>
    {tab === "home" ? <HomePanel balance={balance} setModal={setModal} notify={notify} /> : <Inner tab={tab} balance={balance} setTab={setTab} setModal={setModal} notify={notify} />}
  </div><BottomNav tab={tab} setTab={setTab} />{toast && <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black shadow-2xl">{toast}</div>}{modal && <ActionModal type={modal} balance={balance} setBalance={setBalance} close={() => setModal(null)} notify={notify} />}</main>
}

const SPLASH_STEPS = 5

function Splash({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step >= SPLASH_STEPS) {
      const finish = setTimeout(onDone, 600)
      return () => clearTimeout(finish)
    }
    const next = setTimeout(() => setStep((value) => value + 1), step === 0 ? 500 : 750)
    return () => clearTimeout(next)
  }, [step, onDone])

  const reveal = (from: number) => `transition-all duration-700 ${step >= from ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`

  return (
    <main dir="ltr" className="flex min-h-screen items-center justify-center bg-[#080809] text-white">
      <section className="flex min-h-screen w-full max-w-[520px] flex-col items-center justify-center px-6 text-center">
        <div className="mb-24 flex size-28 flex-col items-center justify-center rounded-full border-[6px] border-[#1386d0] text-[#ff7b13] shadow-[0_0_30px_rgba(19,134,208,.2)]">
          <b className="text-7xl leading-none">?</b>
          <span className="text-sm font-black text-[#1386d0]">SKILL WIN</span>
        </div>
        <h1 className={`text-4xl font-black ${reveal(1)}`}>SkillWin</h1>
        <p className={`mt-3 text-xl text-white/45 ${reveal(2)}`}>Play &amp; Win</p>
        <div className="mt-14 min-h-20 text-xl text-white/50">
          <p className={reveal(3)}>&quot;Success is not the end of the road,</p>
          <p className={`mt-1 ${reveal(4)}`}>failure is not fatal&quot;</p>
        </div>
        <div className="mt-16 flex items-center gap-5" role="progressbar" aria-label="Loading" aria-valuemin={0} aria-valuemax={SPLASH_STEPS} aria-valuenow={Math.min(step, SPLASH_STEPS)}>
          {Array.from({ length: SPLASH_STEPS }).map((_, index) => {
            const done = step > index
            const current = step === index
            return (
              <i
                key={index}
                className={`rounded-full transition-all duration-500 ${done ? "size-4 bg-[#ffc329] shadow-[0_0_22px_#ffc329]" : current ? "size-4 border-2 border-[#816d2e]" : "size-4 border-2 border-white/20"}`}
              />
            )
          })}
        </div>
        <b className="mt-14 text-[#d8ac18]">v1.9.3</b>
      </section>
    </main>
  )
}

function Landing({ setScreen, notify }: { setScreen: (s: Screen) => void; notify: (m: string) => void }) { return <main dir="rtl" className="min-h-screen bg-[#080809] text-white"><section className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col items-center px-6 py-7 text-center"><button onClick={() => notify("تم تبديل المظهر")} aria-label="تبديل المظهر" className="self-start rounded-full p-2 text-xl text-white/45">☼</button><div className="mt-8 flex size-28 flex-col items-center justify-center rounded-full border-[6px] border-[#1386d0] text-[#ff7b13] shadow-[0_0_24px_rgba(19,134,208,.16)]"><b className="text-7xl leading-none">?</b><span className="text-sm font-black text-[#1386d0]">SKILL WIN</span></div><h1 className="mt-8 text-4xl font-black">SkillWin</h1><h2 className="mt-3 text-2xl font-black">العب واكسب</h2><p className="mt-2 text-sm text-white/45">اختبر معلوماتك واربح جوائز حقيقية</p><div className="mt-10 grid w-full grid-cols-3 divide-x divide-white/10 rounded-2xl bg-[#151516] px-3 py-4"><div><b className="text-2xl text-white">10</b><p className="text-xs text-white/45">اسئلة</p></div><div><b className="text-2xl text-[#ff9d18]">10s</b><p className="text-xs text-white/45">لكل سؤال</p></div><div><b className="text-2xl text-[#20ca5d]">400</b><p className="text-xs text-white/45">جائزة</p></div></div><div className="mt-7 w-full rounded-2xl border border-white/[.08] bg-[#151516] px-4 py-3 text-sm text-white/50"><p>نظام دفع آلي ومؤمن 100%</p><div className="mt-2 flex justify-center gap-5 text-xs"><span><i className="mr-1 inline-block size-2 rounded-full bg-[#20ca5d]"/>إيداع فوري</span><span><i className="mr-1 inline-block size-2 rounded-full bg-[#d89b20]"/>سحب آلي</span></div></div><div className="mt-auto flex w-full flex-col gap-3 pt-7"><button onClick={() => setScreen("auth")} className="rounded-2xl bg-[#ff9d18] py-4 text-lg font-black text-black shadow-[0_8px_28px_rgba(255,157,24,.16)]">انشاء حساب جديد</button><button onClick={() => setScreen("auth")} className="rounded-2xl border border-white/10 py-4 font-bold text-white/80">عندي حساب</button></div></section></main> }

function Auth({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) { const login = screen === "login"; return <main dir="rtl" className="min-h-screen bg-[#080809] text-white"><section className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-6 py-8"><button onClick={() => setScreen("landing")} className="self-start rounded-full border border-white/10 px-4 py-2 text-white/60">رجوع</button><div className="mt-20 text-center"><h1 className="text-3xl font-black">{login ? "تسجيل الدخول" : screen === "quick" ? "الدخول السريع" : "اختر طريقة التسجيل"}</h1><p className="mt-3 text-white/45">{login ? "ادخل إلى حسابك واستكمل اللعب" : "اختر الطريقة الأنسب لك"}</p></div>{login ? <div className="mt-10 flex flex-col gap-4"><input aria-label="رقم الهاتف أو البريد الإلكتروني" placeholder="رقم الهاتف أو البريد الإلكتروني" className="rounded-2xl border border-white/10 bg-[#151516] p-4 outline-none"/><input aria-label="كلمة المرور" type="password" placeholder="كلمة المرور" className="rounded-2xl border border-white/10 bg-[#151516] p-4 outline-none"/><button onClick={() => setScreen("app")} className="rounded-2xl bg-[#ff9d18] py-4 font-black text-black">دخول</button><button onClick={() => setScreen("quick")} className="py-3 text-white/50">الدخول السريع بدون كلمة مرور</button><button onClick={() => setScreen("forgot")} className="py-2 text-sm text-[#ffb31c]">نسيت كلمة المرور؟</button></div> : <div className="mt-10 flex flex-col gap-4"><button onClick={() => setScreen("verify")} className="rounded-2xl bg-[#ff9d18] p-5 text-right"><b className="block text-xl">{screen === "quick" ? "إرسال رمز الدخول" : "التسجيل السريع"}</b><span className="text-sm text-black/60">بدون بريد إلكتروني، في ثوانٍ</span></button>{screen !== "quick" && <button onClick={() => setScreen("auth")} className="rounded-2xl bg-[#151516] p-5 text-right"><b className="block text-xl">التسجيل بالبريد</b><span className="text-sm text-white/40">استخدم بريدك الإلكتروني</span></button>}</div>}</section></main> }

function AuthWithSupabase({ screen, setScreen, setVerificationPhone, setVerificationMode, setAuthError, authError, authLoading, setAuthLoading }: { screen: Screen; setScreen: (s: Screen) => void; setVerificationPhone: (value: string) => void; setVerificationMode: (value: "signup" | "quick") => void; setAuthError: (value: string) => void; authError: string; authLoading: boolean; setAuthLoading: (value: boolean) => void }) {
  const signup = screen === "auth" || screen === "signup-name" || screen === "signup-phone" || screen === "signup-password"
  const login = screen === "login"
  const emailLogin = screen === "email-login"
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (screen === "auth") setScreen("signup-name")
  }, [screen, setScreen])

  const normalizedPhone = phone.replace(/\D/g, "")
  const validPhone = /^01\d{9}$/.test(normalizedPhone)

  const saveAccount = (account: { phone: string; email?: string; password?: string; name: string }) => {
    window.localStorage.setItem("skillwin_account", JSON.stringify(account))
    window.localStorage.setItem("skillwin_logged_in", "true")
  }

  const nextSignupStep = () => {
    setAuthError("")
    if (!name.trim()) { setAuthError("اكتب الاسم الثلاثي للمتابعة"); return }
    setScreen("signup-phone")
  }

  const nextPhoneStep = () => {
    setAuthError("")
    if (!validPhone) { setAuthError("اكتب رقمًا يبدأ بـ 01 ويتكون من 11 رقمًا"); return }
    setScreen("signup-password")
  }

  const finishSignup = () => {
    setAuthError("")
    if (!password.trim()) { setAuthError("اكتب كلمة المرور للمتابعة"); return }
    saveAccount({ phone: normalizedPhone, password, name: name.trim() })
    setScreen("app")
  }

  const loginWithPhone = () => {
    setAuthError("")
    if (!validPhone) { setAuthError("اكتب رقمًا يبدأ بـ 01 ويتكون من 11 رقمًا"); return }
    if (!password.trim()) { setAuthError("اكتب كلمة المرور للمتابعة"); return }
    const saved = window.localStorage.getItem("skillwin_account")
    const account = saved ? JSON.parse(saved) : { phone: normalizedPhone, name: "مستخدم SkillWin" }
    saveAccount({ ...account, phone: normalizedPhone, password })
    setScreen("app")
  }

  const quickLogin = () => {
    setAuthError("")
    if (!validPhone) { setAuthError("اكتب رقمًا يبدأ بـ 01 ويتكون من 11 رقمًا"); return }
    const saved = window.localStorage.getItem("skillwin_account")
    saveAccount(saved ? JSON.parse(saved) : { phone: normalizedPhone, name: "مستخدم SkillWin" })
    setScreen("app")
  }

  const emailLoginSubmit = () => {
    if (!email.trim() || !password.trim()) { setAuthError("اكتب البريد وكلمة المرور للمتابعة"); return }
    saveAccount({ phone: "", email: email.trim(), password, name: "مستخدم SkillWin" })
    setScreen("app")
  }

  const title = signup ? (screen === "signup-phone" ? "رقم الموبيل" : screen === "signup-password" ? "كلمة المرور" : "إنشاء حساب جديد") : emailLogin ? "تسجيل الدخول بالبريد" : login ? "تسجيل الدخول" : "الدخول السريع"
  const subtitle = signup ? (screen === "signup-name" || screen === "auth" ? "اكتب اسمك الثلاثي لإنشاء حسابك" : screen === "signup-phone" ? "اكتب رقم الموبيل المصري بدون رمز الدولة" : "اختر كلمة مرور لحماية حسابك") : emailLogin ? "واجهة منفصلة للدخول بالبريد الإلكتروني" : login ? "ادخل إلى حسابك برقم الهاتف المصري" : "ادخل برقم هاتفك بدون كلمة مرور"

  return <main dir="rtl" className="min-h-screen bg-[#080809] text-white"><section className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-6 py-8"><button onClick={() => setScreen(signup && screen !== "signup-name" ? (screen === "signup-password" ? "signup-phone" : "signup-name") : "landing")} className="self-start rounded-full border border-white/10 px-4 py-2 text-white/60">رجوع</button><div className="mt-20 text-center"><div className="mx-auto mb-7 flex size-20 items-center justify-center rounded-full border-4 border-[#1386d0] text-5xl font-black text-[#ff7b13]">?</div><h1 className="text-3xl font-black">{title}</h1><p className="mt-3 text-white/45">{subtitle}</p></div><div className="mt-10 flex flex-col gap-4">{signup && (screen === "auth" || screen === "signup-name") && <><input autoFocus aria-label="الاسم الثلاثي" value={name} onChange={e => setName(e.target.value)} placeholder="الاسم الثلاثي" className="rounded-2xl border border-white/10 bg-[#151516] p-4 outline-none"/><button onClick={nextSignupStep} className="rounded-2xl bg-[#ff9d18] py-4 font-black text-black">التالي</button></>}{signup && screen === "signup-phone" && <><input autoFocus aria-label="رقم الموبيل" type="tel" inputMode="numeric" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="رقم يبدأ بـ 01 - 11 رقمًا" className="rounded-2xl border border-white/10 bg-[#151516] p-4 outline-none"/><button onClick={nextPhoneStep} className="rounded-2xl bg-[#ff9d18] py-4 font-black text-black">التالي</button></>}{signup && screen === "signup-password" && <><input autoFocus aria-label="كلمة المرور" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="كلمة المرور" className="rounded-2xl border border-white/10 bg-[#151516] p-4 outline-none"/><button onClick={finishSignup} className="rounded-2xl bg-[#ff9d18] py-4 font-black text-black">إنشاء الحساب</button></>}{login && <><input aria-label="رقم الموبيل" type="tel" inputMode="numeric" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="رقم يبدأ بـ 01 - 11 رقمًا" className="rounded-2xl border border-white/10 bg-[#151516] p-4 outline-none"/><input aria-label="كلمة المرور" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="كلمة المرور" className="rounded-2xl border border-white/10 bg-[#151516] p-4 outline-none"/><button onClick={loginWithPhone} className="rounded-2xl bg-[#ff9d18] py-4 font-black text-black">دخول</button><button onClick={() => setScreen("quick")} className="py-3 text-white/50">الدخول السريع بدون كلمة مرور</button></>}{emailLogin && <><input aria-label="البريد الإلكتروني" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="البريد الإلكتروني" className="rounded-2xl border border-white/10 bg-[#151516] p-4 outline-none"/><input aria-label="كلمة المرور" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="كلمة المرور" className="rounded-2xl border border-white/10 bg-[#151516] p-4 outline-none"/><button onClick={emailLoginSubmit} className="rounded-2xl bg-[#ff9d18] py-4 font-black text-black">دخول</button></>}{screen === "quick" && <><input aria-label="رقم الموبيل" type="tel" inputMode="numeric" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="رقم يبدأ بـ 01 - 11 رقمًا" className="rounded-2xl border border-white/10 bg-[#151516] p-4 outline-none"/><button onClick={quickLogin} className="rounded-2xl bg-[#ff9d18] py-4 font-black text-black">الدخول السريع</button></>}{authError && <p role="alert" className="rounded-2xl bg-[#42171a] p-4 text-center text-[#ff858a]">{authError}</p>}<div className="flex justify-center gap-4 text-sm text-white/45">{signup ? <button onClick={() => setScreen("login")}>لدي حساب بالفعل</button> : <button onClick={() => setScreen("signup-name")}>إنشاء حساب جديد</button>}{!signup && <button onClick={() => setScreen("email-login")}>الدخول بالبريد</button>}</div></div></section></main>
}

function Verify({ code, setCode, setScreen, phone, mode, setAuthError, setAuthLoading, authLoading }: { code: string; setCode: (v: string) => void; setScreen: (s: Screen) => void; phone: string; mode: "signup" | "quick"; setAuthError: (value: string) => void; setAuthLoading: (value: boolean) => void; authLoading: boolean }) {
  const [displayCode, setDisplayCode] = useState(() => String(Math.floor(100000 + Math.random() * 900000)))
  const [secondsLeft, setSecondsLeft] = useState(20)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          setDisplayCode(String(Math.floor(100000 + Math.random() * 900000)))
          setCode("")
          return 20
        }
        return seconds - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [setCode])

  const isValid = code.length === 6
  const confirmCode = async () => {
    setAuthError("")
    setAuthLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 250))
    setAuthLoading(false)
    if (code !== displayCode) { setAuthError("رمز الدخول غير صحيح أو منتهي"); return }
    window.localStorage.setItem("skillwin_logged_in", "true")
    setScreen("app")
  }

  return <main dir="rtl" className="min-h-screen bg-[#080809] text-white"><section className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-6 py-8"><button onClick={() => setScreen("auth")} className="self-start rounded-full border border-white/10 px-4 py-2 text-white/60">رجوع</button><div className="mt-24 rounded-[28px] border border-white/[.07] bg-[#151516] p-6 text-center"><h1 className="text-3xl font-black">{mode === "signup" ? "تأكيد إنشاء الحساب" : "تأكيد الدخول السريع"}</h1><p className="mt-3 text-white/45">اكتب رمز SMS المرسل إلى {phone}</p><div className="mx-auto mt-8 flex max-w-xs items-center justify-between rounded-2xl border border-[#ffb31c]/25 bg-[#201a0d] px-5 py-4"><b className="text-4xl tracking-[.35em] text-[#ffb31c]">{displayCode}</b><span className="text-lg font-black text-[#ffb31c]" aria-live="polite">{secondsLeft}s</span></div><p className="mt-3 text-sm text-white/40">يتغير الرمز تلقائياً كل 20 ثانية</p><input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" maxLength={6} aria-label="رمز التحقق" placeholder="• • • • • •" className="mt-8 w-full rounded-2xl border border-white/10 bg-[#0b0b0c] p-4 text-center text-xl tracking-[.35em] outline-none focus:border-[#ff9d18]"/><button disabled={!isValid || authLoading} onClick={confirmCode} className="mt-4 w-full rounded-2xl bg-[#ff9d18] py-4 font-black text-black disabled:opacity-40">{authLoading ? "جارٍ التحقق..." : "تأكيد رمز الدخول"}</button></div></section></main>
}

function HomePanel({ balance, setModal, notify }: { balance: number; setModal: (m: Exclude<ModalType, null>) => void; notify: (m: string) => void }) { return <><section className="border-b border-white/[.06] px-4 py-5"><div className="flex gap-3"><button onClick={() => setModal("withdraw")} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#ef3941]/40 bg-[#321113] py-3 font-bold text-[#ff676d]"><ArrowDownLeft/>سحب</button><button onClick={() => setModal("deposit")} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#20ca5d] py-3 font-bold"><Plus/>إيداع</button><div className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#8c5b06] bg-[#291f0c] text-[#ffc21c]"><CircleDollarSign/><span><small className="block text-xs text-white/45">الرصيد</small><b className="text-xl">{balance}</b></span></div></div></section><section className="px-5 pb-8 pt-16 text-center"><p className="text-2xl text-white/45">رصيدك</p><p className="mt-5 text-7xl font-black">{balance}</p><p className="mt-2 text-3xl text-white/45">عملة</p><p className="mt-5 text-xl text-white/45">ج.م <span className="text-[#20cf61]">{balance}</span></p><div className="mt-14 grid grid-cols-3 gap-4"><RoundAction icon={<ArrowDownLeft/>} label="سحب" tone="red" onClick={() => setModal("withdraw")}/><RoundAction icon={<RefreshCw/>} label="تحديث" tone="gray" onClick={() => notify("تم تحديث الرصيد")}/><RoundAction icon={<Plus/>} label="��يداع" tone="green" onClick={() => setModal("deposit")}/></div><div className="mt-16 rounded-[28px] bg-gradient-to-br from-[#ffb01b] to-[#ff7411] p-6 text-right"><p className="text-3xl font-black">العب واكسب</p><p className="mt-1">اربح 400 عملة في دقائق</p><button onClick={() => setModal("game")} className="mt-6 w-full rounded-2xl bg-white/25 py-4 text-lg font-black">ابدأ الآن ←</button></div></section></> }

function RoundAction({ icon, label, tone, onClick }: { icon: React.ReactNode; label: string; tone: "red" | "gray" | "green"; onClick: () => void }) { const style = tone === "green" ? "bg-[#20ca5d]" : tone === "red" ? "border-2 border-[#6c2429] bg-[#210d0f] text-[#fb4b52]" : "bg-[#222225] text-white/50"; return <button onClick={onClick} className="flex flex-col items-center gap-3 text-lg font-bold"><span className={`flex size-28 items-center justify-center rounded-full text-5xl ${style}`}>{icon}</span>{label}</button> }

function Inner({ tab, balance, setTab, setModal, notify }: { tab: Tab; balance: number; setTab: (t: Tab) => void; setModal: (m: Exclude<ModalType, null>) => void; notify: (m: string) => void }) { const data: Record<Tab, [string,string]> = { wallet: ["المحفظة","تحكم في رصيدك ومعاملاتك بسهولة"], alerts: ["الإشعارات","تابع أحدث أخبار حسابك ومسابقاتك"], competitions: ["المسابقات","اختبر معلوماتك واربح جوائز حقيقية"], finance: ["المالية و النسخ","راجع حركاتك المالية وتقارير الحساب"], account: ["حسابي","إدارة بياناتك وإعدادات حسابك"], home: ["الرئيسية",""] }; const [title, subtitle] = data[tab]; return <section className="px-5 pt-10"><button onClick={() => setTab("home")} className="mb-5 flex items-center gap-1 text-white/45"><ChevronLeft/>الرئيسية</button><p className="text-sm text-white/40">SkillWin</p><h1 className="mt-2 text-4xl font-black">{title}</h1><p className="mt-2 text-white/45">{subtitle}</p><div className="mt-7 rounded-[28px] border border-white/[.07] bg-[#151516] p-5">{tab === "wallet" && <><div className="flex justify-between text-white/45"><span>الرصيد المتاح</span><Wallet className="text-[#ffbd22]"/></div><p className="mt-3 text-5xl font-black">{balance} <span className="text-xl text-white/40">ج.م</span></p><div className="mt-5 grid grid-cols-2 gap-3"><button onClick={() => setModal("deposit")} className="rounded-2xl bg-[#20ca5d] py-3 font-bold">+ إيداع</button><button onClick={() => setModal("withdraw")} className="rounded-2xl bg-[#321113] py-3 font-bold text-[#ff676d]">سحب</button></div></>}{tab === "alerts" && <div className="py-12 text-center"><Bell className="mx-auto size-16 text-white/20"/><p className="mt-5 text-xl font-bold">لا توجد إشعارات</p><p className="mt-2 text-sm text-white/40">ستظهر هنا تحديثات حسابك</p></div>}{tab === "competitions" && <><div className="flex items-center gap-4"><Trophy className="text-[#ffb31c]"/><div><p className="text-xl font-black">العب واكسب</p><p className="text-sm text-white/45">10 أسئلة · 10 ثوانٍ لكل سؤال</p></div></div><button onClick={() => setModal("game")} className="mt-5 w-full rounded-2xl bg-[#ff9d18] py-4 font-black text-black">ابدأ المسابقة</button></>}{tab === "finance" && <div className="flex flex-col gap-5"><Stat label="إجمالي الإيداعات" value={`${balance} عملة`}/><Stat label="إجمالي السحوبات" value="0 جنيه"/><Stat label="عدد العمليات" value="0 عملية"/></div>}{tab === "account" && <div className="flex flex-col gap-3"><div className="flex items-center gap-4 rounded-2xl bg-white/[.04] p-4"><span className="flex size-12 items-center justify-center rounded-full bg-[#ed3039] text-xl font-black">م</span><div><b>محمد</b><p className="text-sm text-white/40">حساب موثق</p></div></div><button onClick={() => notify("الإعدادات جاهزة للتعديل")} className="flex items-center justify-between rounded-2xl bg-white/[.04] p-4"><span>الإعدادات</span><Settings/></button><button onClick={() => notify("تم تسجيل الخروج")} className="flex items-center justify-between rounded-2xl bg-[#321113] p-4 text-[#ff676d]"><span>تسجيل الخروج</span><LogOut/></button></div>}</div></section> }

function Stat({ label, value }: { label: string; value: string }) { return <div className="flex justify-between border-b border-white/[.06] pb-4"><span className="text-white/50">{label}</span><b>{value}</b></div> }

function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) { return <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-[520px] -translate-x-1/2 justify-between border-t border-white/[.08] bg-[#101011]/95 px-2 py-3 backdrop-blur-xl">{nav.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`flex min-w-0 flex-1 flex-col items-center gap-1 text-[10px] font-bold ${tab === id ? "text-[#ff3e47]" : "text-white/45"}`}><Icon className="size-6"/><span>{label}</span></button>)}</nav> }

function ActionModal({ type, balance, setBalance, close, notify }: { type: Exclude<ModalType, null>; balance: number; setBalance: (n: number) => void; close: () => void; notify: (m: string) => void }) { if (type === "deposit") return <DepositScreen balance={balance} setBalance={setBalance} close={close} notify={notify} />; if (type === "withdraw") return <WithdrawScreen balance={balance} setBalance={setBalance} close={close} notify={notify} />; return <GameScreen balance={balance} close={close} notify={notify} />; const title = type === "withdraw" ? "سحب الرصيد" : "العب واكسب"; return <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/75 p-4"><div className="w-full max-w-[520px] rounded-[30px] border border-white/10 bg-[#181819] p-6"><button onClick={close} aria-label="إغلاق" className="float-left rounded-full bg-white/10 p-2"><X/></button><h2 className="text-3xl font-black">{title}</h2><p className="mt-2 text-white/45">{type === "game" ? "ادفع 250 عملة وابدأ المسابقة" : "أدخل المبلغ وبيانات الاستلام"}</p>{type === "withdraw" ? <><input type="number" placeholder="المبلغ" className="mt-7 w-full rounded-2xl border border-white/10 bg-[#0c0c0d] p-4 outline-none"/><button onClick={() => { setBalance(Math.max(0, balance - 100)); notify("تم طلب السحب"); close() }} className="mt-4 w-full rounded-2xl bg-[#ef3941] py-4 font-black">تأكيد السحب</button></> : <button onClick={() => { notify("تم بدء المسابقة"); close() }} className="mt-7 w-full rounded-2xl bg-[#ff9d18] py-4 font-black text-black">ابدأ اللعب</button>}</div></div> }

function WithdrawScreen({ balance, setBalance, close, notify }: { balance: number; setBalance: (n: number) => void; close: () => void; notify: (m: string) => void }) { const [amount, setAmount] = useState(""); const [method, setMethod] = useState("Vodafone Cash"); return <main dir="rtl" className="fixed inset-0 z-40 overflow-y-auto bg-[#f7f8fb] text-[#172033]"><section className="mx-auto min-h-full w-full max-w-[520px] pb-8"><header className="flex items-center justify-between border-b border-[#e1e4ea] bg-white px-5 py-5"><button onClick={close} aria-label="إغلاق السحب" className="text-4xl text-[#6d7582]">×</button><h1 className="text-3xl font-black">سحب</h1><button onClick={() => notify("تواصل معنا عبر الاستفسارات")} className="rounded-full bg-[#eef4ff] px-4 py-2 font-bold text-[#3478db]">استفسارات</button></header><div className="p-5"><div className="rounded-3xl bg-white p-5 shadow-sm"><p className="text-[#697181]">الرصيد المتاح</p><p className="mt-2 text-4xl font-black">{balance} <span className="text-lg font-normal">ج.م</span></p></div><div className="mt-5 rounded-3xl bg-white p-5 shadow-sm"><h2 className="text-xl font-black">بيانات السحب</h2><label className="mt-5 block text-sm font-bold">المبلغ</label><input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="أدخل المبلغ" className="mt-2 w-full rounded-2xl border border-[#e1e4ea] bg-[#f7f8fb] p-4 outline-none focus:border-[#3478db]"/><label className="mt-4 block text-sm font-bold">طريقة الاستلام</label><select value={method} onChange={e => setMethod(e.target.value)} className="mt-2 w-full rounded-2xl border border-[#e1e4ea] bg-[#f7f8fb] p-4"><option>Vodafone Cash</option><option>Etisalat Cash</option><option>Orange Cash</option><option>InstaPay</option></select><input placeholder="رقم المحفظة أو الحساب" className="mt-4 w-full rounded-2xl border border-[#e1e4ea] bg-[#f7f8fb] p-4 outline-none"/><button onClick={() => { const value = Number(amount); if (!value || value > balance) return notify("تأكد من المبلغ المتاح"); setBalance(balance - value); notify("تم إرسال طلب السحب"); close() }} className="mt-5 w-full rounded-2xl bg-[#ef3941] py-4 font-black text-white">تأكيد السحب</button></div></div></section></main> }

function GameScreen({ balance, close, notify }: { balance: number; close: () => void; notify: (m: string) => void }) { const [started, setStarted] = useState(false); return <main dir="rtl" className="fixed inset-0 z-40 overflow-y-auto bg-[#080809] text-white"><section className="mx-auto min-h-full w-full max-w-[520px] pb-8"><header className="flex items-center justify-between border-b border-white/[.08] px-5 py-5"><button onClick={close} aria-label="إغلاق اللعبة" className="text-4xl text-white/55">×</button><h1 className="text-3xl font-black">العب واكسب</h1><span className="rounded-full bg-[#291f0c] px-4 py-2 text-[#ffc21c]">{balance} عملة</span></header>{!started ? <div className="p-5"><div className="mt-5 rounded-[32px] bg-gradient-to-br from-[#ffb01b] to-[#ff7411] p-7"><Trophy className="size-16 text-white"/><h2 className="mt-8 text-4xl font-black">تحدي اليوم</h2><p className="mt-3 text-xl">10 أسئلة · 10 ثوانٍ لكل سؤال</p><div className="mt-8 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/20 p-4"><p>الجائزة</p><b className="text-3xl">400</b></div><div className="rounded-2xl bg-black/15 p-4"><p>الرسوم</p><b className="text-3xl">250</b></div></div></div><button onClick={() => { if (balance < 250) return notify("تحتاج إلى 250 عملة للعب"); setStarted(true) }} className="mt-6 w-full rounded-2xl bg-[#20ca5d] py-4 text-lg font-black text-black">ابدأ اللعب الآن</button><button onClick={close} className="mt-3 w-full rounded-2xl border border-white/10 py-4 font-bold text-white/60">العودة</button></div> : <div className="p-5"><div className="flex items-center justify-between text-white/50"><span>السؤال 1 من 10</span><span className="text-[#ffc21c]">00:10</span></div><div className="mt-5 rounded-3xl bg-[#151516] p-6"><h2 className="text-2xl font-black">ما عاصمة جمهورية مصر العربية؟</h2><div className="mt-7 flex flex-col gap-3">{["القاهرة", "الإسكندرية", "الأقصر", "أسوان"].map(answer => <button key={answer} onClick={() => { notify(answer === "القاهرة" ? "إجابة صحيحة" : "إجابة غير صحيحة"); close() }} className="rounded-2xl border border-white/10 bg-[#202022] p-4 text-right font-bold hover:border-[#ffb31c]">{answer}</button>)}</div></div></div>}</section></main> }

function MethodLogo({ mark, name }: { mark: string; name: string }) {
  if (mark === "orange") return <svg role="img" aria-label={name} viewBox="0 0 64 64" className="size-[72px]"><path d="M8 26 L26 8 M10 8 H28 V26" fill="none" stroke="#111" strokeWidth="6" strokeLinejoin="miter" /><path d="M56 22 L38 40 M54 40 H36 V22" fill="none" stroke="#ff7900" strokeWidth="6" strokeLinejoin="miter" /><text x="32" y="53" textAnchor="middle" fontSize="12" fontWeight="800" fill="#111">اورنج</text><text x="32" y="64" textAnchor="middle" fontSize="12" fontWeight="800" fill="#111">كاش</text></svg>;
  if (mark === "instapay") return <span role="img" aria-label={name} className="flex flex-col items-center leading-none text-[#5a2d8c]"><span className="text-3xl font-black italic tracking-tighter">i&raquo;P</span><span className="mt-1 text-[10px] font-extrabold italic tracking-wide">INSTAPAY</span></span>;
  if (mark === "axispay") return <span role="img" aria-label={name} className="flex items-center gap-1 text-[#17c3a0]"><span className="size-3 rounded-[3px] bg-[#17c3a0]" /><span className="text-3xl font-black tracking-tight">axis</span></span>;
  if (mark === "wepay") return <span role="img" aria-label={name} className="flex flex-col items-center leading-none"><span className="text-4xl font-black italic tracking-tighter text-[#6b3a8c]">we</span><span className="mt-1 -skew-x-12 rounded-sm bg-[#6b3a8c] px-2 py-0.5 text-sm font-black italic text-white">Pay</span></span>;
  if (mark === "bm") return <span role="img" aria-label={name} className="flex size-[88px] flex-col items-center justify-center rounded-2xl bg-[#8a1c3c] leading-none text-white"><span className="text-3xl font-black tracking-tighter">BM</span><span className="mt-1 text-[10px] font-bold tracking-wide">WALLET</span></span>;
  if (mark === "smart") return <span role="img" aria-label={name} className="flex flex-col items-center leading-none text-[#1f6fb8]"><span className="mb-1 h-3 w-9 rounded-full bg-gradient-to-l from-[#f28c28] to-[#1f6fb8]" /><span className="text-xl font-black">Smart</span><span className="text-base font-medium">Wallet</span></span>;
  return <span className="text-center text-xl font-black text-[#273043]">{name}</span>;
}

function DepositScreen({ balance, setBalance, close, notify }: { balance: number; setBalance: (n: number) => void; close: () => void; notify: (m: string) => void }) { const [pick, setPick] = useState<ForeignMethod | null>(null); const [egy, setEgy] = useState<string | null>(null); const [region, setRegion] = useState<"egypt" | "crypto" | "global">("egypt"); const [picker, setPicker] = useState(false); const globalSlugs = ["paypal", "skrill-badge", "visa", "mastercard", "neteller"]; const regions = [{ id: "egypt" as const, title: "Egypt", sub: "مصر - الجنيه المصري (محافظ وانستاباي)", flag: "🇪🇬" }, { id: "crypto" as const, title: "Crypto", sub: "عملات رقمية - USDT, Bitcoin, Binance وغيرها", flag: "🪙" }, { id: "global" as const, title: "International", sub: "دولي - PayPal, Skrill, Visa, Mastercard", flag: "🌍" }]; const currentRegion = regions.find((r) => r.id === region)!; const methods = [{ name: "Vodafone Cash", mark: "vodafone", badge: "الأشهر" }, { name: "Etisalat Cash", mark: "etisalat" }, { name: "Instapay", mark: "instapay" }, { name: "Orange Cash", mark: "orange" }, { name: "Axispay", mark: "axispay", badge: "جديد" }, { name: "We Pay", mark: "wepay" }, { name: "BM Wallet", mark: "bm" }, { name: "CIB Smart Wallet", mark: "smart" }]; const icon = (slug: string) => `https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/${slug}/default.svg`; const foreign = [{ name: "Binance", slug: "binance", badge: "الأشهر" }, { name: "USDT (Tether)", slug: "tether" }, { name: "Bitcoin", slug: "bitcoin" }, { name: "Ethereum", slug: "ethereum" }, { name: "BNB Chain", slug: "bnb-chain" }, { name: "Tron (TRX)", slug: "tron" }, { name: "Litecoin", slug: "litecoin" }, { name: "Solana", slug: "solana" }, { name: "Dogecoin", slug: "dogecoin" }, { name: "Coinbase", slug: "coinbase" }, { name: "OKX", slug: "okx" }, { name: "Bybit", slug: "bybit" }, { name: "PayPal", slug: "paypal" }, { name: "Skrill", slug: "skrill-badge" }, { name: "Visa", slug: "visa" }, { name: "Mastercard", slug: "mastercard" }, { name: "Neteller", slug: "neteller", src: "/payment/neteller.png" }]; const methodImage = (method: { name: string; mark: string }) => method.mark === "vodafone" ? <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/vodafone/default.svg" alt="Vodafone Cash" className="size-20 object-contain" /> : method.mark === "etisalat" ? <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/etisalat/default.svg" alt="Etisalat Cash" className="size-20 object-contain" /> : <MethodLogo mark={method.mark} name={method.name} />; const egyMethod = methods.find((m) => m.name === egy); if (egyMethod) return <EgyptDeposit key={egyMethod.name} name={egyMethod.name} logo={methodImage(egyMethod)} nav={<DepositNav />} close={close} back={() => setEgy(null)} notify={notify} />; if (pick) return <ForeignDeposit method={pick} close={close} back={() => setPick(null)} notify={notify} />; return <div dir="rtl" className="fixed inset-0 z-40 overflow-y-auto bg-[#f7f8fb] text-[#172033]"><div className="mx-auto min-h-full w-full max-w-[520px] pb-28"><header className="sticky top-0 z-10 flex h-[122px] items-end justify-between border-b border-[#e1e4ea] bg-white px-5 pb-5"><button onClick={close} aria-label="إغلاق الإيداع" className="text-5xl font-light leading-none text-[#6d7582]">×</button><h1 className="text-4xl font-black">إيداع</h1><button onClick={() => notify("تواصل معنا عبر الاستفسارات")} className="rounded-full bg-[#eef4ff] px-5 py-3 text-xl font-bold text-[#3478db]">استفسارات <span className="text-2xl">◯</span></button></header><div className="flex items-center justify-between bg-white px-8 py-8"><span className="text-3xl">{currentRegion.flag}</span><p className="text-2xl"><span className="font-medium">{currentRegion.title}</span> <span className="text-[#697181]">طرق الد��ع</span></p><button onClick={() => setPicker(true)} className="text-2xl font-bold text-[#3478db]">تغيير</button></div>{region === "egypt" && <section className="grid grid-cols-2 gap-7 px-5 py-8">{methods.map((method) => <button key={method.name} onClick={() => setEgy(method.name)} className={`relative flex min-h-[248px] flex-col items-center justify-center rounded-[34px] border-2 border-[#e2e4e8] bg-[#f1f2f4] px-3 shadow-sm ${method.badge ? "border-[#ff8b27]" : ""}`}>{method.badge && <span className="absolute inset-x-0 top-0 rounded-t-[31px] bg-gradient-to-l from-[#f83f4d] to-[#ff7614] py-2 text-center text-xl font-black text-white">{method.badge}</span>}<span className="mb-7 flex size-28 items-center justify-center rounded-3xl bg-white shadow-sm">{methodImage(method)}</span><span className="text-2xl font-medium">{method.name}</span></button>)}</section>}{region !== "egypt" && <section className="grid grid-cols-2 gap-7 px-5 py-8">{foreign.filter((m) => region === "global" ? globalSlugs.includes(m.slug) : !globalSlugs.includes(m.slug)).map((method) => <button key={method.name} onClick={() => setPick(method)} className={`relative flex min-h-[248px] flex-col items-center justify-center rounded-[34px] border-2 border-[#e2e4e8] bg-[#f1f2f4] px-3 shadow-sm ${method.badge ? "border-[#ff8b27]" : ""}`}>{method.badge && <span className="absolute inset-x-0 top-0 rounded-t-[31px] bg-gradient-to-l from-[#f83f4d] to-[#ff7614] py-2 text-center text-xl font-black text-white">{method.badge}</span>}<span className="mb-7 flex size-28 items-center justify-center rounded-3xl bg-white shadow-sm"><img src={method.src ?? icon(method.slug)} alt={method.name} className="size-20 rounded-2xl object-contain" /></span><span className="text-2xl font-medium">{method.name}</span></button>)}</section>}</div>{picker && <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50" onClick={() => setPicker(false)}><div role="dialog" aria-label="تغيير طرق الدفع" onClick={(e) => e.stopPropagation()} className="w-full max-w-[520px] rounded-t-[34px] bg-white px-5 pb-10 pt-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-3xl font-black">اختر العملة / الدولة</h2><button onClick={() => setPicker(false)} aria-label="إغلاق" className="text-4xl font-light leading-none text-[#6d7582]">×</button></div><div className="flex flex-col gap-3">{regions.map((r) => <button key={r.id} onClick={() => { setRegion(r.id); setPicker(false) }} className={`flex items-center gap-4 rounded-3xl border-2 px-5 py-4 text-right ${region === r.id ? "border-[#ff8b27] bg-[#fff6ee]" : "border-[#e2e4e8] bg-[#f1f2f4]"}`}><span className="flex size-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">{r.flag}</span><span className="flex-1"><span className="block text-2xl font-bold">{r.title}</span><span className="block text-lg text-[#697181]">{r.sub}</span></span>{region === r.id && <span className="text-2xl font-black text-[#20ca5d]">✓</span>}</button>)}</div></div></div>}<DepositNav /></div> }

function DepositNav() { return <nav className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-[520px] -translate-x-1/2 justify-between border-t border-[#25262a] bg-[#171719] px-2 py-3 text-[#a0a1aa]"><span className="flex flex-1 flex-col items-center gap-1 text-xs"><User className="size-7"/>حسابي</span><span className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-[#063b27] py-2 text-xs text-[#20ca5d]"><Wallet className="size-7"/>المحفظة</span><span className="flex flex-1 flex-col items-center gap-1 text-xs"><Bell className="size-7"/>الإشعارات</span><span className="flex flex-1 flex-col items-center gap-1 text-xs"><Trophy className="size-7"/>المسابقات</span><span className="flex flex-1 flex-col items-center gap-1 text-xs"><ReceiptText className="size-7"/>المالية و النسخ</span><span className="flex flex-1 flex-col items-center gap-1 text-xs"><Home className="size-7"/>الرئيسية</span></nav> }

function Forgot({ setScreen }: { setScreen: (s: Screen) => void }) { return <main dir="rtl" className="min-h-screen bg-[#080809] text-white"><section className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-6 py-8"><button onClick={() => setScreen("auth")} className="self-start rounded-full border border-white/10 px-4 py-2 text-white/60">رجوع</button><div className="mt-24 rounded-[28px] border border-white/[.07] bg-[#151516] p-6 text-center"><h1 className="text-3xl font-black">استعادة كلمة المرور</h1><p className="mt-3 text-white/45">أدخل رقم الهاتف أو البريد لإرسال رمز التحقق</p><input aria-label="رقم الهاتف أو البريد الإلكتروني" placeholder="رقم الهاتف أو البريد الإلكتروني" className="mt-8 w-full rounded-2xl border border-white/10 bg-[#0b0b0c] p-4 outline-none focus:border-[#ff9d18]"/><button onClick={() => setScreen("verify")} className="mt-4 w-full rounded-2xl bg-[#ff9d18] py-4 font-black text-black">إرسال رمز التحقق</button></div></section></main> }
