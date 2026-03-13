import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube, Menu, X, LogIn, ArrowRight, LogOut, User as UserIcon, Shield,
  Calendar, Home as HomeIcon, DollarSign, MessageCircle, Users, ChevronDown
} from 'lucide-react';
import { submitLead, trackBehavior } from '../api';
import { AuthContext } from '../context/AuthContext';

/* ── Google Fonts injection ── */
if (typeof document !== 'undefined' && !document.getElementById('spears-fonts')) {
  const link = document.createElement('link');
  link.id = 'spears-fonts';
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap';
  document.head.appendChild(link);
}

/* ── Layout styles injection ── */
if (typeof document !== 'undefined' && !document.getElementById('layout-styles')) {
  const style = document.createElement('style');
  style.id = 'layout-styles';
  style.innerHTML = `
    :root { --accent: #C4956A; --accent-light: #D4A97A; --navy: #1B2A4A; --navy-dark: #0F172A; --slate-dark: #1E293B; --slate-med: #475569; --slate-light: #94A3B8; --cool-white: #F8FAFC; --border: #E2E8F0; --muted: rgba(71,85,105,0.6); --bg-dark: #0F172A; }

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
      box-shadow: 0 1px 0 0 #E2E8F0, 0 8px 28px rgba(15,23,42,0.06);
      padding: 12px 0;
    }

    .chf-nav .chf-nav-inner {
      max-width: 1320px; margin: 0 auto; padding: 0 32px;
      display: flex; align-items: center; justify-content: space-between;
    }

    /* logo */
    .chf-logo { text-decoration: none; display: flex; align-items: center; gap: 8px; margin-right: 16px; }
    .chf-logo-text {
      font-family: 'Montserrat', sans-serif; font-weight: 600;
      font-size: 17px; letter-spacing: 0.08em; color: #ffffff;
      transition: color .45s ease !important;
      white-space: nowrap;
    }
    .chf-logo-sub {
      display: block; font-size: 10px; letter-spacing: 0.15em;
      text-transform: uppercase; color: rgba(255,255,255,0.7); margin-top: 2px; font-weight: 400;
      transition: color .45s ease !important;
    }
    .chf-nav.scrolled .chf-logo-text { color: #1B2A4A; }
    .chf-nav.scrolled .chf-logo-sub  { color: #94A3B8; }

    /* nav links container — hidden mobile, flex desktop */
    .nav-links { display: none; gap: 16px; align-items: center; margin-right: 12px; }
    @media (min-width: 1024px) { .nav-links { display: flex; } }

    /* individual nav link */
    .nav-link {
      font-family: 'Inter', sans-serif; font-size: 10.5px; letter-spacing: 0.06em;
      text-transform: uppercase; font-weight: 500; text-decoration: none;
      position: relative; padding: 6px 2px;
      color: rgba(255,255,255,0.9);
      transition: color .3s ease, transform .25s ease !important;
      white-space: nowrap;
    }
    .nav-link::after {
      content: ''; position: absolute; left: 0; right: 0; bottom: -6px;
      height: 2px; background: #243B6A;
      transform: scaleX(0); transform-origin: left;
      transition: transform .3s ease !important;
    }
    .nav-link:hover {
      color: #ffffff !important;
      transform: translateY(-2px);
    }
    .nav-link:hover::after { transform: scaleX(1); }
    .nav-link.active { font-weight: 600; color: #ffffff !important; }
    .nav-link.active::after { transform: scaleX(1); }
    .chf-nav.scrolled .nav-link { color: #1E293B; }
    .chf-nav.scrolled .nav-link:hover { color: #1B2A4A !important; }
    .chf-nav.scrolled .nav-link.active { color: #1B2A4A !important; }

    /* ── Dropdown menus ── */
    .nav-dropdown {
      position: relative;
    }
    .nav-dropdown-trigger {
      font-family: 'Inter', sans-serif; font-size: 10.5px; letter-spacing: 0.06em;
      text-transform: uppercase; font-weight: 500; text-decoration: none;
      position: relative; padding: 6px 2px;
      color: rgba(255,255,255,0.9);
      transition: color .3s ease !important;
      cursor: pointer; background: none; border: none;
      display: inline-flex; align-items: center; gap: 4px;
      white-space: nowrap;
    }
    .nav-dropdown-trigger .chf-chevron {
      transition: transform .25s ease;
    }
    .nav-dropdown:hover .nav-dropdown-trigger .chf-chevron {
      transform: rotate(180deg);
    }
    .nav-dropdown-trigger::after {
      content: ''; position: absolute; left: 0; right: 0; bottom: -6px;
      height: 2px; background: #243B6A;
      transform: scaleX(0); transform-origin: left;
      transition: transform .3s ease !important;
    }
    .nav-dropdown:hover .nav-dropdown-trigger { color: #ffffff !important; }
    .nav-dropdown:hover .nav-dropdown-trigger::after { transform: scaleX(1); }
    .nav-dropdown.active .nav-dropdown-trigger { font-weight: 600; color: #ffffff !important; }
    .nav-dropdown.active .nav-dropdown-trigger::after { transform: scaleX(1); }
    .chf-nav.scrolled .nav-dropdown-trigger { color: #1E293B; }
    .chf-nav.scrolled .nav-dropdown:hover .nav-dropdown-trigger { color: #1B2A4A !important; }
    .chf-nav.scrolled .nav-dropdown.active .nav-dropdown-trigger { color: #1B2A4A !important; }

    .nav-dropdown-menu {
      position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
      min-width: 230px; padding: 16px 0 10px 0;
      background: linear-gradient(165deg, rgba(15,23,42,0.96) 0%, rgba(27,42,74,0.97) 100%);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 20px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06);
      opacity: 0; visibility: hidden;
      transform: translateX(-50%) translateY(10px);
      transition: opacity .3s cubic-bezier(.22,1,.36,1), transform .3s cubic-bezier(.22,1,.36,1), visibility .3s ease;
      pointer-events: none;
      margin-top: 8px;
      overflow: hidden;
    }
    .nav-dropdown-menu::before {
      content: ''; position: absolute; top: -14px; left: 0; right: 0;
      height: 14px; background: transparent;
    }
    .nav-dropdown:hover .nav-dropdown-menu {
      opacity: 1; visibility: visible;
      transform: translateX(-50%) translateY(0);
      pointer-events: auto;
    }
    .nav-dropdown-item {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 22px;
      font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 500;
      letter-spacing: 0.03em; color: rgba(255,255,255,0.75); text-decoration: none;
      transition: all .22s cubic-bezier(.22,1,.36,1);
      position: relative;
    }
    .nav-dropdown-item::before {
      content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
      background: #C4956A; border-radius: 0 3px 3px 0;
      transform: scaleY(0); transition: transform .22s ease;
    }
    .nav-dropdown-item:hover {
      background: rgba(255,255,255,0.06); color: #ffffff; padding-left: 26px;
    }
    .nav-dropdown-item:hover::before { transform: scaleY(1); }
    .nav-dropdown-item.active-sub {
      color: #ffffff; font-weight: 600; background: rgba(255,255,255,0.04);
    }
    .nav-dropdown-item.active-sub::before { transform: scaleY(1); }

    /* CTA button */
    .chf-cta {
      border-radius: 8px; padding: 8px 18px; display: inline-flex; gap: 8px;
      align-items: center; border: 2px solid rgba(255,255,255,0.7);
      background: transparent; color: #ffffff; text-decoration: none;
      font-family: 'Inter', sans-serif; font-size: 10.5px;
      letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600;
      transition: all .35s cubic-bezier(.22,1,.36,1) !important;
      white-space: nowrap;
    }
    .chf-nav.scrolled .chf-cta { border-color: #1B2A4A; color: #1B2A4A; }
    .chf-cta:hover {
      color: #ffffff !important;
      background: #1B2A4A;
      border-color: #1B2A4A;
      box-shadow: 0 8px 28px rgba(27,42,74,0.25);
      transform: translateY(-3px) scale(1.03);
    }

    /* login dropdown */
    .chf-login-dropdown {
      position: relative;
    }
    .chf-login-btn {
      display: inline-flex; gap: 8px; align-items: center; padding: 8px 16px;
      border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 10.5px;
      letter-spacing: 0.08em; text-transform: uppercase;
      border: 1.5px solid rgba(255,255,255,0.5); text-decoration: none; color: #ffffff; font-weight: 600;
      transition: all .35s cubic-bezier(.22,1,.36,1) !important;
      cursor: pointer; background: transparent; white-space: nowrap;
    }
    .chf-nav.scrolled .chf-login-btn { color: #1E293B; border-color: #1E293B; }
    .chf-login-btn:hover {
      color: #ffffff !important; background: #1B2A4A; border-color: #1B2A4A;
      box-shadow: 0 8px 24px rgba(27,42,74,0.2);
      transform: translateY(-2px);
    }
    .chf-login-btn .chf-chevron { transition: transform .25s ease; }
    .chf-login-dropdown:hover .chf-login-btn .chf-chevron { transform: rotate(180deg); }
    .chf-login-menu {
      position: absolute; top: 100%; right: 0;
      min-width: 200px; padding: 12px 0 8px 0;
      background: linear-gradient(165deg, rgba(15,23,42,0.96) 0%, rgba(27,42,74,0.97) 100%);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 20px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06);
      opacity: 0; visibility: hidden;
      transform: translateY(10px);
      transition: opacity .3s cubic-bezier(.22,1,.36,1), transform .3s cubic-bezier(.22,1,.36,1), visibility .3s ease;
      pointer-events: none;
      margin-top: 6px;
      overflow: hidden;
    }
    .chf-login-menu::before {
      content: ''; position: absolute; top: -10px; left: 0; right: 0;
      height: 10px; background: transparent;
    }
    .chf-login-dropdown:hover .chf-login-menu {
      opacity: 1; visibility: visible; transform: translateY(0); pointer-events: auto;
    }
    .chf-login-menu-item {
      display: flex; align-items: center; gap: 10px; padding: 12px 20px;
      font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 500;
      letter-spacing: 0.03em; color: rgba(255,255,255,0.75); text-decoration: none;
      transition: all .22s cubic-bezier(.22,1,.36,1);
      position: relative;
    }
    .chf-login-menu-item::before {
      content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
      background: #C4956A; border-radius: 0 3px 3px 0;
      transform: scaleY(0); transition: transform .22s ease;
    }
    .chf-login-menu-item:hover {
      background: rgba(255,255,255,0.06); color: #ffffff; padding-left: 24px;
    }
    .chf-login-menu-item:hover::before { transform: scaleY(1); }
    .chf-login-menu-divider {
      height: 1px; background: rgba(255,255,255,0.08); margin: 6px 16px;
    }
    /* legacy login link (for authenticated state) */
    .chf-admin-link {
      display: inline-flex; gap: 8px; align-items: center; padding: 8px 12px;
      border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 10.5px;
      letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.9;
      border: 1px solid transparent; text-decoration: none; color: #ffffff; font-weight: 500;
      transition: all .35s cubic-bezier(.22,1,.36,1) !important; white-space: nowrap;
    }
    .chf-nav.scrolled .chf-admin-link { color: #1E293B; }
    .chf-admin-icon {
      display: inline-flex; align-items: center;
      transition: transform .25s ease, color .25s ease !important;
    }
    .chf-admin-link:hover {
      color: var(--accent) !important; transform: translateY(-2px);
      background: rgba(196,149,106,0.08);
      border-color: rgba(196,149,106,0.18);
    }

    /* desktop CTA group — hidden mobile, flex desktop */
    .chf-desktop-cta { display: none; align-items: center; gap: 10px; }
    @media (min-width: 1024px) { .chf-desktop-cta { display: flex; } }

    /* mobile hamburger toggle */
    .chf-mobile-toggle {
      background: none; border: none; cursor: pointer; color: #ffffff;
      padding: 8px; display: flex; align-items: center; justify-content: center;
      transition: color .4s ease, transform .2s ease !important;
    }
    .chf-nav.scrolled .chf-mobile-toggle { color: #1E293B; }
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
      background: linear-gradient(180deg, #0F172A 0%, #1B2A4A 100%);
      transform: translateX(100%);
      transition: transform .45s cubic-bezier(.22,1,.36,1);
      display: flex; flex-direction: column;
      box-shadow: -20px 0 60px rgba(15,23,42,0.5);
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
      font-family: 'Inter', sans-serif; font-size: 13px; letter-spacing: 0.1em;
      text-transform: uppercase; color: rgba(255,255,255,0.7); text-decoration: none;
      font-weight: 500;
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
      font-family: 'Inter', sans-serif; font-size: 12px; letter-spacing: 0.1em;
      text-transform: uppercase; font-weight: 600; color: #ffffff;
      background: #1B2A4A; text-decoration: none;
      border-radius: 8px; margin-bottom: 16px;
      transition: transform .25s, box-shadow .25s;
    }
    .chf-drawer-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(27,42,74,0.3); }
    .chf-drawer-login {
      display: flex; align-items: center; justify-content: center; gap: 10px;
      padding: 14px 0; color: rgba(255,255,255,0.5);
      font-family: 'Inter', sans-serif; font-size: 12px; letter-spacing: 0.1em;
      text-transform: uppercase; text-decoration: none; font-weight: 500;
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
    .chf-drawer-social:hover { color: #fff; border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 6px 16px rgba(15,23,42,0.3); }

    /* footer & social */
    .chf-social { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition: all .3s cubic-bezier(.22,1,.36,1) !important; color: rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.15); }
    .chf-social:hover { color: #ffffff !important; transform: translateY(-4px) scale(1.06) !important; background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)); box-shadow: 0 6px 20px rgba(15,23,42,0.35); border-color: rgba(255,255,255,0.28) !important; }
    .chf-footer-link { color: rgba(255,255,255,0.6); text-decoration: none !important; transition: color .3s ease, transform .3s ease !important; display:block; padding:6px 0; position: relative; }
    .chf-footer-link:hover { color: #ffffff !important; transform: translateX(6px) !important; }
    .chf-footer-link::after { content:''; position:absolute; bottom:0; left:0; width:0; height:1px; background:rgba(255,255,255,0.3); transition: width .3s ease; }
    .chf-footer-link:hover::after { width:100%; }
    .chf-mobile-link { display:block; font-family:'Inter', sans-serif; font-size:13px; letter-spacing:0.1em; text-transform:uppercase; color:#ffffff; text-decoration:none; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.08); transition: color .22s; font-weight:500; }
    .chf-mobile-link:hover { color: var(--accent); }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }

    /* ── Global interactive helpers ── */
    .chf-btn { display:inline-flex; align-items:center; gap:10px; cursor:pointer; font-family:'Inter',sans-serif; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; font-weight:600; border:none; text-decoration:none; transition: background-color .3s, color .3s, transform .3s, box-shadow .3s; position:relative; overflow:hidden; border-radius:8px; }
    .chf-btn-primary { background:#1B2A4A; color:#ffffff; padding:16px 36px; }
    .chf-btn-primary:hover { background:#243B6A; transform:translateY(-3px); box-shadow:0 12px 32px rgba(27,42,74,0.25); }
    .chf-btn-outline { background:transparent; border:1px solid #1B2A4A; color:#1B2A4A; padding:14px 36px; }
    .chf-btn-outline:hover { background:#1B2A4A; color:#ffffff; transform:translateY(-3px); box-shadow:0 12px 32px rgba(27,42,74,0.15); }
    .chf-btn-gold { background:#C4956A; color:#ffffff; padding:16px 36px; }
    .chf-btn-gold:hover { background:#B07F55; transform:translateY(-3px); box-shadow:0 12px 32px rgba(196,149,106,0.3); }
    .chf-card { transition: transform .4s ease, box-shadow .4s ease; }
    .chf-card:hover { transform:translateY(-8px); box-shadow:0 20px 48px rgba(15,23,42,0.1); }
    .chf-img-zoom { overflow:hidden; }
    .chf-img-zoom img { transition: transform .6s ease; display:block; width:100%; height:100%; object-fit:cover; }
    .chf-img-zoom:hover img { transform:scale(1.05); }
    .chf-link { color:inherit; text-decoration:none; transition: color .22s; }
    .chf-link:hover { color:var(--accent); }
    .chf-underline-link { display:inline-flex; align-items:center; gap:8px; font-family:'Inter',sans-serif; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:#1B2A4A; text-decoration:none; border-bottom:1px solid #1B2A4A; padding-bottom:4px; transition: color .25s, border-color .25s, transform .25s; font-weight:600; }
    .chf-underline-link:hover { color:var(--accent); border-color:var(--accent); transform:translateX(4px); }
    .chf-input { font-family:'Inter',sans-serif; font-size:13px; color:#1E293B; border:none; border-bottom:1px solid #E2E8F0; outline:none; padding:12px 0; background:transparent; width:100%; transition: border-color .25s; }
    .chf-input:focus { border-color:#C4956A; }
    .chf-input-dark { font-family:'Inter',sans-serif; font-size:13px; color:#ffffff; border:none; border-bottom:1px solid rgba(255,255,255,0.15); outline:none; padding:12px 0; background:transparent; width:100%; transition: border-color .25s; }
    .chf-input-dark:focus { border-color:#C4956A; }

    /* ── Smooth auto transitions for form elements + buttons ── */
    input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]),
    select, textarea { transition: border-color .25s ease, box-shadow .25s ease, background-color .25s ease !important; }
    input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]):focus,
    select:focus, textarea:focus { border-color: var(--accent) !important; box-shadow: 0 2px 12px rgba(196,149,106,0.08) !important; }
    button:not(.chf-mobile-toggle):not(.chf-drawer-close):not(.nav-link) {
      transition: background-color .28s ease, color .28s ease, transform .28s ease, box-shadow .28s ease, border-color .28s ease, opacity .28s ease !important;
    }
    button[type="submit"]:hover:not(:disabled),
    button[style*="uppercase"]:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,23,42,0.12); }
    a[style*="padding"]:not(.nav-link):not(.chf-footer-link):not(.chf-mobile-link):not(.chf-cta):not(.chf-admin-link):not(.chf-social):not(.chf-drawer-link):not(.chf-drawer-cta):not(.chf-drawer-login):not(.chf-drawer-social):not(.chf-logo) {
      transition: background-color .3s ease, color .3s ease, transform .3s ease, box-shadow .3s ease, border-color .3s ease !important;
    }
    a[style*="padding"]:not(.nav-link):not(.chf-footer-link):not(.chf-mobile-link):not(.chf-cta):not(.chf-admin-link):not(.chf-social):not(.chf-drawer-link):not(.chf-drawer-cta):not(.chf-drawer-login):not(.chf-drawer-social):not(.chf-logo):hover {
      transform: translateY(-2px); box-shadow: 0 6px 20px rgba(15,23,42,0.08);
    }
    img[style*="object-fit"] { transition: transform .6s cubic-bezier(.4,0,.2,1) !important; }
    img[style*="object-fit"]:hover { transform: scale(1.04); }
    a[href^="tel:"], a[href^="mailto:"] { transition: color .25s ease !important; }
    a[href^="tel:"]:hover, a[href^="mailto:"]:hover { color: var(--accent) !important; }

    /* ── STICKY CTA BAR ── */
    .chf-sticky-cta {
      position: fixed; bottom: 20px; left: 50%; z-index: 49;
      transform: translateX(-50%) translateY(calc(100% + 40px));
      max-width: 820px; width: calc(100% - 48px);
      background: rgba(15,23,42,0.92);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 12px 20px;
      box-shadow: 0 8px 32px rgba(15,23,42,0.35), 0 0 0 1px rgba(255,255,255,0.05);
      transition: transform .5s cubic-bezier(.22,1,.36,1), opacity .5s ease;
      opacity: 0;
    }
    .chf-sticky-cta.visible {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    .chf-sticky-cta-inner {
      display: flex; align-items: center; justify-content: center;
      gap: 8px; flex-wrap: nowrap;
    }
    .chf-sticky-btn {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: 'Inter', sans-serif; font-size: 10.5px; font-weight: 600;
      letter-spacing: 0.03em; text-transform: uppercase; text-decoration: none;
      padding: 9px 16px; border-radius: 10px; border: none; cursor: pointer;
      transition: all .25s cubic-bezier(.22,1,.36,1) !important;
      white-space: nowrap;
    }
    .chf-sticky-btn.primary {
      background: linear-gradient(135deg, #C4956A, #B07F55); color: #ffffff;
    }
    .chf-sticky-btn.primary:hover {
      background: linear-gradient(135deg, #D4A97A, #C4956A);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(196,149,106,0.4);
    }
    .chf-sticky-btn.outline {
      background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.85);
      border: 1px solid rgba(255,255,255,0.12);
    }
    .chf-sticky-btn.outline:hover {
      background: rgba(255,255,255,0.14); color: #ffffff;
      border-color: rgba(255,255,255,0.28); transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(15,23,42,0.25);
    }
    @media (max-width: 768px) {
      .chf-sticky-cta { bottom: 14px; padding: 10px 14px; max-width: 96%; border-radius: 14px; }
      .chf-sticky-cta-inner { gap: 5px; }
      .chf-sticky-btn { font-size: 8.5px; padding: 8px 10px; gap: 4px; letter-spacing: 0.02em; border-radius: 8px; }
      .chf-sticky-btn .chf-sticky-icon { display: none; }
    }
    @media (max-width: 480px) {
      .chf-sticky-cta { bottom: 10px; padding: 8px 10px; border-radius: 12px; }
      .chf-sticky-cta-inner { gap: 4px; flex-wrap: wrap; justify-content: center; }
      .chf-sticky-btn { font-size: 8px; padding: 7px 9px; border-radius: 8px; }
    }

    /* ── PAGE LOADER ── */
    .chf-loader-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: radial-gradient(ellipse at 50% 40%, #1B2A4A 0%, #0F172A 70%);
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
      background: radial-gradient(circle, rgba(196,149,106,0.15) 0%, transparent 70%);
      animation: chf-glow-pulse 2.4s ease-in-out infinite;
      pointer-events: none;
    }

    /* decorative top accent line */
    .chf-loader-accent-line {
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent 0%, rgba(196,149,106,0) 20%, rgba(196,149,106,0.5) 50%, rgba(196,149,106,0) 80%, transparent 100%);
      transform: scaleX(0);
      animation: chf-line-reveal .7s cubic-bezier(.22,1,.36,1) .15s forwards;
    }

    /* floating gold particles */
    .chf-loader-particle {
      position: absolute; border-radius: 50%; pointer-events: none;
      background: radial-gradient(circle, rgba(196,149,106,0.6) 0%, transparent 70%);
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
      font-family: 'Montserrat', sans-serif;
      font-size: 24px; font-weight: 700; letter-spacing: 0.12em;
      color: #ffffff; margin-bottom: 10px; position: relative;
      opacity: 0; transform: translateY(14px);
      animation: chf-fade-up .65s cubic-bezier(.22,1,.36,1) .15s forwards;
    }
    .chf-loader-logo::after {
      content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(196,149,106,0.2), transparent);
      animation: chf-shimmer 2s ease-in-out .8s infinite;
    }

    .chf-loader-sub {
      font-family: 'Inter', sans-serif;
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
      background: linear-gradient(90deg, #C4956A, #D4A97A, #C4956A);
      border-radius: 4px;
      box-shadow: 0 0 12px rgba(196,149,106,0.4);
      animation: chf-bar-fill .75s cubic-bezier(.22,1,.36,1) .42s forwards;
    }

    /* bottom accent line */
    .chf-loader-line {
      position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, rgba(196,149,106,0.35), transparent);
      transform: scaleX(0);
      animation: chf-line-reveal .65s cubic-bezier(.22,1,.36,1) .2s forwards;
    }

    /* side decorative dashes */
    .chf-loader-dash-left, .chf-loader-dash-right {
      position: absolute; top: 50%; width: 60px; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(196,149,106,0.18));
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
  { name: 'Home Buyers', path: '/home-buyers' },
  { name: 'Home Sellers', path: '/home-sellers', children: [
    { name: 'Home Valuation', path: '/valuation' },
    { name: 'Cash Offers', path: '/cash-offer' },
  ]},
  { name: 'Cash Offers', path: '/cash-offer' },
  { name: 'Mortgage Calculator', path: '/mortgage-calculator', children: [
    { name: 'Conventional Loans', path: '/mortgage/conventional' },
    { name: 'CHFA Loans', path: '/mortgage/chfa' },
    { name: 'VA Loans', path: '/mortgage/va' },
    { name: '1st Time Home Buyer', path: '/mortgage/first-time-buyer' },
  ]},
  { name: 'Services', path: '/services' },
  { name: 'About', path: '/about' },
];

/* Flat list for footer quick links */
const footerQuickLinks = [
  { name: 'Properties', path: '/search' },
  { name: 'Home Buyers', path: '/home-buyers' },
  { name: 'Home Sellers', path: '/home-sellers' },
  { name: 'Home Valuation', path: '/valuation' },
  { name: 'Cash Offers', path: '/cash-offer' },
  { name: 'Mortgage Calculator', path: '/mortgage-calculator' },
  { name: 'Services', path: '/services' },
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
      <div className="chf-loader-sub">Denver Real Estate</div>
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
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#ffffff' }}>

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
                <span className="chf-logo-sub">Denver Real Estate</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="nav-links">
              {navLinks.map(link => link.children ? (
                <div key={link.name} className={`nav-dropdown${link.children.some(c => location.pathname === c.path || location.pathname + location.search === c.path) || location.pathname === link.path ? ' active' : ''}`}>
                  <Link to={link.path} className="nav-dropdown-trigger">
                    {link.name} <ChevronDown size={13} className="chf-chevron" />
                  </Link>
                  <div className="nav-dropdown-menu">
                    {link.children.map(sub => (
                      <Link key={sub.name} to={sub.path}
                        className={`nav-dropdown-item${location.pathname === sub.path || location.pathname + location.search === sub.path ? ' active-sub' : ''}`}>
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
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
                <div className="chf-login-dropdown">
                  <button className="chf-login-btn">
                    <LogIn size={15} /> Login <ChevronDown size={12} className="chf-chevron" />
                  </button>
                  <div className="chf-login-menu">
                    <Link to="/login" className="chf-login-menu-item">
                      <UserIcon size={15} /> User Login
                    </Link>
                    <Link to="/register" className="chf-login-menu-item">
                      <ArrowRight size={15} /> Sign Up
                    </Link>
                    <div className="chf-login-menu-divider" />
                    <Link to="/admin/login" className="chf-login-menu-item">
                      <Shield size={15} /> Admin Login
                    </Link>
                  </div>
                </div>
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
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: '0.1em', color: '#ffffff' }}>COLORADO HOME FINDER</span>
                <span style={{ display: 'block', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: 2, fontFamily: "'Inter', sans-serif" }}>Denver Real Estate</span>
              </div>
              <button className="chf-drawer-close" onClick={() => setMobileMenuOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <DrawerNav navLinks={navLinks} location={location} onClose={() => setMobileMenuOpen(false)} />
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
      <main style={{ paddingBottom: !isAdminRoute ? 80 : 0 }}>{children}</main>

      {/* FOOTER */}
      {!isAdminRoute && <Footer />}

      {/* STICKY CTA BAR */}
      {!isAdminRoute && <StickyCtaBar />}
    </div>
  );
};

/* ── Global CTA Buttons Config ── */
const globalCtaButtons = [
  { label: 'Schedule a Showing', path: '/book-showing', icon: Calendar, variant: 'primary' },
  { label: 'Home Valuation', path: '/valuation', icon: HomeIcon, variant: 'outline' },
  { label: 'Cash Offers', path: '/cash-offer', icon: DollarSign, variant: 'outline' },
  { label: 'Talk to an Agent', path: '/contact', icon: MessageCircle, variant: 'outline' },
  { label: 'First Time Buyer', path: '/first-time-buyers', icon: Users, variant: 'outline' },
];

/* ── Drawer Nav with accordion submenus ── */
const DrawerNav = ({ navLinks, location, onClose }) => {
  const [openSub, setOpenSub] = useState(null);

  return (
    <div className="chf-drawer-body">
      {navLinks.map(link => link.children ? (
        <div key={link.name}>
          <button
            className={`chf-drawer-link${link.children.some(c => location.pathname === c.path) ? ' active' : ''}`}
            onClick={() => setOpenSub(openSub === link.name ? null : link.name)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', font: 'inherit', padding: 0 }}>
            <span className="chf-drawer-link" style={{ opacity: 1, transform: 'none', borderBottom: 'none', margin: 0, padding: '18px 0', display: 'flex' }}>
              {link.name}
              <ChevronDown size={14} style={{ transition: 'transform .25s', transform: openSub === link.name ? 'rotate(180deg)' : 'rotate(0)' }} />
            </span>
          </button>
          <div style={{ maxHeight: openSub === link.name ? 300 : 0, overflow: 'hidden', transition: 'max-height .3s ease' }}>
            {link.children.map(sub => (
              <Link key={sub.name} to={sub.path}
                className="chf-drawer-link"
                onClick={onClose}
                style={{ opacity: 1, transform: 'none', paddingLeft: 20, fontSize: 12, color: 'rgba(255,255,255,0.55)', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingTop: 12, paddingBottom: 12 }}>
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <Link key={link.name} to={link.path}
          className={`chf-drawer-link${location.pathname === link.path ? ' active' : ''}`}
          onClick={onClose}>
          {link.name}
          <span className="chf-drawer-arrow">&#8250;</span>
        </Link>
      ))}
    </div>
  );
};

/* ── Sticky CTA Bar Component ── */
const StickyCtaBar = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`chf-sticky-cta${visible ? ' visible' : ''}`}>
      <div className="chf-sticky-cta-inner">
        {globalCtaButtons.map(({ label, path, icon: Icon, variant }) => (
          <Link key={path} to={path} className={`chf-sticky-btn ${variant}`}>
            <Icon size={14} className="chf-sticky-icon" /> {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

/* ── Inline Lead Form Component ── */
const InlineLeadForm = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', intent: 'Buyer' });
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
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, color: '#ffffff' }}>✓</span>
        </div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#ffffff', marginBottom: 4 }}>Thank you!</p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>We'll be in touch within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input type="text" placeholder="Full Name" required value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)', color: '#ffffff', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
      <input type="tel" placeholder="Phone Number" required value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
        style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)', color: '#ffffff', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
      <input type="email" placeholder="Email" required value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)', color: '#ffffff', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
      <textarea placeholder="Message (optional)" value={form.message} rows={3}
        onChange={e => setForm({ ...form, message: e.target.value })}
        style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)', color: '#ffffff', outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical', minHeight: 60 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        {['Buyer', 'Seller'].map(opt => (
          <button key={opt} type="button" onClick={() => setForm({ ...form, intent: opt })}
            style={{ flex: 1, padding: '10px', border: `1px solid ${form.intent === opt ? '#C4956A' : 'rgba(255,255,255,0.12)'}`, backgroundColor: form.intent === opt ? '#C4956A' : 'transparent', color: form.intent === opt ? '#ffffff' : 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s', borderRadius: 6 }}>
            {opt}
          </button>
        ))}
      </div>
      <button type="submit"
        style={{ padding: '14px', backgroundColor: '#1B2A4A', color: '#ffffff', border: 'none', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s', borderRadius: 8 }}>
        Send Message <ArrowRight size={13} />
      </button>
    </form>
  );
};

/* ── Footer Component ── */
const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0F172A', color: '#ffffff', paddingTop: 80, paddingBottom: 40 }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 32px' }}>
        <div className="resp-footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 48, marginBottom: 64 }}>

          {/* Brand */}
          <div>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 16 }}>
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
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20, fontWeight: 600 }}>Quick Links</p>
            {footerQuickLinks.map(link => (
              <Link key={link.name} to={link.path} className="chf-footer-link" style={{ fontSize: 13, padding: '6px 0', letterSpacing: '0.05em' }}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Services */}
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20, fontWeight: 600 }}>Services</p>
            {[['First-Time Buyers', '/first-time-buyers'], ['Cash Offers', '/cash-offer'], ['Sell Before You Buy', '/sell-before-you-buy'], ['Home Valuation', '/valuation'], ['Loan Application', '/loan-application'], ['Book a Showing', '/book-showing']].map(([name, path]) => (
              <Link key={name} to={path} className="chf-footer-link" style={{ fontSize: 13, padding: '6px 0', letterSpacing: '0.05em' }}>
                {name}
              </Link>
            ))}
          </div>

          {/* Lead Form (on every page) */}
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20, fontWeight: 600 }}>Get in Touch</p>
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

        {/* ── Global CTA Buttons ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 40, paddingBottom: 40 }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20, fontWeight: 600, textAlign: 'center' }}>Quick Actions</p>
          <div className="resp-footer-cta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
            {globalCtaButtons.map(({ label, path, icon: Icon }) => (
              <Link key={path} to={path}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', textDecoration: 'none', padding: '12px 24px', borderRadius: 50, color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.04)', transition: 'all 0.25s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C4956A'; e.currentTarget.style.borderColor = '#C4956A'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(196,149,106,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <Icon size={15} /> {label}
              </Link>
            ))}
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
            <a key={i} href={logo.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif", textDecoration: 'none', transition: 'color 0.2s', fontWeight: 600 }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}>{logo.name}</a>
          ) : (
            <span key={i} style={{ fontSize: 10, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{logo.name}</span>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="resp-newsletter" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 48, paddingBottom: 48, marginBottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 28, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>Stay Connected</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Get early access to new listings & market insights.</p>
          </div>
          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: 0 }}>
            <input type="email" placeholder="Enter your email" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, padding: '14px 20px', border: '1px solid rgba(255,255,255,0.15)', borderRight: 'none', backgroundColor: 'transparent', color: '#ffffff', outline: 'none', minWidth: 260, borderRadius: '8px 0 0 8px' }} />
            <button type="submit" style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, padding: '14px 28px', backgroundColor: '#C4956A', color: '#ffffff', border: 'none', cursor: 'pointer', transition: 'background 0.2s', borderRadius: '0 8px 8px 0' }}>
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