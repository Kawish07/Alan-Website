import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube, Menu, X, LogIn, ArrowRight, LogOut, User as UserIcon, Shield
} from 'lucide-react';
import { submitLead, trackBehavior } from '../api';
import { AuthContext } from '../context/AuthContext';

/* ── Google Fonts injection ── */
if (typeof document !== 'undefined' && !document.getElementById('spears-fonts')) {
  const link = document.createElement('link');
  link.id = 'spears-fonts';
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap';
  document.head.appendChild(link);
}

/* ── Layout styles injection ── */
if (typeof document !== 'undefined' && !document.getElementById('layout-styles')) {
  const style = document.createElement('style');
  style.id = 'layout-styles';
  style.innerHTML = `
    :root { --accent: #c9a96e; --muted: rgba(9,9,9,0.6); --bg-dark: #0a0a0a; }

    /* ══════════════════════════════════════════════
       NAVBAR — all transitions use !important so
       generic button / anchor rules cannot override
       ══════════════════════════════════════════════ */

    /* bar itself — transparent → white on scroll */
    .chf-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 50;
      background-color: transparent;
      backdrop-filter: none; -webkit-backdrop-filter: none;
      box-shadow: none;
      padding: 22px 0;
      transition: all .5s cubic-bezier(.22,1,.36,1) !important;
    }
    .chf-nav.scrolled {
      background-color: rgba(255,255,255,0.97);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      box-shadow: 0 1px 0 0 #e8e4de, 0 8px 28px rgba(0,0,0,0.06);
      padding: 12px 0;
    }

    .chf-nav .chf-nav-inner {
      max-width: 1320px; margin: 0 auto; padding: 0 32px;
      display: flex; align-items: center; justify-content: space-between;
    }

    /* logo */
    .chf-logo { text-decoration: none; display: flex; align-items: center; gap: 8px; }
    .chf-logo-text {
      font-family: 'Cormorant Garamond', serif; font-weight: 500;
      font-size: 18px; letter-spacing: 0.12em; color: #ffffff;
      transition: color .45s ease !important;
    }
    .chf-logo-sub {
      display: block; font-size: 9px; letter-spacing: 0.28em;
      text-transform: uppercase; color: rgba(255,255,255,0.7); margin-top: 2px;
      transition: color .45s ease !important;
    }
    .chf-nav.scrolled .chf-logo-text { color: #0a0a0a; }
    .chf-nav.scrolled .chf-logo-sub  { color: #9a8c7e; }

    /* nav links container — hidden mobile, flex desktop */
    .nav-links { display: none; gap: 36px; align-items: center; }
    @media (min-width: 1024px) { .nav-links { display: flex; } }

    /* individual nav link */
    .nav-link {
      font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 0.18em;
      text-transform: uppercase; font-weight: 400; text-decoration: none;
      position: relative; padding: 6px 2px;
      color: rgba(255,255,255,0.9);
      transition: color .3s ease, transform .25s ease !important;
    }
    .nav-link::after {
      content: ''; position: absolute; left: 0; right: 0; bottom: -6px;
      height: 2px; background: linear-gradient(90deg, #c9a96e, #e8c88a);
      transform: scaleX(0); transform-origin: left;
      transition: transform .3s ease !important;
    }
    .nav-link:hover {
      color: var(--accent) !important;
      transform: translateY(-3px);
    }
    .nav-link:hover::after { transform: scaleX(1); }
    .nav-link.active { font-weight: 500; color: var(--accent) !important; }
    .nav-link.active::after { transform: scaleX(1); }
    .chf-nav.scrolled .nav-link { color: #0a0a0a; }
    .chf-nav.scrolled .nav-link:hover { color: var(--accent) !important; }
    .chf-nav.scrolled .nav-link.active { color: var(--accent) !important; }

    /* CTA button */
    .chf-cta {
      border-radius: 40px; padding: 10px 24px; display: inline-flex; gap: 10px;
      align-items: center; border: 1px solid rgba(255,255,255,0.7);
      background: transparent; color: #ffffff; text-decoration: none;
      font-family: 'Jost', sans-serif; font-size: 11px;
      letter-spacing: 0.18em; text-transform: uppercase; font-weight: 500;
      transition: all .35s cubic-bezier(.22,1,.36,1) !important;
    }
    .chf-nav.scrolled .chf-cta { border-color: #0a0a0a; color: #0a0a0a; }
    .chf-cta:hover {
      color: #ffffff !important;
      background: linear-gradient(90deg, #c9a96e, #e8c88a);
      border-color: var(--accent);
      box-shadow: 0 8px 28px rgba(201,169,110,0.3);
      transform: translateY(-3px) scale(1.03);
    }

    /* login link */
    .chf-admin-link {
      display: inline-flex; gap: 8px; align-items: center; padding: 8px 12px;
      border-radius: 28px; font-family: 'Jost', sans-serif; font-size: 11px;
      letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.9;
      border: 1px solid transparent; text-decoration: none; color: #ffffff;
      transition: all .35s cubic-bezier(.22,1,.36,1) !important;
    }
    .chf-nav.scrolled .chf-admin-link { color: #0a0a0a; }
    .chf-admin-icon {
      display: inline-flex; align-items: center;
      transition: transform .25s ease, color .25s ease !important;
    }
    .chf-admin-link:hover {
      color: var(--accent) !important; transform: translateY(-3px);
      background: rgba(201,169,110,0.08);
      box-shadow: 0 10px 30px rgba(0,0,0,0.12);
      border-color: rgba(201,169,110,0.18);
    }
    .chf-admin-link:hover .chf-admin-icon { transform: translateY(-2px) rotate(-6deg); }

    /* desktop CTA group — hidden mobile, flex desktop */
    .chf-desktop-cta { display: none; align-items: center; gap: 16px; }
    @media (min-width: 1024px) { .chf-desktop-cta { display: flex; } }

    /* mobile hamburger toggle */
    .chf-mobile-toggle {
      background: none; border: none; cursor: pointer; color: #ffffff;
      padding: 8px; display: flex; align-items: center; justify-content: center;
      transition: color .4s ease, transform .2s ease !important;
    }
    .chf-nav.scrolled .chf-mobile-toggle { color: #0a0a0a; }
    .chf-mobile-toggle:hover { transform: scale(1.15); }
    .chf-mobile-toggle:active { transform: scale(0.92); }
    @media (min-width: 1024px) { .chf-mobile-toggle { display: none !important; } }

    /* ── SIDE DRAWER ── */
    .chf-drawer-overlay {
      position: fixed; inset: 0; z-index: 100;
      background: rgba(0,0,0,0); pointer-events: none;
      transition: background .4s cubic-bezier(.22,1,.36,1);
    }
    .chf-drawer-overlay.open {
      background: rgba(0,0,0,0.55); pointer-events: all;
      backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
    }
    .chf-drawer {
      position: fixed; top: 0; right: 0; z-index: 101;
      width: 340px; max-width: 85vw; height: 100vh;
      background: linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%);
      transform: translateX(100%);
      transition: transform .45s cubic-bezier(.22,1,.36,1);
      display: flex; flex-direction: column;
      box-shadow: -20px 0 60px rgba(0,0,0,0.5);
      overflow-y: auto;
    }
    .chf-drawer.open { transform: translateX(0); }
    .chf-drawer-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 28px 28px 20px; border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .chf-drawer-close {
      background: none; border: 1px solid rgba(255,255,255,0.12); color: #fff;
      width: 40px; height: 40px; border-radius: 50%; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all .25s cubic-bezier(.22,1,.36,1);
    }
    .chf-drawer-close:hover { border-color: var(--accent); color: var(--accent); transform: rotate(90deg); }
    .chf-drawer-body { flex: 1; padding: 24px 28px; }
    .chf-drawer-link {
      display: flex; align-items: center; justify-content: space-between;
      font-family: 'Jost', sans-serif; font-size: 14px; letter-spacing: 0.14em;
      text-transform: uppercase; color: rgba(255,255,255,0.7); text-decoration: none;
      padding: 18px 0; border-bottom: 1px solid rgba(255,255,255,0.06);
      opacity: 0; transform: translateX(30px);
      transition: color .22s, transform .22s, opacity .35s cubic-bezier(.22,1,.36,1);
    }
    .chf-drawer.open .chf-drawer-link {
      opacity: 1; transform: translateX(0);
    }
    .chf-drawer.open .chf-drawer-link:nth-child(1) { transition-delay: .08s; }
    .chf-drawer.open .chf-drawer-link:nth-child(2) { transition-delay: .13s; }
    .chf-drawer.open .chf-drawer-link:nth-child(3) { transition-delay: .18s; }
    .chf-drawer.open .chf-drawer-link:nth-child(4) { transition-delay: .23s; }
    .chf-drawer.open .chf-drawer-link:nth-child(5) { transition-delay: .28s; }
    .chf-drawer.open .chf-drawer-link:nth-child(6) { transition-delay: .33s; }
    .chf-drawer.open .chf-drawer-link:nth-child(7) { transition-delay: .38s; }
    .chf-drawer-link:hover { color: var(--accent); transform: translateX(6px); }
    .chf-drawer-link.active { color: var(--accent); font-weight: 500; }
    .chf-drawer-link .chf-drawer-arrow {
      font-size: 18px; transition: transform .22s; color: rgba(255,255,255,0.2);
    }
    .chf-drawer-link:hover .chf-drawer-arrow { transform: translateX(4px); color: var(--accent); }
    .chf-drawer-footer {
      padding: 24px 28px; border-top: 1px solid rgba(255,255,255,0.06);
      opacity: 0; transform: translateY(20px);
      transition: opacity .4s cubic-bezier(.22,1,.36,1) .35s, transform .4s cubic-bezier(.22,1,.36,1) .35s;
    }
    .chf-drawer.open .chf-drawer-footer { opacity: 1; transform: translateY(0); }
    .chf-drawer-cta {
      display: block; text-align: center; padding: 16px 0;
      font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 0.18em;
      text-transform: uppercase; font-weight: 500; color: #0a0a0a;
      background: linear-gradient(90deg, #c9a96e, #e8c88a); text-decoration: none;
      border-radius: 6px; margin-bottom: 16px;
      transition: transform .25s, box-shadow .25s;
    }
    .chf-drawer-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,169,110,0.3); }
    .chf-drawer-login {
      display: flex; align-items: center; justify-content: center; gap: 10px;
      padding: 14px 0; color: rgba(255,255,255,0.5);
      font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 0.14em;
      text-transform: uppercase; text-decoration: none;
      transition: color .22s;
    }
    .chf-drawer-login:hover { color: #ffffff; }
    .chf-drawer-socials {
      display: flex; justify-content: center; gap: 14px; margin-top: 24px;
    }
    .chf-drawer-social {
      width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.4);
      transition: all .22s cubic-bezier(.22,1,.36,1); text-decoration: none;
    }
    .chf-drawer-social:hover { color: #fff; border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.3); }

    /* footer & social */
    .chf-social { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition: all .3s cubic-bezier(.22,1,.36,1) !important; color: rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.15); }
    .chf-social:hover { color: #ffffff !important; transform: translateY(-4px) scale(1.06) !important; background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)); box-shadow: 0 6px 20px rgba(0,0,0,0.35); border-color: rgba(255,255,255,0.28) !important; }
    .chf-footer-link { color: rgba(255,255,255,0.6); text-decoration: none !important; transition: color .3s ease, transform .3s ease !important; display:block; padding:6px 0; position: relative; }
    .chf-footer-link:hover { color: #ffffff !important; transform: translateX(6px) !important; }
    .chf-footer-link::after { content:''; position:absolute; bottom:0; left:0; width:0; height:1px; background:rgba(255,255,255,0.3); transition: width .3s ease; }
    .chf-footer-link:hover::after { width:100%; }
    .chf-mobile-link { display:block; font-family:'Jost', sans-serif; font-size:13px; letter-spacing:0.2em; text-transform:uppercase; color:#ffffff; text-decoration:none; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.08); transition: color .22s; }
    .chf-mobile-link:hover { color: var(--accent); }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }

    /* ── Global interactive helpers ── */
    .chf-btn { display:inline-flex; align-items:center; gap:10px; cursor:pointer; font-family:'Jost',sans-serif; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; font-weight:500; border:none; text-decoration:none; transition: background-color .3s, color .3s, transform .3s, box-shadow .3s; position:relative; overflow:hidden; }
    .chf-btn-primary { background:#0a0a0a; color:#ffffff; padding:16px 36px; }
    .chf-btn-primary:hover { background:#c9a96e; transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.18); }
    .chf-btn-outline { background:transparent; border:1px solid #0a0a0a; color:#0a0a0a; padding:14px 36px; }
    .chf-btn-outline:hover { background:#0a0a0a; color:#ffffff; transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.12); }
    .chf-btn-gold { background:#c9a96e; color:#0a0a0a; padding:16px 36px; }
    .chf-btn-gold:hover { background:#b8944f; transform:translateY(-3px); box-shadow:0 12px 32px rgba(201,169,110,0.3); }
    .chf-card { transition: transform .4s ease, box-shadow .4s ease; }
    .chf-card:hover { transform:translateY(-8px); box-shadow:0 20px 48px rgba(0,0,0,0.1); }
    .chf-img-zoom { overflow:hidden; }
    .chf-img-zoom img { transition: transform .6s ease; display:block; width:100%; height:100%; object-fit:cover; }
    .chf-img-zoom:hover img { transform:scale(1.05); }
    .chf-link { color:inherit; text-decoration:none; transition: color .22s; }
    .chf-link:hover { color:var(--accent); }
    .chf-underline-link { display:inline-flex; align-items:center; gap:8px; font-family:'Jost',sans-serif; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:#0a0a0a; text-decoration:none; border-bottom:1px solid #0a0a0a; padding-bottom:4px; transition: color .25s, border-color .25s, transform .25s; }
    .chf-underline-link:hover { color:var(--accent); border-color:var(--accent); transform:translateX(4px); }
    .chf-input { font-family:'Jost',sans-serif; font-size:13px; color:#0a0a0a; border:none; border-bottom:1px solid #ede9e3; outline:none; padding:12px 0; background:transparent; width:100%; transition: border-color .25s; }
    .chf-input:focus { border-color:#c9a96e; }
    .chf-input-dark { font-family:'Jost',sans-serif; font-size:13px; color:#ffffff; border:none; border-bottom:1px solid rgba(255,255,255,0.15); outline:none; padding:12px 0; background:transparent; width:100%; transition: border-color .25s; }
    .chf-input-dark:focus { border-color:#c9a96e; }

    /* ── Smooth auto transitions for form elements + buttons ── */
    input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]),
    select, textarea { transition: border-color .25s ease, box-shadow .25s ease, background-color .25s ease !important; }
    input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]):focus,
    select:focus, textarea:focus { border-color: var(--accent) !important; box-shadow: 0 2px 12px rgba(201,169,110,0.08) !important; }
    button:not(.chf-mobile-toggle):not(.chf-drawer-close):not(.nav-link) {
      transition: background-color .28s ease, color .28s ease, transform .28s ease, box-shadow .28s ease, border-color .28s ease, opacity .28s ease !important;
    }
    button[type="submit"]:hover:not(:disabled),
    button[style*="uppercase"]:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    a[style*="padding"]:not(.nav-link):not(.chf-footer-link):not(.chf-mobile-link):not(.chf-cta):not(.chf-admin-link):not(.chf-social):not(.chf-drawer-link):not(.chf-drawer-cta):not(.chf-drawer-login):not(.chf-drawer-social):not(.chf-logo) {
      transition: background-color .3s ease, color .3s ease, transform .3s ease, box-shadow .3s ease, border-color .3s ease !important;
    }
    a[style*="padding"]:not(.nav-link):not(.chf-footer-link):not(.chf-mobile-link):not(.chf-cta):not(.chf-admin-link):not(.chf-social):not(.chf-drawer-link):not(.chf-drawer-cta):not(.chf-drawer-login):not(.chf-drawer-social):not(.chf-logo):hover {
      transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08);
    }
    img[style*="object-fit"] { transition: transform .6s cubic-bezier(.4,0,.2,1) !important; }
    img[style*="object-fit"]:hover { transform: scale(1.04); }
    a[href^="tel:"], a[href^="mailto:"] { transition: color .25s ease !important; }
    a[href^="tel:"]:hover, a[href^="mailto:"]:hover { color: var(--accent) !important; }

    /* ── PAGE LOADER ── */
    .chf-loader-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: radial-gradient(ellipse at 50% 40%, #141210 0%, #0a0a0a 70%);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      opacity: 1;
      transition: opacity .55s cubic-bezier(.22,1,.36,1);
      pointer-events: all;
      overflow: hidden;
    }
    .chf-loader-overlay.exit {
      opacity: 0;
      pointer-events: none;
    }

    /* ambient gold glow behind content */
    .chf-loader-glow {
      position: absolute; width: 320px; height: 320px;
      border-radius: 50%; filter: blur(90px);
      background: radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%);
      animation: chf-glow-pulse 2.4s ease-in-out infinite;
      pointer-events: none;
    }

    /* decorative top accent line */
    .chf-loader-accent-line {
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent 0%, rgba(201,169,110,0) 20%, rgba(201,169,110,0.5) 50%, rgba(201,169,110,0) 80%, transparent 100%);
      transform: scaleX(0);
      animation: chf-line-reveal .7s cubic-bezier(.22,1,.36,1) .15s forwards;
    }

    /* floating gold particles */
    .chf-loader-particle {
      position: absolute; border-radius: 50%; pointer-events: none;
      background: radial-gradient(circle, rgba(201,169,110,0.6) 0%, transparent 70%);
      animation: chf-particle-float linear infinite;
    }
    .chf-loader-particle:nth-child(1) { width: 3px; height: 3px; left: 20%; bottom: -10px; animation-duration: 3.5s; animation-delay: 0s; }
    .chf-loader-particle:nth-child(2) { width: 2px; height: 2px; left: 35%; bottom: -10px; animation-duration: 4.2s; animation-delay: .4s; }
    .chf-loader-particle:nth-child(3) { width: 4px; height: 4px; left: 50%; bottom: -10px; animation-duration: 3s; animation-delay: .1s; }
    .chf-loader-particle:nth-child(4) { width: 2px; height: 2px; left: 65%; bottom: -10px; animation-duration: 4.8s; animation-delay: .7s; }
    .chf-loader-particle:nth-child(5) { width: 3px; height: 3px; left: 80%; bottom: -10px; animation-duration: 3.8s; animation-delay: .3s; }
    .chf-loader-particle:nth-child(6) { width: 2px; height: 2px; left: 45%; bottom: -10px; animation-duration: 5s; animation-delay: .9s; }

    /* logo with shimmer */
    .chf-loader-logo {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 28px; font-weight: 400; letter-spacing: 0.16em;
      color: #ffffff; margin-bottom: 10px; position: relative;
      opacity: 0; transform: translateY(14px);
      animation: chf-fade-up .65s cubic-bezier(.22,1,.36,1) .15s forwards;
    }
    .chf-loader-logo::after {
      content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(201,169,110,0.2), transparent);
      animation: chf-shimmer 2s ease-in-out .8s infinite;
    }

    .chf-loader-sub {
      font-family: 'Jost', sans-serif;
      font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase;
      color: rgba(255,255,255,0.35); margin-bottom: 44px;
      opacity: 0; transform: translateY(8px);
      animation: chf-fade-up .55s cubic-bezier(.22,1,.36,1) .3s forwards;
    }

    /* progress bar */
    .chf-loader-bar-track {
      width: 200px; height: 2px; background: rgba(255,255,255,0.06);
      border-radius: 4px; overflow: hidden; position: relative;
      opacity: 0; animation: chf-fade-up .4s cubic-bezier(.22,1,.36,1) .38s forwards;
    }
    .chf-loader-bar-fill {
      position: absolute; top: 0; left: 0; height: 100%; width: 0;
      background: linear-gradient(90deg, #c9a96e, #e8c88a, #c9a96e);
      border-radius: 4px;
      box-shadow: 0 0 12px rgba(201,169,110,0.4);
      animation: chf-bar-fill .75s cubic-bezier(.22,1,.36,1) .42s forwards;
    }

    /* bottom accent line */
    .chf-loader-line {
      position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, rgba(201,169,110,0.35), transparent);
      transform: scaleX(0);
      animation: chf-line-reveal .65s cubic-bezier(.22,1,.36,1) .2s forwards;
    }

    /* side decorative dashes */
    .chf-loader-dash-left, .chf-loader-dash-right {
      position: absolute; top: 50%; width: 60px; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(201,169,110,0.18));
      opacity: 0;
      animation: chf-fade-in .5s ease .5s forwards;
    }
    .chf-loader-dash-left  { right: calc(50% + 160px); transform: translateY(-50%); }
    .chf-loader-dash-right { left: calc(50% + 160px); transform: translateY(-50%) rotate(180deg); }

    @keyframes chf-fade-up { to { opacity: 1; transform: translateY(0); } }
    @keyframes chf-fade-in { to { opacity: 1; } }
    @keyframes chf-bar-fill { to { width: 100%; } }
    @keyframes chf-line-reveal { to { transform: scaleX(1); } }
    @keyframes chf-shimmer { 0% { left: -100%; } 100% { left: 200%; } }
    @keyframes chf-glow-pulse { 0%, 100% { opacity: .5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
    @keyframes chf-particle-float {
      0%   { transform: translateY(0) scale(1); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: .6; }
      100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

const navLinks = [
  { name: 'Properties', path: '/search' },
  { name: 'Services', path: '/services' },
  { name: 'Home Valuation', path: '/valuation' },
  { name: 'About', path: '/about' },
];

/* ── Page Loader Component ── */
const PageLoader = ({ show, loaderKey }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div key={loaderKey} className={`chf-loader-overlay${show ? '' : ' exit'}`}>
      {/* ambient glow */}
      <div className="chf-loader-glow" />

      {/* floating particles */}
      <div className="chf-loader-particle" />
      <div className="chf-loader-particle" />
      <div className="chf-loader-particle" />
      <div className="chf-loader-particle" />
      <div className="chf-loader-particle" />
      <div className="chf-loader-particle" />

      {/* accent lines */}
      <div className="chf-loader-accent-line" />
      <div className="chf-loader-line" />

      {/* side dashes */}
      <div className="chf-loader-dash-left" />
      <div className="chf-loader-dash-right" />

      {/* content */}
      <div className="chf-loader-logo">COLORADO HOME FINDER</div>
      <div className="chf-loader-sub">Luxury Real Estate</div>
      <div className="chf-loader-bar-track">
        <div className="chf-loader-bar-fill" />
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [loaderKey, setLoaderKey] = useState(0);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHomepage = location.pathname === '/';

  // Nav gets "scrolled" class on non-homepage OR when scrolled past threshold
  const navScrolled = !isHomepage || isScrolled;

  /* Scroll listener — uses RAF debounce to avoid jank */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Page transition loader on route change */
  useEffect(() => {
    setMobileMenuOpen(false);
    setLoaderKey(k => k + 1); // force fresh animations
    setPageLoading(true);
    window.scrollTo(0, 0);
    const t = setTimeout(() => setPageLoading(false), 850);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", backgroundColor: '#ffffff' }}>

      {/* PAGE LOADER */}
      <PageLoader show={pageLoading} loaderKey={loaderKey} />

      {/* NAVBAR — all colors driven by CSS .scrolled class, zero inline color recalculation */}
      {!isAdminRoute && (
        <nav className={`chf-nav${navScrolled ? ' scrolled' : ''}`}>
          <div className="chf-nav-inner">

            {/* Logo */}
            <Link to="/" className="chf-logo">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="chf-logo-text">COLORADO HOME FINDER</span>
                <span className="chf-logo-sub">Luxury Real Estate</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="nav-links">
              {navLinks.map(link => (
                <Link key={link.name} to={link.path}
                  className={`nav-link${location.pathname === link.path ? ' active' : ''}`}>
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTA + Auth */}
            <div className="chf-desktop-cta">
              <Link to="/contact" className="chf-cta">
                Contact Us <span style={{ width: 32, height: 1, backgroundColor: 'currentColor', display: 'inline-block' }} />
              </Link>
              {isAuthenticated && user?.role === 'user' ? (
                <>
                  <Link to="/dashboard" className="chf-admin-link">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>My Dashboard</span>
                    <UserIcon size={18} className="chf-admin-icon" />
                  </Link>
                  <button onClick={() => { logout(); navigate('/'); }} className="chf-admin-link" style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', padding: 0 }}>
                    <LogOut size={16} className="chf-admin-icon" />
                  </button>
                </>
              ) : isAuthenticated && user?.role === 'admin' ? (
                <>
                  <Link to="/admin" className="chf-admin-link">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>Admin Panel</span>
                  </Link>
                  <button onClick={() => { logout(); navigate('/'); }} className="chf-admin-link" style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', padding: 0 }}>
                    <LogOut size={16} className="chf-admin-icon" />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="chf-admin-link">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>Login</span>
                    <LogIn size={18} className="chf-admin-icon" />
                  </Link>
                  <Link to="/register" className="chf-admin-link" style={{ marginLeft: 4 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>Sign Up</span>
                  </Link>
                  <Link to="/admin/login" className="chf-admin-link" style={{ marginLeft: 4, opacity: 0.7 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>Admin</span>
                    <Shield size={16} className="chf-admin-icon" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="chf-mobile-toggle">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </nav>
      )}

      {/* SIDE DRAWER MENU */}
      {!isAdminRoute && (
        <>
          <div className={`chf-drawer-overlay${mobileMenuOpen ? ' open' : ''}`} onClick={() => setMobileMenuOpen(false)} />
          <div className={`chf-drawer${mobileMenuOpen ? ' open' : ''}`}>
            <div className="chf-drawer-header">
              <div>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 500, letterSpacing: '0.12em', color: '#ffffff' }}>COLORADO HOME FINDER</span>
                <span style={{ display: 'block', fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Luxury Real Estate</span>
              </div>
              <button className="chf-drawer-close" onClick={() => setMobileMenuOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="chf-drawer-body">
              {navLinks.map(link => (
                <Link key={link.name} to={link.path}
                  className={`chf-drawer-link${location.pathname === link.path ? ' active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}>
                  {link.name}
                  <span className="chf-drawer-arrow">&#8250;</span>
                </Link>
              ))}
            </div>
            <div className="chf-drawer-footer">
              <Link to="/contact" className="chf-drawer-cta" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
              {isAuthenticated && user?.role === 'user' ? (
                <>
                  <Link to="/dashboard" className="chf-drawer-login" onClick={() => setMobileMenuOpen(false)}>
                    <UserIcon size={15} /> My Dashboard
                  </Link>
                  <button className="chf-drawer-login" style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', width: '100%', textAlign: 'left' }} onClick={() => { logout(); navigate('/'); setMobileMenuOpen(false); }}>
                    <LogOut size={15} /> Logout
                  </button>
                </>
              ) : isAuthenticated && user?.role === 'admin' ? (
                <>
                  <Link to="/admin" className="chf-drawer-login" onClick={() => setMobileMenuOpen(false)}>
                    <UserIcon size={15} /> Admin Panel
                  </Link>
                  <button className="chf-drawer-login" style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', width: '100%', textAlign: 'left' }} onClick={() => { logout(); navigate('/'); setMobileMenuOpen(false); }}>
                    <LogOut size={15} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="chf-drawer-login" onClick={() => setMobileMenuOpen(false)}>
                    <LogIn size={15} /> Login
                  </Link>
                  <Link to="/register" className="chf-drawer-login" onClick={() => setMobileMenuOpen(false)}>
                    <UserIcon size={15} /> Sign Up
                  </Link>
                  <Link to="/admin/login" className="chf-drawer-login" style={{ opacity: 0.5, fontSize: 10, marginTop: 8 }} onClick={() => setMobileMenuOpen(false)}>
                    <Shield size={13} /> Admin Login
                  </Link>
                </>
              )}
              <div className="chf-drawer-socials">
                {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="chf-drawer-social"><Icon size={15} /></a>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* MAIN */}
      <main>{children}</main>

      {/* FOOTER */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

/* ── Inline Lead Form Component ── */
const InlineLeadForm = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', intent: 'Buyer' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitLead({ ...form, source: 'Footer Lead Form' });
    trackBehavior('FORM_SUBMIT', { source: 'Footer Lead Form', intent: form.intent });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#ffffff' }}>✓</span>
        </div>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#ffffff', marginBottom: 4 }}>Thank you!</p>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>We'll be in touch within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input type="text" placeholder="Full Name" required value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)', color: '#ffffff', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
      <input type="tel" placeholder="Phone Number" required value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
        style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)', color: '#ffffff', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
      <input type="email" placeholder="Email" required value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)', color: '#ffffff', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
      <div style={{ display: 'flex', gap: 8 }}>
        {['Buyer', 'Seller'].map(opt => (
          <button key={opt} type="button" onClick={() => setForm({ ...form, intent: opt })}
            style={{ flex: 1, padding: '10px', border: `1px solid ${form.intent === opt ? '#c9a96e' : 'rgba(255,255,255,0.12)'}`, backgroundColor: form.intent === opt ? '#c9a96e' : 'transparent', color: form.intent === opt ? '#0a0a0a' : 'rgba(255,255,255,0.6)', fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}>
            {opt}
          </button>
        ))}
      </div>
      <button type="submit"
        style={{ padding: '14px', backgroundColor: '#c9a96e', color: '#0a0a0a', border: 'none', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}>
        Get Started <ArrowRight size={13} />
      </button>
    </form>
  );
};

