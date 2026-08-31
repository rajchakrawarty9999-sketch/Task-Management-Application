# ⚡ TaskEngine PRO

<div align="center">

![TaskEngine PRO Banner](https://img.shields.io/badge/TaskEngine_PRO-v2.0_Enterprise-caa457?style=for-the-badge&logo=shield&logoColor=black)
![React 18](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Express](https://img.shields.io/badge/Node_Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io_Realtime-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

### Ultra-Premium Real-Time Task Management SaaS

*Obsidian Black & Champagne Gold visual aesthetic · Interactive Kanban Workflows · Warm Ivory Executive Calendar · Real-Time WebSockets · Supabase PostgreSQL Persistence*

[Features](#-key-features) • [UI Windows](#-ui-windows--interface-overview) • [Quick Start](#-quick-start) • [Database](#-supabase-database-setup) • [Architecture](#-architecture)

</div>

---

## ✨ Key Features

- **⚡ Real-Time Collaboration**: Bi-directional Socket.io WebSocket sync for instant task movements, team presence, and live updates without page refreshes.
- **📋 Interactive Kanban Board**: 4-column workflow (**Backlog ➔ In Progress ➔ In Review ➔ Done**) with fluid drag-and-drop, domain badges, priority levels, and celebratory confetti.
- **📅 Warm Ivory Productivity Calendar**: Luxury `#F5F1E8` paper surface, Indian Festivals 2026 dataset, meetings/reminders scheduling, and drag-and-drop due date rescheduling.
- **🔔 Live Notifications Suite**: Top header alert bell with unread badge counter, **instant hover/click auto-mark as read**, and **1-click "All Read"** inbox clear.
- **📝 Granular Subtasks & Discussions**: Interactive checklist progress meters (`3/4 completed`) and real-time team conversation threads.
- **🛡️ Enterprise Persistence**: Dual-layer permanent storage with remote **Supabase PostgreSQL** + local snapshot backup for zero data loss.
- **📱 100% Fluid Responsive Layout**: Tested across all screen sizes (320px to 1920px) with collapsible navigation drawer (`Ctrl + B`).

---

## 🖥️ UI Windows & Interface Overview

| Window / Module | Aesthetic & Highlights | Key Capabilities |
| :--- | :--- | :--- |
| **Executive Dashboard** | Deep Obsidian & Metallic Gold | Total deliverables count, active sprint velocity, completion rate %, and live team audit stream. |
| **Kanban Workflow Board** | 4-Stage Column Cards | Drag & Drop state transitions, domain badges, subtask progress meters (`2/3`), and assignee avatars. |
| **Productivity Calendar** | Warm Ivory (`#F5F1E8`) & Gold | 2026 Indian Festivals & Holidays, custom meeting scheduler, Month/Week/Day/Agenda views. |
| **Notifications Drawer** | Live Popover Stream | Real-time event notifications, hover-to-read triggers, and 1-click **All Read** inbox reset. |
| **Task Detail Modal** | Structured Checklist Card | Priority selector, domain tagging, subtask add/toggle/delete, and timestamped comment thread. |

---

## 🏛️ Architecture

```
  TaskEngine PRO UI  ──►  React Context (Task / Auth)  ──►  Express REST & WebSockets  ──►  Supabase PostgreSQL DB
```

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Hishakti07/Task-Management.git
cd Task-Management
```

### 2. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000` with WebSockets active.*

### 3. Start Frontend App
```bash
cd frontend
npm install
npm run dev
```
*Frontend opens on `http://localhost:5173`.*

---

## 🗄️ Supabase Database Setup

1. Open your project on the [Supabase Dashboard](https://supabase.com).
2. Go to **SQL Editor**.
3. Run the complete schema script from [`supabase_schema.sql`](supabase_schema.sql).
4. Tables for `users`, `tasks`, `notifications`, `calendar_events`, and `activities` with Row Level Security (RLS) and Realtime will be ready immediately.

---

<div align="center">
  <sub>© 2026 TaskEngine PRO. Built for high-performance engineering teams.</sub>
</div>
