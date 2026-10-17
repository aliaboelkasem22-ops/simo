'use client'

import { useState, type FormEvent } from 'react'
import { ArrowUpRight, Check, Mail, MapPin, Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function Page() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <Card className="w-full overflow-hidden border-border/70 bg-card shadow-xl shadow-foreground/5 lg:grid lg:grid-cols-[0.85fr_1.15fr]">
          <section className="relative flex flex-col justify-between overflow-hidden bg-primary p-8 text-primary-foreground sm:p-12 lg:p-14">
            <div className="absolute -right-24 -top-24 size-72 rounded-full border border-primary-foreground/10" />
            <div className="absolute -bottom-36 -left-20 size-80 rounded-full border border-primary-foreground/10" />
            <div className="relative">
              <div className="mb-12 flex size-11 items-center justify-center rounded-full bg-primary-foreground/10 ring-1 ring-primary-foreground/20">
                <Mail aria-hidden="true" className="size-5" />
              </div>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground/60">Get in touch</p>
              <h1 className="max-w-sm text-4xl font-semibold tracking-tight sm:text-5xl">Let&apos;s start a conversation.</h1>
              <p className="mt-6 max-w-sm text-base leading-7 text-primary-foreground/70">Have a question, an idea, or just want to say hello? We&apos;d love to hear from you.</p>
            </div>
            <div className="relative mt-16 flex flex-col gap-5 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-3"><Mail aria-hidden="true" className="size-4" /><span>hello@northstar.studio</span></div>
              <div className="flex items-center gap-3"><MapPin aria-hidden="true" className="size-4" /><span>Brooklyn, New York</span></div>
            </div>
          </section>

          <div>
            <CardHeader className="px-8 pb-0 pt-8 sm:px-12 sm:pt-12">
              <p className="text-sm text-muted-foreground">We usually respond within one business day.</p>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-8 sm:px-12 sm:pb-12">
              {submitted ? (
                <div className="flex min-h-[390px] flex-col items-center justify-center text-center">
                  <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check aria-hidden="true" className="size-6" /></div>
                  <h2 className="text-2xl font-semibold tracking-tight">Message received</h2>
                  <p className="mt-3 max-w-sm text-muted-foreground">Thanks for reaching out. We&apos;ll be in touch soon.</p>
                  <Button className="mt-8" variant="outline" onClick={() => setSubmitted(false)}>Send another message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <FieldGroup>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input id="name" name="name" placeholder="Your name" required />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel htmlFor="subject">Subject</FieldLabel>
                      <Input id="subject" name="subject" placeholder="How can we help?" required />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="message">Message</FieldLabel>
                      <Textarea id="message" name="message" placeholder="Tell us a little more..." className="min-h-36 resize-none" required />
                      <FieldDescription>Give us a few details so we can point you in the right direction.</FieldDescription>
                    </Field>
                  </FieldGroup>
                  <Button type="submit" className="w-full sm:w-fit sm:self-end">
                    Send message <Send data-icon="inline-end" />
                  </Button>
                </form>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
      <a href="#" className="mx-auto mt-6 flex w-fit items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">Prefer email? Say hello <ArrowUpRight aria-hidden="true" /></a>
    </main>
  )
}

