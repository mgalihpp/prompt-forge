import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"
import styles from "./forgy.module.css"

export type ForgyState =
  | "idle"
  | "busy"
  | "thinking"
  | "success"
  | "error"

// Forgy, the Prompt Smith. A single self-contained SVG mascot whose
// expression + animation are driven entirely by the `state` prop, mirroring
// the assistant's chat status. Ported from forgy-mascot.html; the demo
// chrome (title/buttons/label) is intentionally dropped.
export function Forgy({
  state = "idle",
  waving = false,
  className,
}: {
  state?: ForgyState
  /** Play the one-shot wave gesture (only visible in the idle pose). */
  waving?: boolean
  className?: string
}) {
  return (
    <svg
      className={cn(styles.root, styles[state], waving && styles.wave, className)}
      viewBox="0 0 200 220"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Forgy — ${state}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="floorGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="coreGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#99f6e4" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
        <linearGradient id="coreGradDim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a5a45" />
          <stop offset="100%" stopColor="#5c3a30" />
        </linearGradient>
        <linearGradient id="metalGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#525A6E" />
          <stop offset="100%" stopColor="#2E3342" />
        </linearGradient>
        <linearGradient id="ingotGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#99f6e4" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
        <filter id="eyeGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse className={styles.floorGlow} cx="100" cy="196" rx="58" ry="10" />

      {/* ================= HOLOGRAM (thinking) ================= */}
      <g className={styles.holoGroup}>
        <rect
          x="126"
          y="26"
          width="58"
          height="42"
          rx="6"
          fill="#1B2A33"
          stroke="#6FE3FF"
          strokeOpacity="0.7"
          strokeWidth="1"
        />
        <line x1="132" y1="36" x2="178" y2="36" stroke="#6FE3FF" strokeWidth="1.4" opacity="0.85" />
        <line x1="132" y1="44" x2="168" y2="44" stroke="#6FE3FF" strokeWidth="1.4" opacity="0.6" />
        <line x1="132" y1="52" x2="172" y2="52" stroke="#6FE3FF" strokeWidth="1.4" opacity="0.75" />
        <circle cx="140" cy="60" r="2.4" fill="#6FE3FF" />
        <circle cx="150" cy="60" r="2.4" fill="#6FE3FF" opacity="0.6" />
        <circle cx="160" cy="60" r="2.4" fill="#6FE3FF" opacity="0.4" />
      </g>

      {/* ================= ROBOT BODY ================= */}
      <g className={styles.botGroup}>
        {/* antenna */}
        <line
          x1="100"
          y1="32"
          x2="100"
          y2="16"
          stroke="var(--metal-light)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle className={styles.antennaBulb} cx="100" cy="12" r="5" />

        {/* BMO-style body: one single rounded box, screen on the front */}
        <rect
          x="56"
          y="32"
          width="88"
          height="122"
          rx="24"
          fill="url(#metalGrad)"
          stroke="#20232C"
          strokeWidth="2"
        />

        {/* screen glare */}
        <rect x="74" y="52" width="26" height="6" rx="3" fill="#ffffff" opacity="0.12" />

        {/* visor / screen */}
        <rect x="68" y="48" width="64" height="48" rx="14" fill="var(--panel)" />

        {/* FACE: idle */}
        <g className={styles.faceIdle}>
          <circle className={cn(styles.eye, styles.canBlink)} cx="88" cy="70" r="6" />
          <circle className={cn(styles.eye, styles.canBlink)} cx="112" cy="70" r="6" />
        </g>

        {/* FACE: busy (focused, narrowed) */}
        <g className={styles.faceBusy}>
          <rect
            className={styles.canBlink}
            x="82"
            y="67"
            width="12"
            height="6"
            rx="3"
            fill="var(--ember-hot)"
            filter="url(#eyeGlow)"
          />
          <rect
            className={styles.canBlink}
            x="106"
            y="67"
            width="12"
            height="6"
            rx="3"
            fill="var(--ember-hot)"
            filter="url(#eyeGlow)"
          />
        </g>

        {/* FACE: thinking (up-glancing) */}
        <g className={styles.faceThinking}>
          <circle
            className={styles.canBlink}
            cx="89"
            cy="67"
            r="5.5"
            fill="var(--ember-hot)"
            filter="url(#eyeGlow)"
          />
          <circle
            className={styles.canBlink}
            cx="113"
            cy="67"
            r="5.5"
            fill="var(--ember-hot)"
            filter="url(#eyeGlow)"
          />
        </g>

        {/* FACE: happy (^_^) */}
        <g className={styles.faceHappy}>
          <path
            d="M82 72 Q88 64 94 72"
            stroke="var(--success)"
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
            filter="url(#eyeGlow)"
          />
          <path
            d="M106 72 Q112 64 118 72"
            stroke="var(--success)"
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
            filter="url(#eyeGlow)"
          />
        </g>

        {/* FACE: confused (asymmetric, worried) */}
        <g className={styles.faceConfused}>
          <circle cx="88" cy="72" r="6" fill="var(--error)" filter="url(#eyeGlow)" />
          <circle cx="112" cy="67" r="4.5" fill="var(--error)" filter="url(#eyeGlow)" />
          <path
            d="M81 58 q7 -4 12 -1"
            stroke="var(--metal-light)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* mouth (shared) */}
        <path
          d="M90 86 q10 5 20 0"
          stroke="#5C6478"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* panel line between screen and core */}
        <rect x="78" y="102" width="44" height="6" rx="3" fill="#5C6478" opacity="0.3" />

        {/* forge core */}
        <circle
          className={styles.coreGlow}
          cx="100"
          cy="124"
          r="18"
          fill="var(--ember)"
          filter="url(#softGlow)"
          opacity="0.6"
        />
        <circle className={styles.core} cx="100" cy="124" r="13" stroke="#20232C" strokeWidth="2" />
        <circle cx="100" cy="124" r="5.2" fill="#e0f2fe" opacity="0.85" />

        {/* left arm (static nub) */}
        <g className={styles.armL}>
          <rect
            x="45"
            y="84"
            width="13"
            height="30"
            rx="6"
            fill="url(#metalGrad)"
            stroke="#20232C"
            strokeWidth="2"
          />
          <circle cx="51" cy="116" r="7" fill="url(#metalGrad)" stroke="#20232C" strokeWidth="1.6" />
        </g>

        {/* legs / feet */}
        <rect x="76" y="150" width="19" height="15" rx="6" fill="#2E3342" stroke="#20232C" strokeWidth="1.6" />
        <rect x="105" y="150" width="19" height="15" rx="6" fill="#2E3342" stroke="#20232C" strokeWidth="1.6" />

        {/* ANVIL + SPARKS (busy) — drawn after the legs so it sits in front */}
        <g className={styles.anvilGroup}>
          <path d="M88,161 h40 v6 h-7 v10 h-26 v-10 h-7 z" fill="#282C38" stroke="#4A5268" strokeWidth="1.5" />
          <rect x="84" y="151" width="64" height="11" rx="2.5" fill="url(#metalGrad)" stroke="#4A5268" strokeWidth="1.2" />
        </g>
        <g className={styles.sparksGroup}>
          <polygon
            className={styles.spark}
            style={{ "--tx": "16px", "--ty": "-20px" } as CSSProperties}
            points="134,150 136,146 138,150 136,154"
            fill="var(--gold-hot)"
          />
          <polygon
            className={styles.spark}
            style={{ "--tx": "24px", "--ty": "-10px" } as CSSProperties}
            points="140,149 142,146 144,149 142,153"
            fill="var(--ember-hot)"
          />
          <polygon
            className={styles.spark}
            style={{ "--tx": "6px", "--ty": "-24px" } as CSSProperties}
            points="126,151 128,147 130,151 128,155"
            fill="var(--gold-hot)"
          />
          <polygon
            className={styles.spark}
            style={{ "--tx": "20px", "--ty": "-28px" } as CSSProperties}
            points="132,153 134,149 136,153 134,157"
            fill="#fff"
          />
        </g>

        {/* right arm: hangs from the shoulder pivot (148,84); rotate(0) rests
            the hand/hammer on the anvil. Hammer head shows only while busy. */}
        <g className={styles.hammerArm}>
          <rect
            x="141"
            y="84"
            width="14"
            height="26"
            rx="6"
            fill="url(#metalGrad)"
            stroke="#20232C"
            strokeWidth="2"
          />
          <rect x="144" y="108" width="8" height="28" rx="3" fill="#3B3F4C" stroke="#20232C" strokeWidth="1.4" />
          {/* plain hand (default state) */}
          <circle
            className={styles.handCap}
            cx="148"
            cy="140"
            r="8"
            fill="url(#metalGrad)"
            stroke="#20232C"
            strokeWidth="1.6"
          />
          {/* hammer head (busy state only) */}
          <g className={styles.hammerHead}>
            <rect x="131" y="134" width="28" height="17" rx="4" fill="url(#metalGrad)" stroke="#20232C" strokeWidth="1.6" />
          </g>
        </g>

        {/* ingot held up (success) */}
        <g className={styles.ingotGroup}>
          <rect
            x="128"
            y="30"
            width="30"
            height="12"
            rx="4"
            fill="url(#ingotGrad)"
            stroke="#a9762a"
            strokeWidth="1.2"
            transform="rotate(-18 143 36)"
          />
        </g>
      </g>
    </svg>
  )
}