/* ── Footer Component ── */
const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0a0a0a', color: '#ffffff', paddingTop: 80, paddingBottom: 40 }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
        <div className="resp-footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 48, marginBottom: 64 }}>

          {/* Brand */}
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, letterSpacing: '0.1em', marginBottom: 16 }}>
              COLORADO<br />HOME FINDER
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>
              Your trusted partner in Colorado Real Estate. Led by Alan Ramirez — expert guidance for buyers and sellers across Denver and beyond.
            </p>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 16, lineHeight: 1.8 }}>
              <p>License #FA100104608</p>
              <p>reColorado MLS ID: 165065183</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="chf-social">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Quick Links</p>
            {navLinks.map(link => (
              <Link key={link.name} to={link.path} className="chf-footer-link" style={{ fontSize: 13, padding: '6px 0', letterSpacing: '0.05em' }}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Services */}
          <div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Services</p>
            {[['First-Time Buyers', '/first-time-buyers'], ['Cash Offers', '/cash-offer'], ['Sell Before You Buy', '/sell-before-you-buy'], ['Home Valuation', '/valuation'], ['Loan Application', '/loan-application'], ['Book a Showing', '/book-showing']].map(([name, path]) => (
              <Link key={name} to={path} className="chf-footer-link" style={{ fontSize: 13, padding: '6px 0', letterSpacing: '0.05em' }}>
                {name}
              </Link>
            ))}
          </div>

          {/* Lead Form (on every page) */}
          <div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Get in Touch</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {[
                [MapPin, 'Denver, Colorado'],
                [Phone, '+1 (773) 818-0444'],
                [Mail, 'AmRamz79@gmail.com'],
              ].map(([Icon, text], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Icon size={15} style={{ color: 'rgba(255,255,255,0.4)', marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{text}</span>
                </div>
              ))}
            </div>
            <InlineLeadForm />
          </div>
        </div>

        {/* Trusted Logos Bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32, paddingBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '16px 32px' }}>
          {[
            { name: 'NAR' },
            { name: 'CAR' },
            { name: 'DMAR' },
            { name: 'AREAA' },
            { name: 'reColorado' },
            { name: 'Zillow', url: 'https://www.zillow.com/profile/alain%20ramirez3' },
            { name: 'Realtor.com', url: 'https://www.realtor.com/realestateagents/66287142c789e4cbc7224e7b' },
            { name: 'SOLD.com', url: 'https://www.sold.com/agent-profile/Alain-Ramirez-228234' },
          ].map((logo, i) => logo.url ? (
            <a key={i} href={logo.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', fontFamily: "'Jost', sans-serif", textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}>{logo.name}</a>
          ) : (
            <span key={i} style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', fontFamily: "'Jost', sans-serif" }}>{logo.name}</span>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="resp-newsletter" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 48, paddingBottom: 48, marginBottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: '#ffffff', marginBottom: 8 }}>Stay Connected</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Get early access to new listings & market insights.</p>
          </div>
          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: 0 }}>
            <input type="email" placeholder="Enter your email" style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '14px 20px', border: '1px solid rgba(255,255,255,0.15)', borderRight: 'none', backgroundColor: 'transparent', color: '#ffffff', outline: 'none', minWidth: 260 }} />
            <button type="submit" style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500, padding: '14px 28px', backgroundColor: '#c9a96e', color: '#0a0a0a', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}>
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom */}
        <div className="resp-footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
            © {new Date().getFullYear()} Colorado Home Finder LLC. All rights reserved. | License #FA100104608
          </p>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {[
              { name: 'NAR', src: '/R-logo.png' },
              { name: 'reColorado', src: '/Recolorado_Logo.jpg' },
              { name: 'AREAA', src: '/areaa-logo.png' },
              { name: 'CHF', src: '/CHFR_Logo.png' },
            ].map(b => (
              <img key={b.name} src={b.src} alt={b.name} style={{ height: 24, objectFit: 'contain', opacity: 0.35, filter: 'brightness(2) grayscale(100%)', transition: 'opacity 0.3s' }}
                onMouseEnter={e => e.target.style.opacity = '0.7'}
                onMouseLeave={e => e.target.style.opacity = '0.35'} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Layout;