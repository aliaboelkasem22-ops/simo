"use client"

import { useEffect, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { ArrowRight, Check, Clock, Copy, ShieldCheck, TriangleAlert, Upload, X } from "lucide-react"

export type ForeignMethod = { name: string; slug: string; src?: string }

type Network = { id: string; label: string; address: string; fee: number; confirmations: number }
type Config =
  | { kind: "crypto"; unit: string; stable?: boolean; min: number; networks: Network[] }
  | { kind: "exchange" | "wallet"; unit: string; min: number; label: string; value: string; steps: string[] }
  | { kind: "card"; unit: string; min: number }

const USD_TO_EGP = 50
const LOCK_SECONDS = 30 * 60

// Replace every address and account below with your real receiving details before going live.
const CONFIG: Record<string, Config> = {
  "USDT (Tether)": {
    kind: "crypto", unit: "USDT", stable: true, min: 10,
    networks: [
      { id: "trc20", label: "TRON (TRC20)", address: "TXk9mQ7vLr3ZpYw2NcB8aHdF5eJtUg4R1s", fee: 1, confirmations: 20 },
      { id: "bep20", label: "BNB Smart Chain (BEP20)", address: "0x8f3C2a91bE7d4A6c05F1d9b27E3a4c8D6b1F20e7", fee: 0.5, confirmations: 15 },
      { id: "erc20", label: "Ethereum (ERC20)", address: "0x4Be1a7C93d02F85e6A1c7bD40f9E2a3586c1D7f9", fee: 3, confirmations: 12 },
    ],
  },
  Bitcoin: { kind: "crypto", unit: "BTC", min: 20, networks: [{ id: "btc", label: "Bitcoin", address: "bc1qx7m4r8k2vw9ht5d3ule6p0zn8c4a7jf2gq5s9t", fee: 2, confirmations: 2 }] },
  Ethereum: { kind: "crypto", unit: "ETH", min: 20, networks: [{ id: "eth", label: "Ethereum (ERC20)", address: "0x4Be1a7C93d02F85e6A1c7bD40f9E2a3586c1D7f9", fee: 2, confirmations: 12 }] },
  "BNB Chain": { kind: "crypto", unit: "BNB", min: 10, networks: [{ id: "bsc", label: "BNB Smart Chain (BEP20)", address: "0x8f3C2a91bE7d4A6c05F1d9b27E3a4c8D6b1F20e7", fee: 0.5, confirmations: 15 }] },
  "Tron (TRX)": { kind: "crypto", unit: "TRX", min: 10, networks: [{ id: "trx", label: "TRON (TRC20)", address: "TXk9mQ7vLr3ZpYw2NcB8aHdF5eJtUg4R1s", fee: 1, confirmations: 20 }] },
  Litecoin: { kind: "crypto", unit: "LTC", min: 10, networks: [{ id: "ltc", label: "Litecoin", address: "ltc1q5w3n7e0r4t8y2u6i9o1p3a5s7d9f2g4h6j8k0l", fee: 0.5, confirmations: 6 }] },
  Solana: { kind: "crypto", unit: "SOL", min: 10, networks: [{ id: "sol", label: "Solana", address: "7Hq3WvB9nXs2KdE5mRfT8yLc4PzA6uJgN1oVb3xCk9Dr", fee: 0.5, confirmations: 32 }] },
  Dogecoin: { kind: "crypto", unit: "DOGE", min: 10, networks: [{ id: "doge", label: "Dogecoin", address: "DH5yTq8Lw3nRv2KsE7mXc9PzA4uJgB6oN1", fee: 0.5, confirmations: 40 }] },
  Binance: { kind: "exchange", unit: "USDT", min: 5, label: "Binance Pay ID", value: "482910356", steps: ["افتح تطبيق Binance ثم Pay", "اختر إرسال وأدخل Pay ID أعلاه", "أرسل المبلغ المطلوب بعملة USDT", "انسخ رقم العملية (Order ID) من الإيصال"] },
  Coinbase: { kind: "exchange", unit: "USDC", min: 10, label: "بريد حساب Coinbase", value: "pay@skillwin-eg.com", steps: ["افتح Coinbase ثم Send", "أدخل البريد الإلكتروني أعلاه", "أرسل المبلغ بعملة USDC", "انسخ رقم العملية من سجل المعاملات"] },
  OKX: { kind: "exchange", unit: "USDT", min: 10, label: "OKX UID", value: "6391847205", steps: ["افتح OKX ثم Transfer", "اختر التحويل الداخلي عبر UID", "أرسل المبلغ بعملة USDT", "انسخ رقم العملية من السجل"] },
  Bybit: { kind: "exchange", unit: "USDT", min: 10, label: "Bybit UID", value: "208473915", steps: ["افتح Bybit ثم Assets", "اختر Transfer ثم Internal Transfer", "أدخل UID وأرسل المبلغ بعملة USDT", "انسخ رقم العملية من السجل"] },
  PayPal: { kind: "wallet", unit: "USD", min: 5, label: "حساب PayPal", value: "pay@skillwin-eg.com", steps: ["افتح PayPal ثم Send", "اختر Friends and Family", "أدخل البريد أعلاه والمبلغ بالدولار", "انسخ رقم العملية من الإيصال"] },
  Skrill: { kind: "wallet", unit: "USD", min: 5, label: "حساب Skrill", value: "pay@skillwin-eg.com", steps: ["افتح Skrill ثم Send Money", "أدخل البريد أعلاه", "أرسل المبلغ بالدولار", "انسخ رقم العملية من السجل"] },
  Neteller: { kind: "wallet", unit: "USD", min: 5, label: "حساب Neteller", value: "pay@skillwin-eg.com", steps: ["افتح Neteller ثم Send Money", "أدخل البريد أعلاه", "أرسل المبلغ بالدولار", "انسخ رقم العملية من السجل"] },
  Visa: { kind: "card", unit: "USD", min: 5 },
  Mastercard: { kind: "card", unit: "USD", min: 5 },
}

const CHIPS = [10, 25, 50, 100, 500]
const STEP_LABELS = ["المبلغ", "التحويل", "التأكيد"]

function formatTime(total: number) {
  const m = Math.floor(total / 60).toString().padStart(2, "0")
  const s = (total % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

export function ForeignDeposit({ method, close, back, notify }: { method: ForeignMethod; close: () => void; back: () => void; notify: (m: string) => void }) {
  const config = CONFIG[method.name]
  const [step, setStep] = useState<"amount" | "pay" | "confirm" | "done">("amount")
  const [amount, setAmount] = useState("")
  const [networkId, setNetworkId] = useState(config.kind === "crypto" ? config.networks[0].id : "")
  const [seconds, setSeconds] = useState(LOCK_SECONDS)
  const [reference, setReference] = useState("")
  const [senderAccount, setSenderAccount] = useState("")
  const [proofName, setProofName] = useState("")
  const [requestId, setRequestId] = useState("")

  const network = config.kind === "crypto" ? config.networks.find((n) => n.id === networkId) ?? config.networks[0] : null
  const value = Number(amount) || 0
  const fee = network?.fee ?? 0
  const credited = Math.max(value - fee, 0) * USD_TO_EGP
  const valid = value >= config.min
  const expired = seconds <= 0
  const stepIndex = step === "amount" ? 0 : step === "pay" ? 1 : 2

  useEffect(() => {
    if (step !== "pay") return
    const id = setInterval(() => setSeconds((s) => Math.max(s - 1, 0)), 1000)
    return () => clearInterval(id)
  }, [step])

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      notify(`تم نسخ ${label}`)
    } catch {
      notify("تعذر النسخ، انسخ يدويًا")
    }
  }

  const submit = () => {
    setRequestId(`DP-${Date.now().toString().slice(-8)}`)
    setStep("done")
  }

  const goBack = () => {
    if (step === "amount") back()
    else if (step === "pay") setStep("amount")
    else if (step === "confirm") setStep("pay")
  }

  const sendLabel = config.kind === "crypto" && !config.stable ? `ما قيمته ${value} $ من ${config.unit}` : `${value} ${config.unit}`
  const refValid = reference.trim().length >= (config.kind === "crypto" ? 10 : 6)

  return (
    <div dir="rtl" className="fixed inset-0 z-40 overflow-y-auto bg-[#f7f8fb] text-[#172033]">
      <div className="mx-auto min-h-full w-full max-w-[520px] pb-10">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#e1e4ea] bg-white px-4">
          {step === "done" ? <span className="size-10" /> : (
            <button onClick={goBack} aria-label="رجوع" className="flex size-10 items-center justify-center rounded-full text-[#3478db] hover:bg-[#eef4ff]"><ArrowRight className="size-6" /></button>
          )}
          <h1 className="text-lg font-black">إيداع عبر {method.name}</h1>
          <button onClick={close} aria-label="إغلاق" className="flex size-10 items-center justify-center rounded-full text-[#6d7582] hover:bg-[#f1f2f4]"><X className="size-6" /></button>
        </header>

        {step !== "done" && (
          <ol className="flex items-center gap-2 bg-white px-5 py-4" aria-label="خطوات الإيداع">
            {STEP_LABELS.map((label, i) => (
              <li key={label} className="flex flex-1 flex-col gap-2">
                <span className={`h-1.5 rounded-full ${i <= stepIndex ? "bg-[#ff7614]" : "bg-[#e2e4e8]"}`} />
                <span className={`text-xs font-bold ${i <= stepIndex ? "text-[#172033]" : "text-[#9aa1ad]"}`}>{i + 1}. {label}</span>
              </li>
            ))}
          </ol>
        )}

        <div className="flex flex-col gap-4 px-4 py-5">
          <div className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[#f1f2f4]">
              <img src={method.src ?? `https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/${method.slug}/default.svg`} alt={method.name} className="size-11 object-contain" />
            </span>
            <div className="min-w-0">
              <p className="font-black">{method.name}</p>
              <p className="text-sm text-[#697181]">الحد الأدنى {config.min} $ · 1 $ = {USD_TO_EGP} ج.م</p>
            </div>
          </div>

          {step === "amount" && (
            <>
              {config.kind === "crypto" && config.networks.length > 1 && (
                <section className="rounded-3xl bg-white p-4 shadow-sm">
                  <h2 className="mb-3 text-sm font-black">اختر الشبكة</h2>
                  <div className="flex flex-col gap-2" role="radiogroup" aria-label="الشبكة">
                    {config.networks.map((n) => (
                      <button key={n.id} role="radio" aria-checked={n.id === networkId} onClick={() => setNetworkId(n.id)} className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-start ${n.id === networkId ? "border-[#ff7614] bg-[#fff6ef]" : "border-[#e2e4e8] bg-[#f7f8fb]"}`}>
                        <span className="font-bold">{n.label}</span>
                        <span className="text-xs text-[#697181]">رسوم {n.fee} $</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section className="rounded-3xl bg-white p-4 shadow-sm">
                <label htmlFor="fx-amount" className="mb-3 block text-sm font-black">المبلغ بالدولار</label>
                <div className="flex items-center rounded-2xl border-2 border-[#e2e4e8] bg-[#f7f8fb] px-4 focus-within:border-[#ff7614]">
                  <span className="text-xl font-black text-[#697181]">$</span>
                  <input id="fx-amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0.00" className="w-full bg-transparent px-3 py-4 text-2xl font-black outline-none" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CHIPS.map((c) => (
                    <button key={c} onClick={() => setAmount(String(c))} className={`rounded-full border px-4 py-2 text-sm font-bold ${Number(amount) === c ? "border-[#ff7614] bg-[#fff6ef] text-[#ff7614]" : "border-[#e2e4e8] bg-white"}`}>{c} $</button>
                  ))}
                </div>
                {amount && !valid && <p className="mt-3 text-sm font-bold text-[#e5484d]">الحد الأدنى للإيداع {config.min} $</p>}
              </section>

              <section className="rounded-3xl bg-white p-4 shadow-sm">
                <dl className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between"><dt className="text-[#697181]">المبلغ</dt><dd className="font-bold">{value.toFixed(2)} $</dd></div>
                  <div className="flex justify-between"><dt className="text-[#697181]">رسوم الشبكة</dt><dd className="font-bold">{fee.toFixed(2)} $</dd></div>
                  <div className="flex justify-between border-t border-[#e8eaef] pt-3"><dt className="font-black">سيضاف إلى رصيدك</dt><dd className="text-lg font-black text-[#18a957]">{credited.toLocaleString("en-US", { maximumFractionDigits: 0 })} ج.م</dd></div>
                </dl>
              </section>

              <button disabled={!valid} onClick={() => { setSeconds(LOCK_SECONDS); setStep(config.kind === "card" ? "confirm" : "pay") }} className="rounded-2xl bg-gradient-to-l from-[#f83f4d] to-[#ff7614] py-4 text-lg font-black text-white shadow-lg disabled:opacity-40">متابعة</button>
            </>
          )}

          {step === "pay" && (
            <>
              <div className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold ${expired ? "bg-[#fdecec] text-[#e5484d]" : "bg-[#fff6ef] text-[#c2570c]"}`}>
                <span className="flex items-center gap-2"><Clock className="size-4" />{expired ? "انتهت مهلة تثبيت السعر" : "مهلة تثبيت السعر"}</span>
                <span className="font-mono text-base tabular-nums">{formatTime(seconds)}</span>
              </div>

              <section className="rounded-3xl bg-white p-5 text-center shadow-sm">
                <p className="text-sm text-[#697181]">أرسل بالضبط</p>
                <p className="mt-1 text-2xl font-black text-[#ff7614]">{sendLabel}</p>
                {network && <p className="mt-1 text-sm font-bold">عبر شبكة {network.label}</p>}

                {config.kind === "crypto" && network && (
                  <>
                    <div className="mx-auto mt-5 w-fit rounded-2xl border border-[#e2e4e8] bg-white p-3">
                      <QRCodeSVG value={network.address} size={176} level="M" title={`عنوان ${method.name}`} />
                    </div>
                    <p className="mt-5 text-start text-xs font-bold text-[#697181]">عنوان المحفظة</p>
                    <div className="mt-2 flex items-center gap-2 rounded-2xl bg-[#f1f2f4] p-3">
                      <code dir="ltr" className="min-w-0 flex-1 break-all text-start text-sm font-bold">{network.address}</code>
                      <button onClick={() => copy(network.address, "العنوان")} aria-label="نسخ العنوان" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm"><Copy className="size-5" /></button>
                    </div>
                  </>
                )}

                {(config.kind === "exchange" || config.kind === "wallet") && (
                  <>
                    <p className="mt-5 text-start text-xs font-bold text-[#697181]">{config.label}</p>
                    <div className="mt-2 flex items-center gap-2 rounded-2xl bg-[#f1f2f4] p-3">
                      <code dir="ltr" className="min-w-0 flex-1 break-all text-start text-base font-bold">{config.value}</code>
                      <button onClick={() => copy(config.value, config.label)} aria-label={`نسخ ${config.label}`} className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm"><Copy className="size-5" /></button>
                    </div>
                    <ol className="mt-5 flex flex-col gap-3 text-start text-sm">
                      {config.steps.map((s, i) => (
                        <li key={s} className="flex items-start gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#fff6ef] text-xs font-black text-[#ff7614]">{i + 1}</span><span>{s}</span></li>
                      ))}
                    </ol>
                  </>
                )}
              </section>

              {network && (
                <div className="flex items-start gap-3 rounded-2xl bg-[#fff8e6] p-4 text-sm text-[#7a5b00]">
                  <TriangleAlert className="mt-0.5 size-5 shrink-0" />
                  <p>أرسل {config.unit} فقط عبر شبكة {network.label}. التحويل بعملة أو شبكة مختلفة يؤدي إلى فقدان الأموال. يتطلب الإيداع {network.confirmations} تأكيدًا على الشبكة.</p>
                </div>
              )}

              {expired ? (
                <button onClick={() => { setSeconds(LOCK_SECONDS); setStep("amount") }} className="rounded-2xl border-2 border-[#ff7614] py-4 text-lg font-black text-[#ff7614]">تحديث السعر والبدء من جديد</button>
              ) : (
                <button onClick={() => setStep("confirm")} className="rounded-2xl bg-gradient-to-l from-[#f83f4d] to-[#ff7614] py-4 text-lg font-black text-white shadow-lg">لقد قمت بالتحويل</button>
              )}
            </>
          )}

          {step === "confirm" && config.kind === "card" && (
            <>
              <section className="flex flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center shadow-sm">
                <ShieldCheck className="size-12 text-[#18a957]" />
                <h2 className="text-lg font-black">الدفع بالبطاقة عبر بوابة آمنة</h2>
                <p className="text-sm text-[#697181]">سيتم تحويلك إلى صفحة الدفع المشفرة لإدخال بيانات بطاقتك. لا يتم حفظ أرقام البطاقات على خوادمنا.</p>
                <p className="text-2xl font-black text-[#ff7614]">{value.toFixed(2)} $</p>
              </section>
              <button onClick={() => notify("بوابة الدفع بالبطاقات غير مفعلة بعد")} className="rounded-2xl bg-gradient-to-l from-[#f83f4d] to-[#ff7614] py-4 text-lg font-black text-white shadow-lg">متابعة إلى بوابة الدفع</button>
            </>
          )}

          {step === "confirm" && config.kind !== "card" && (
            <>
              <section className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm">
                <div>
                  <label htmlFor="fx-ref" className="mb-2 block text-sm font-black">{config.kind === "crypto" ? "رقم العملية (TXID)" : "رقم العملية"}</label>
                  <input id="fx-ref" dir="ltr" value={reference} onChange={(e) => setReference(e.target.value)} placeholder={config.kind === "crypto" ? "الصق هاش العملية هنا" : "مثال: 8AB12345CD678901E"} className="w-full rounded-2xl border-2 border-[#e2e4e8] bg-[#f7f8fb] px-4 py-3 text-start font-bold outline-none focus:border-[#ff7614]" />
                </div>
                {config.kind !== "crypto" && (
                  <div>
                    <label htmlFor="fx-sender" className="mb-2 block text-sm font-black">حسابك المرسل منه (اختياري)</label>
                    <input id="fx-sender" dir="ltr" value={senderAccount} onChange={(e) => setSenderAccount(e.target.value)} placeholder="email@example.com" className="w-full rounded-2xl border-2 border-[#e2e4e8] bg-[#f7f8fb] px-4 py-3 text-start font-bold outline-none focus:border-[#ff7614]" />
                  </div>
                )}
                <div>
                  <span className="mb-2 block text-sm font-black">إثبات التحويل (اختياري)</span>
                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-[#cfd3db] bg-[#f7f8fb] px-4 py-4 text-sm font-bold text-[#697181]">
                    <Upload className="size-5" />
                    <span className="truncate">{proofName || "ارفع لقطة شاشة للإيصال"}</span>
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => setProofName(e.target.files?.[0]?.name ?? "")} />
                  </label>
                </div>
              </section>
              <button disabled={!refValid} onClick={submit} className="rounded-2xl bg-gradient-to-l from-[#f83f4d] to-[#ff7614] py-4 text-lg font-black text-white shadow-lg disabled:opacity-40">إرسال طلب الإيداع</button>
            </>
          )}

          {step === "done" && (
            <section className="flex flex-col items-center gap-4 rounded-3xl bg-white p-8 text-center shadow-sm">
              <span className="flex size-20 items-center justify-center rounded-full bg-[#e8f8ef] text-[#18a957]"><Check className="size-10" strokeWidth={3} /></span>
              <h2 className="text-xl font-black">تم استلام طلب الإيداع</h2>
              <p className="text-sm text-[#697181]">سيتم مراجعة التحويل وإضافة الرصيد إلى محفظتك بعد التأكد من وصوله.</p>
              <dl className="mt-2 flex w-full flex-col gap-3 rounded-2xl bg-[#f7f8fb] p-4 text-sm">
                <div className="flex justify-between"><dt className="text-[#697181]">رقم الطلب</dt><dd className="font-mono font-bold">{requestId}</dd></div>
                <div className="flex justify-between"><dt className="text-[#697181]">الوسيلة</dt><dd className="font-bold">{method.name}</dd></div>
                <div className="flex justify-between"><dt className="text-[#697181]">المبلغ</dt><dd className="font-bold">{value.toFixed(2)} $</dd></div>
                <div className="flex justify-between"><dt className="text-[#697181]">الرصيد المتوقع</dt><dd className="font-bold text-[#18a957]">{credited.toLocaleString("en-US", { maximumFractionDigits: 0 })} ج.م</dd></div>
                <div className="flex justify-between"><dt className="text-[#697181]">الحالة</dt><dd className="rounded-full bg-[#fff6ef] px-3 py-1 text-xs font-black text-[#c2570c]">قيد المراجعة</dd></div>
              </dl>
              <button onClick={close} className="mt-2 w-full rounded-2xl bg-gradient-to-l from-[#f83f4d] to-[#ff7614] py-4 text-lg font-black text-white shadow-lg">العودة إلى المحفظة</button>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
