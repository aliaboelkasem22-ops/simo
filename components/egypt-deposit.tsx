"use client"

import { useState, type ReactNode } from "react"
import { Check, ChevronRight, Copy, Tag } from "lucide-react"

const MIN = 97
const MAX = 59000
const CHIPS = [97, 150, 300, 500]

// Replace these with your real receiving wallets and Instapay address before going live.
const RECEIVING: Record<string, { label: string; value: string }> = {
  "Vodafone Cash": { label: "رقم فودافون كاش", value: "01000000001" },
  "Etisalat Cash": { label: "رقم اتصالات كاش", value: "01100000002" },
  "Orange Cash": { label: "رقم أورنج كاش", value: "01200000003" },
  "We Pay": { label: "رقم وي باي", value: "01500000004" },
  "BM Wallet": { label: "رقم محفظة BM", value: "01000000005" },
  "CIB Smart Wallet": { label: "رقم المحفظة الذكية", value: "01000000006" },
  Axispay: { label: "رقم Axispay", value: "01000000007" },
  Instapay: { label: "عنوان انستاباي", value: "skillwin@instapay" },
}

const money = (n: number) => `E£${n.toLocaleString("en-US")}`

type Props = {
  name: string
  logo: ReactNode
  nav: ReactNode
  close: () => void
  back: () => void
  notify: (m: string) => void
}

