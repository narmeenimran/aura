htht# YOUR PROJECT TITLE
#### Video Demo:  <URL HERE>
#### Description:
Aura — A Mobile‑First Productivity Web App
A modern, iOS‑inspired productivity environment combining flashcards, notes, a Pomodoro timer, and a customizable user experience.

Overview
Aura is a mobile‑first productivity web application designed to feel like a native iOS app. It brings together four core tools—Flashcards, Notes, a Pomodoro Timer, and a customizable Settings panel—into a single, elegant interface. The project focuses heavily on user experience, visual polish, and intuitive interaction. Every screen, animation, and component is crafted to feel soft, modern, and familiar to users who enjoy Apple’s design language.

The app uses localStorage to persist all user data, including decks, flashcards, notes, timer preferences, theme settings, and the user’s name. This ensures that the experience feels personal and consistent across sessions without requiring a backend or authentication system.

Aura was built with the intention of creating a clean, cohesive, and delightful productivity tool that feels more like a native mobile app than a traditional website. The project emphasizes UI/UX design, modular JavaScript logic, and thoughtful architectural decisions.

Project Structure
The project consists of three main files that I wrote and maintained:

1. index.html — Application Structure
This file defines the full layout of the application. It contains:

The onboarding screen where users enter their name

The main app shell

Five primary screens: Home, Flashcards, Notes, Timer, and Settings

A bottom navigation bar styled like iOS

Overlays for the profile editor and note editor

The slide‑in deck viewer for flashcards

Input fields for the customizable Pomodoro timer

The HTML is intentionally structured with semantic sections and clear IDs to make JavaScript interactions predictable and maintainable. I debated whether to use a component‑based framework like React, but ultimately chose pure HTML + JS to maintain simplicity and avoid unnecessary overhead for a mobile‑first project.

2. style.css — Full iOS‑17 Soft‑Glass Design System
This is the largest and most visually impactful file in the project. It implements a complete design system inspired by iOS 17, including:

Soft‑glass backgrounds

Medium blur effects

Rounded corners

Subtle shadows

A purple accent color

Responsive mobile‑first layout

A dainty, centered onboarding card

A redesigned timer picker

Equal‑sized flashcard buttons

A full dark mode theme

A full‑screen note editor styled like Apple Notes

One of the biggest design debates was how “strong” the glass effect should be. I experimented with subtle, medium, and strong blur levels before settling on medium glass, which strikes the best balance between readability and aesthetic depth.

Another major decision was whether to keep the original CSS structure or rewrite it entirely. I ultimately chose a full rewrite to ensure consistency, remove legacy styles, and create a unified design language across all screens.

3. app.js — Application Logic & State Management
This file contains all the interactive logic for the app. It handles:

Onboarding flow

Name saving and name‑changing in Settings

Navigation between screens

Flashcard deck creation, editing, deletion

Flashcard flipping, next/prev navigation, and progress tracking

Notes creation, editing, deletion

Opening and closing overlays

Customizable Pomodoro timer (hours + minutes)

Timer start, pause, reset logic

Dark mode toggle

LocalStorage persistence for all data

One of the most important architectural decisions was to keep all state in localStorage rather than using a backend. This keeps the app lightweight, fast, and fully offline‑capable. I also debated whether to modularize the JavaScript into separate files (e.g., flashcards.js, notes.js), but chose a single file for simplicity and to avoid unnecessary complexity for a project of this scale.

Design Philosophy & Decisions
Mobile‑First Approach
Aura is designed primarily for mobile devices. This influenced nearly every design decision:

Full‑screen overlays

Large touch‑friendly buttons

Minimal text clutter

Smooth transitions

A bottom navigation bar like iOS

I intentionally avoided desktop‑specific UI elements to maintain a clean, focused experience.

iOS‑Inspired Visual Language
The entire interface is built around Apple’s modern design principles:

Soft glassmorphism

Rounded geometry

Subtle shadows

Clean typography

Minimalist spacing

This aesthetic choice was deliberate: I wanted the app to feel familiar, calming, and premium.

User Personalization
Aura remembers:

The user’s name

Their theme preference (light/dark)

Their flashcard decks

Their notes

Their timer settings

This creates a sense of ownership and continuity. Adding the ability to change the user’s name in Settings was a thoughtful addition to reinforce personalization.

Simplicity Over Complexity
I intentionally avoided frameworks, databases, or authentication systems. The goal was to create a polished, self‑contained productivity tool that works instantly and offline.

This decision also made the project more transparent and easier to understand for anyone reading the code.

Conclusion
Aura is a fully‑featured, mobile‑first productivity app that blends thoughtful design with practical functionality. It demonstrates strong UI/UX sensibilities, clean JavaScript architecture, and a cohesive visual identity. The project showcases my ability to design, structure, and implement a complete application from scratch—balancing aesthetics, usability, and maintainability.

I’m proud of how polished, intuitive, and delightful the final experience feels. Aura is more than just a school project; it’s a product I would genuinely use myself.