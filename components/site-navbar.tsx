"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EMERGENCY_PHONE_DISPLAY, SITE_NAME, phoneHref } from "@/lib/seo";

export function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowStickyCta(window.innerWidth <= 900 && window.scrollY > 120);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="site-header">
        <div className="shell nav-row">
          <Link href="/" className="brand" onClick={() => setOpen(false)}>
            <Image src="/foundationcrackpro-logo.svg" alt={`${SITE_NAME} logo`} className="brand-logo" width={180} height={38} priority />
            <span className="brand-text">
              <strong>{SITE_NAME}</strong>
              <small>Crack Repair Specialists</small>
            </span>
          </Link>

          <nav className="nav-links desktop-nav">
            <Link href="/">Home</Link>
            <Link href="/services">Services</Link>
            <Link href="/blog">Blog</Link>
            <a href={phoneHref()} className="btn btn-solid">Call Now</a>
          </nav>

          <button className="hamburger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`mobile-drawer ${open ? "mobile-drawer-open" : ""}`}>
        <button className="mobile-drawer-backdrop" aria-label="Close menu" onClick={() => setOpen(false)} />
        <aside className="mobile-drawer-panel">
          <Link href="/" className="drawer-link" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/services" className="drawer-link" onClick={() => setOpen(false)}>Services</Link>
          <Link href="/blog" className="drawer-link" onClick={() => setOpen(false)}>Blog</Link>
          <a href={phoneHref()} className="btn btn-solid drawer-cta" onClick={() => setOpen(false)}>
            Call {EMERGENCY_PHONE_DISPLAY}
          </a>
        </aside>
      </div>

      <div className={`mobile-sticky-cta ${showStickyCta ? "mobile-sticky-cta-show" : ""}`}>
        <a href={phoneHref()} className="mobile-sticky-cta-btn">Call {EMERGENCY_PHONE_DISPLAY}</a>
      </div>
    </>
  );
}
