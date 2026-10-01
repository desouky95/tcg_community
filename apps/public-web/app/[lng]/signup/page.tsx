"use client";

import { useState } from "react";
import { AuthField, AuthInput, AuthSelect, AuthShell, Button } from "@tcg/ui-web";

export default function SignupPage() {
  const [pending, setPending] = useState(false);
  return (
    <AuthShell eyebrow="Join the club / 01" title={<>Make room for <em>more.</em></>} description="Build your collector profile, find your people, and give every card a place in the story." asideTitle="Collection starts with a first pull." asideDescription="Bring your binder online and make every swap, want, and discovery count." asideItems={["A profile made for collecting", "Local context, global community", "WhatsApp-first verification"]} footer={<>Already have a vault? <a href="/login" className="font-mono text-utility uppercase text-wax-red hover:underline focus-ring">Sign in</a></>}>
      <form className="grid gap-5 " onSubmit={(event) => { event.preventDefault(); setPending(true); window.location.assign("/verify-otp"); }}>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            ["fullName", "Full name", "text", "Your name"],
            ["username", "Username", "text", "collector_01"],
            ["email", "Email", "email", "hello@nexus.com"],
            ["mobile", "Mobile / WhatsApp", "tel", "+20 10 0000 0000"],
            ["password", "Password", "password", "••••••••"],
            ["passwordConfirmation", "Confirm password", "password", "••••••••"],
          ].map(([id, label, type, placeholder]) => (
            <AuthField id={`signup-${id}`} label={label} key={id}>
              <AuthInput
                id={`signup-${id}`}
                name={id}
                type={type}
                placeholder={placeholder}
                required
                disabled={pending}
              />
            </AuthField>
          ))}
          <AuthField id="signup-governorate" label="Region" className="sm:col-span-2">
            <AuthSelect id="signup-governorate" name="governorate" required disabled={pending}>
              <option value="">Select your governorate</option>
              <option>Cairo</option>
              <option>Alexandria</option>
              <option>Giza</option>
            </AuthSelect>
          </AuthField>
        </div>
        <Button type="submit" loading={pending} className="w-full">Create my profile</Button>
      </form>
    </AuthShell>
  );
}