export function EgyptDeposit({ name, logo, nav, close, back, notify }: Props) {
  const isInstapay = name === "Instapay"
  const receiving = RECEIVING[name] ?? RECEIVING["Vodafone Cash"]

  const [step, setStep] = useState<"amount" | "pay" | "done">("amount")
  const [sender, setSender] = useState("")
  const [unit, setUnit] = useState<"egp" | "coins">("egp")
  const [amount, setAmount] = useState("")
  const [promoOpen, setPromoOpen] = useState(false)
  const [promo, setPromo] = useState("")
  const [promoError, setPromoError] = useState(false)
  const [reference, setReference] = useState("")
  const [requestId, setRequestId] = useState("")

  const value = Number(amount) || 0
  const senderValid = isInstapay ? sender.trim().length >= 3 : /^01[0125]\d{8}$/.test(sender)
  const amountValid = value >= MIN && value <= MAX
  const canContinue = senderValid && amountValid
  const referenceValid = reference.trim().length >= 6

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      notify(`تم نسخ ${label}`)
    } catch {
      notify("تعذر النسخ، انسخ يدويًا")
    }
  }

  const submit = () => {
    setRequestId(`EG-${Date.now().toString().slice(-8)}`)
    setStep("done")
  }

  const applyPromo = () => {
    if (!promo.trim()) return
    setPromoError(true)
  }

  return (
    <div dir="rtl" className="fixed inset-0 z-40 overflow-y-auto bg-[#f7f8fb] text-[#172033]">
      <div className="mx-auto flex min-h-full w-full max-w-[520px] flex-col pb-28">
        <header className="sticky top-0 z-10 flex h-[122px] shrink-0 items-end justify-between border-b border-[#e1e4ea] bg-white px-5 pb-5">
          <button onClick={close} aria-label="إغلاق الإيداع" className="text-5xl font-light leading-none text-[#6d7582]">×</button>
          <h1 className="text-4xl font-black">إيداع</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => notify("تواصل معنا عبر الاستفسارات")} className="rounded-full bg-[#eef4ff] px-5 py-3 text-xl font-bold text-[#3478db]">استفسارات <span className="text-2xl">◯</span></button>
            <button onClick={step === "pay" ? () => setStep("amount") : back} className="flex items-center gap-1 text-2xl font-medium text-[#3478db]">
              <ChevronRight className="size-6" aria-hidden="true" />رجوع
            </button>
          </div>
        </header>

        <div className="flex flex-1 flex-col px-5">
          <div className="flex items-center justify-center gap-5 py-8">
            <span className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm [&_img]:size-14 [&_svg]:size-14">{logo}</span>
            <h2 className="text-4xl font-black">{name}</h2>
          </div>

          {step === "amount" && (
            <>
              <section className="rounded-[34px] border-2 border-[#e2e4e8] bg-white px-6 py-6">
                <label htmlFor="sender" className="block text-2xl font-medium text-[#3a4252]">
                  {isInstapay ? "عنوان انستاباي الذي ستحول منه" : "رقم محفظتك التي ستحول منها"}
                </label>
                <input
                  id="sender"
                  dir="ltr"
                  inputMode={isInstapay ? "text" : "numeric"}
                  maxLength={isInstapay ? 40 : 11}
                  value={sender}
                  onChange={(e) => setSender(isInstapay ? e.target.value : e.target.value.replace(/\D/g, ""))}
                  placeholder={isInstapay ? "name@instapay" : "01xxxxxxxxx"}
                  aria-invalid={sender.length > 0 && !senderValid}
                  className="mt-4 h-[68px] w-full rounded-[22px] border-2 border-[#e2e4e8] bg-[#f7f8fb] px-5 text-left text-3xl font-bold outline-none focus:border-[#20ca5d]"
                />
                {sender.length > 0 && !senderValid && (
                  <p role="alert" className="mt-2 text-lg text-[#e5484d]">{isInstapay ? "أدخل عنوان انستاباي صحيح" : "أدخل رقم محفظة مصري صحيح من 11 رقم"}</p>
                )}
              </section>

              <section className="mt-6 rounded-[34px] border-2 border-[#e2e4e8] bg-white px-6 py-6">
                <div className="flex items-center justify-between">
                  <div role="tablist" aria-label="وحدة المبلغ" className="flex rounded-full bg-[#f1f2f4] p-1.5">
                    <button role="tab" aria-selected={unit === "egp"} onClick={() => setUnit("egp")} className={`rounded-full px-6 py-3 text-xl font-bold ${unit === "egp" ? "bg-[#20ca5d] text-white" : "text-[#6d7582]"}`}>جنيه</button>
                    <button role="tab" aria-selected={unit === "coins"} onClick={() => setUnit("coins")} className={`rounded-full px-6 py-3 text-xl font-bold ${unit === "coins" ? "bg-[#20ca5d] text-white" : "text-[#6d7582]"}`}>عملات</button>
                  </div>
                  <label htmlFor="amount" className="text-2xl font-medium text-[#3a4252]">{unit === "egp" ? "المبلغ بالجنيه" : "المبلغ بالعملات"}</label>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <input
                    id="amount"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder={unit === "egp" ? "أدخل المبلغ بالجنيه" : "أدخل عدد العملات"}
                    aria-invalid={amount.length > 0 && !amountValid}
                    className="h-[68px] min-w-0 flex-1 rounded-[22px] border-2 border-[#e2e4e8] bg-[#f7f8fb] px-5 text-2xl font-bold outline-none placeholder:font-medium placeholder:text-[#a2a8b4] focus:border-[#20ca5d]"
                  />
                  <span className="flex size-[68px] shrink-0 items-center justify-center rounded-[22px] bg-[#ef4444] text-2xl font-black text-white" aria-hidden="true">£E</span>
                </div>
                <p className={`mt-3 text-lg ${amount.length > 0 && !amountValid ? "text-[#e5484d]" : "text-[#8a91a0]"}`}>
                  الحد الأدنى {money(MIN)} - الأقصى {money(MAX)}
                </p>
                {unit === "coins" && <p className="mt-1 text-base text-[#8a91a0]">كل 1 جنيه = 1 عملة</p>}
              </section>

              <div className="mt-6 grid grid-cols-4 gap-3">
                {CHIPS.slice().reverse().map((chip) => (
                  <button key={chip} onClick={() => setAmount(String(chip))} className={`h-[78px] rounded-[22px] border-2 bg-white text-2xl font-black ${value === chip ? "border-[#20ca5d] text-[#16a34a]" : "border-[#e2e4e8]"}`}>
                    {money(chip)}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <button onClick={() => { setPromoOpen((o) => !o); setPromoError(false) }} className="flex items-center gap-2 text-2xl font-bold text-[#16a34a]">
                  <Tag className="size-6" aria-hidden="true" />لديك كود خصم؟
                </button>
                {promoOpen && (
                  <div className="mt-4 flex gap-3">
                    <input
                      aria-label="كود الخصم"
                      value={promo}
                      onChange={(e) => { setPromo(e.target.value.toUpperCase()); setPromoError(false) }}
                      placeholder="أدخل كود الخصم"
                      className="h-14 min-w-0 flex-1 rounded-2xl border-2 border-[#e2e4e8] bg-white px-4 text-xl outline-none focus:border-[#20ca5d]"
                    />
                    <button onClick={applyPromo} className="h-14 rounded-2xl bg-[#172033] px-6 text-xl font-bold text-white">تطبيق</button>
                  </div>
                )}
                {promoError && <p role="alert" className="mt-2 text-lg text-[#e5484d]">كود الخصم غير صالح أو منتهي</p>}
              </div>
            </>
          )}

          {step === "pay" && (
            <section className="rounded-[34px] border-2 border-[#e2e4e8] bg-white px-6 py-6">
              <p className="text-2xl font-bold">حوّل المبلغ التالي</p>
              <p className="mt-2 text-5xl font-black text-[#16a34a]">{money(value)}</p>

              <div className="mt-6 rounded-[22px] bg-[#f7f8fb] p-5">
                <p className="text-lg text-[#697181]">{receiving.label}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p dir="ltr" className="text-3xl font-black">{receiving.value}</p>
                  <button onClick={() => copy(receiving.value, receiving.label)} aria-label={`نسخ ${receiving.label}`} className="flex items-center gap-2 rounded-full bg-[#172033] px-5 py-3 text-lg font-bold text-white">
                    <Copy className="size-5" aria-hidden="true" />نسخ
                  </button>
                </div>
              </div>

              <ol className="mt-6 space-y-3 text-xl text-[#3a4252]">
                <li>1. افتح {isInstapay ? "تطبيق انستاباي" : `محفظة ${name}`} من حسابك المسجل ({sender}).</li>
                <li>2. حوّل مبلغ {money(value)} بالضبط إلى {isInstapay ? "العنوان" : "الرقم"} أعلاه.</li>
                <li>3. انسخ رقم العملية من رسالة التأكيد وأدخله بالأسفل.</li>
              </ol>

              <label htmlFor="reference" className="mt-6 block text-2xl font-medium text-[#3a4252]">رقم العملية</label>
              <input
                id="reference"
                dir="ltr"
                value={reference}
                onChange={(e) => setReference(e.target.value.replace(/\s/g, ""))}
                placeholder="مثال: 123456789012"
                className="mt-3 h-[68px] w-full rounded-[22px] border-2 border-[#e2e4e8] bg-[#f7f8fb] px-5 text-left text-2xl font-bold outline-none focus:border-[#20ca5d]"
              />
            </section>
          )}

          {step === "done" && (
            <section className="rounded-[34px] border-2 border-[#e2e4e8] bg-white px-6 py-10 text-center">
              <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#e6f9ed] text-[#16a34a]"><Check className="size-10" aria-hidden="true" /></span>
              <h3 className="mt-5 text-3xl font-black">تم استلام طلب الإيداع</h3>
              <p className="mt-3 text-xl text-[#697181]">سيتم مراجعة التحويل وإضافة {money(value)} إلى رصيدك خلال دقائق.</p>
              <p className="mt-6 text-lg text-[#697181]">رقم الطلب</p>
              <p dir="ltr" className="text-2xl font-black">{requestId}</p>
            </section>
          )}

          <div className="flex-1" />
        </div>

        <div className="mt-6 shrink-0 border-t border-[#e1e4ea] bg-white px-5 py-5">
          {step === "amount" && (
            <button disabled={!canContinue} onClick={() => setStep("pay")} className="h-[88px] w-full rounded-[26px] bg-[#20ca5d] text-3xl font-black text-white disabled:bg-[#e6e7eb] disabled:text-[#a2a8b4]">متابعة الإيداع</button>
          )}
          {step === "pay" && (
            <button disabled={!referenceValid} onClick={submit} className="h-[88px] w-full rounded-[26px] bg-[#20ca5d] text-3xl font-black text-white disabled:bg-[#e6e7eb] disabled:text-[#a2a8b4]">تأكيد التحويل</button>
          )}
          {step === "done" && (
            <button onClick={close} className="h-[88px] w-full rounded-[26px] bg-[#172033] text-3xl font-black text-white">العودة للمحفظة</button>
          )}
        </div>
      </div>
      {nav}
    </div>
  )
}
