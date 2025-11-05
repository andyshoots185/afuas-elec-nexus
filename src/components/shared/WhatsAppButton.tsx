import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from "react";

/*
  Floating WhatsApp button:
  - Positioned above the bottom navigation on mobile using safe-area inset
  - Minimum touch area >= 44px
  - Compact icon, accessible label
  - High z-index so it doesn't get covered
*/

const PHONE_NUMBER = "256745187279"; // replace with your number (international, no + or dashes)
const MESSAGE = encodeURIComponent("Hi, I have a question about my order.");

export default function WhatsAppButton(): JSX.Element {
  const href = `https://wa.me/${PHONE_NUMBER}?text=${MESSAGE}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed right-4 z-50"
      // place above mobile bottom nav: safe-area + offset (adjust offset if bottom-nav height changes)
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 64px)",
        // ensure minimum touch target and visually consistent size
        width: 48,
        height: 48,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 9999,
        background: "linear-gradient(180deg,#10b981,#059669)", // green-ish, adjust to theme if needed
        color: "white",
        boxShadow: "0 6px 18px rgba(2,6,23,0.16)",
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path d="M21 15.5a4.5 4.5 0 0 1-3.2 4.4l-.7.2-.9.2c-2 .4-5.1-.6-8.3-3.8C5 14.5 4 11.4 4.4 9.4l.2-.9L4.7 7A4.5 4.5 0 0 1 9.5 3h.1c2.2 0 3.6 1 4.5 1.9.9.9 1.9 2.4 1.9 4.5 0 .1 0 .1 0 .2a4.5 4.5 0 0 1-1.9 3.6z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 12.5c-.1.3-.6.6-1 .8s-1 .1-1.5 0a6.6 6.6 0 0 1-1.6-.8 2.6 2.6 0 0 0-1-.6c-.4 0-.8 0-1 .1-.2.1-.6.3-.9.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  );
}
