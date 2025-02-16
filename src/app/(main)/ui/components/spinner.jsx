"use client";
import { useState, useEffect } from "react";

export default function Spinner({ className = "" }) {
  return (
    <div className={className} suppressHydrationWarning>
      <span className="loader-spinner"></span>
      <style>
        {`.loader-spinner {
    width: 100%;
    height: 100%;
    border: 2px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
    } `}
      </style>
    </div>
  );
}

export function DotPulseSpinner({ className = "" }) {
  const [style, setStyle] = useState("");

  useEffect(() => {
    setStyle(`
  .containerr {
    --uib-size: 1em;
    --uib-color: white;
    --uib-speed: 1.3s;
    --uib-dot-size: calc(var(--uib-size) * 0.24);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--uib-dot-size);
    width: var(--uib-size);
  }

  .dot,
  .containerr::before,
  .containerr::after {
    content: '';
    display: block;
    height: var(--uib-dot-size);
    width: var(--uib-dot-size);
    border-radius: 50%;
    background-color: var(--uib-color);
    transform: scale(0);
    transition: background-color 0.3s ease;
  }

  .containerr::before {
    animation: pulse var(--uib-speed) ease-in-out calc(var(--uib-speed) * -0.375)
      infinite;
  }

  .dot {
    animation: pulse var(--uib-speed) ease-in-out calc(var(--uib-speed) * -0.25)
      infinite both;
  }

  .containerr::after {
    animation: pulse var(--uib-speed) ease-in-out calc(var(--uib-speed) * -0.125)
      infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(0);
    }

    50% {
      transform: scale(1);
    }
  }`);
  }, []);

  return (
    <div className={className}>
      <div className="containerr">
        <div className="dot" />
      </div>

      <style>{style}</style>
    </div>
  );
}
