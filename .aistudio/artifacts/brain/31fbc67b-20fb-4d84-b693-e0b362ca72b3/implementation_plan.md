# Implementation Plan - Virtual Idanre Modern Community Platform Overhaul

This plan outlines the complete transformation of the application into **Virtual Idanre**, a modern, vibrant, community-first platform tailored for youth, elders, and especially secondary school students, featuring genuine local towns and streets, a marketplace, heritage archives, dating/meetups (with sign-up guard), real media uploads, social media connectors, and advanced Gemini AI capabilities.

## User Request Summary & Key Architectural Pillars

1. **Community-Based & Idanre-Centric**: 
   - Completely remove Ifedore references across all data models, navigation, and components.
   - Focus entirely on Idanre cultural heritage, local towns, streets, and grassroots community life.
2. **Priority Demographic - Secondary School Students & All Generations**:
   - Dedicated **Student Hub** with WAEC/NECO prep resources, scholarship alerts, coding & vocational skills, and mentorship.
   - Friendly and intuitive UI for elders and youth alike (high contrast, clear typography, voice/audio assistance).
3. **Towns & Streets Instead of Wards**:
   - Replace administrative "wards" with genuine Idanre towns and prominent streets (e.g., Odode, Alade, Atosin, Odo-Oja, Isalu, Oke-Idanre, Owena, and streets such as Agunbiade St, Iloro St, Olofin Rd, Aaye St, Station Rd, etc.).
4. **Marketplace**:
   - Fully interactive local marketplace for agricultural produce (Idanre cocoa, yam, palm oil), fashion, crafts, and tech gear with seller contact & upload capabilities.
5. **Political Consciousness**:
   - Grassroots town halls, representative accountability trackers, and civil project monitoring across Idanre streets.
6. **Skills Showcasing & Acquisition**:
   - Artisan directory, apprentice matching, and digital/vocational training classes.
7. **Heritage & Culture Place (Kings, Chiefs & Subjects)**:
   - Interactive archive of the traditional ruler (His Imperial Majesty, the Owa of Idanre Land), traditional chiefs, cultural festivals (Olojo festival history, 682 ancient steps), with custom edit/download features.
8. **Dating & Meetup Feature (Sign-up Guarded)**:
   - Community social mixer and meetup board. Requires user sign-up/authentication before viewing profiles or sending messages.
9. **Real Images & File Access**:
   - Multi-modal upload system allowing users to upload real photos from device camera/gallery, paste image URLs, or use file picker with permission requests.
10. **Social Integrations & Gemini AI Enhancement**:
    - Connect TikTok, Facebook, Twitter, Instagram pages.
    - Deep Gemini AI integration across 5 specialized modules:
      - **AI Youth Study Coach** (homework & exam help)
      - **AI Cultural Historian** (answering questions about Idanre history & proverbs)
      - **AI Marketplace Valuer & Assistant**
      - **AI Political Fact-Checker**
      - **AI Community Moderator & Matchmaker**

---

## Proposed Changes

### 1. Data Models & Context (`src/types/index.ts`, `src/context/AppContext.tsx`)
- Update data types to replace wards with `town` and `street` fields.
- Add robust state management for user authentication (Sign-up state required for Dating/Meetups), Marketplace items, Heritage registry (Kings/Chiefs/Subjects with edit/download support), Skill directory, and Social media links.
- Implement real file upload handlers supporting Base64 / LocalStorage persistence for user-uploaded photos.

### 2. Server-Side Gemini API (`server.ts`)
- Implement robust server-side Gemini endpoints using `@google/genai` (`gemini-3.8-flash` and `gemini-3.1-flash-lite-image`) for:
  - `/api/gemini/study-helper` (Student academic mentor)
  - `/api/gemini/cultural-historian` (Idanre history & proverbs guide)
  - `/api/gemini/marketplace-assistant` (Pricing & product descriptions)
  - `/api/gemini/fact-check` (Civic & political claim auditing)

### 3. Component Architecture & Navigation (`src/components/`)
- **Top Navigation & HomeTab (`HomeTab.tsx`, `Navbar.tsx`)**:
  - Clean 3-zone Top Bar.
  - Striking grid of core menus (`Town & Street Dispatches`, `Student & Youth Hub`, `Idanre Marketplace`, `Heritage & Royal Court`, `Skills & Apprenticeships`, `Dating & Meetups [Sign-up Required]`, `Civic & Political Voice`, `Social & Media Connectors`).
  - Sliding carousel for live weather, dispatches, and featured previews.
- **Student Hub (`StudentHubTab.tsx`)**:
  - WAEC/JAMB exam practice, scholarship board, coding bootcamps, and career mentorship.
- **Marketplace (`MarketplaceTab.tsx`)**:
  - Browse and list local goods, agricultural produce, crafts, and tech gear with photo upload and contact seller buttons.
- **Heritage & Royal Court (`HeritageTab.tsx`)**:
  - Traditional rulers (Owa of Idanre), high chiefs, ancient festivals, and historical sites with user edit/download capabilities.
- **Dating & Meetups (`DatingMeetupTab.tsx`)**:
  - Guarded access modal requiring name, age, town, and interests before entry. Browse verified local singles and community hangout groups.
- **Towns & Streets Explorer (`TownsStreetsTab.tsx`)**:
  - Location-based community bulletin filtered by genuine Idanre towns and streets.
- **Social Connectors (`SocialConnectorsTab.tsx`)**:
  - Official and community social page connectors (TikTok, Facebook, Twitter/X, Instagram) + File Permission Request & Upload Manager.
- **Gemini AI Assistant Hub (`AiAssistantTab.tsx`)**:
  - Interactive multi-agent AI assistant for students, historians, traders, and citizens.

---

## Verification Plan

1. **Automated Verification**:
   - Run `lint_applet` and `compile_applet` to ensure zero compilation or TypeScript errors.
2. **Functional Verification**:
   - Verify Dating/Meetup requires sign-up before opening.
   - Verify marketplace item creation with real image upload.
   - Verify Town & Street filtering across Idanre locations.
   - Verify Gemini AI endpoints return proper AI-generated responses.
