Website -  dforj.netlify.app

# 🎯 Goals & Job Tracker (Nexus Productivity OS)

A modern, privacy-focused, local-first productivity workspace built with **React**, **TypeScript**, and **Vite**. It seamlessly combines **Goal Setting**, **Job Application Tracking (Kanban & Calendar)**, **Skill Roadmaps**, and **Smart Task Management** into a single cohesive dashboard.

---

## 🌟 Overview

**Goals & Job Tracker** is designed for professionals, job seekers, and continuous learners who want full control over their daily productivity and career trajectory. 

All your data stays completely private on your device using browser-native **IndexedDB** storage with seamless **JSON Backup & Restore** capabilities.

---

## ✨ Key Features

### 1. 📊 Executive Dashboard & Analytics
- **Today's Overview**: Instant snapshot of pending tasks, goals logged, active job applications, and study hours.
- **Streak & Consistency Engine**: Track current streaks and consistency scores to build lasting habits.
- **Visual Analytics**: Interactive charts showing job application pipeline status, goal completion rates, and learning progress.

### 2. 💼 Job Application Tracker
- **Multiple Views**: Switch effortlessly between a visual **Kanban Pipeline Board** and a scheduled **Calendar View**.
- **Stage Management**: Track applications through every stage — `Saved`, `Applied`, `Application Viewed`, `Shortlisted`, `Interview Scheduled`, `Technical Round`, `HR Round`, `Offer Received`, and more.
- **Comprehensive Details**: Store recruiter contacts, resume versions, salary expectations, notes, job URLs, and application timelines.
- **Target Tracking**: Set and measure daily and monthly job application targets.

### 3. 🎯 Goals & Consistency Heatmap
- **Flexible Goal Cadence**: Define goals with Daily, Weekly, Monthly, or Custom frequencies.
- **Contribution Heatmap**: Visualize your habit consistency with a GitHub-style activity heatmap.
- **Progress Logging**: Record actual values, time spent (minutes/hours), and daily reflection notes.

### 4. 🧠 Skill Roadmap & Learning Tracker
- **Skill Progression**: Track skills across `Beginner`, `Intermediate`, and `Advanced` proficiencies.
- **Study Log System**: Log study hours, topics covered, reference links, and key takeaways.
- **Daily Learning Targets**: Set target study hours to ensure continuous skill improvement.

### 5. ✅ Smart Task & Todo Management
- **Prioritization**: Organize tasks by `High`, `Medium`, and `Low` priority.
- **Subtasks & Checklists**: Break down larger tasks into actionable subtasks.
- **Due Dates & Reminders**: Keep track of deadlines with date and time tags.
- **Display Modes**: Toggle between detailed List View and Compact Grid View.

### 6. 🔍 Global Search & Quick Actions (Ctrl + K)
- Press `Ctrl + K` (or `Cmd + K`) anywhere to instantly search across all tasks, job applications, goals, and skills.
- Quick action modal triggers for fast data entry from anywhere in the app.

### 7. 🔒 Privacy & Offline-First Storage
- **Local-First**: Powered by browser-native IndexedDB (`idb-keyval`) with automatic localStorage fallback.
- **Zero Cloud Dependence**: Your data never leaves your machine.
- **Data Portability**: Full JSON Data Export and Import/Restore functionality in Settings.

---

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) (with Hooks & Context API)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Icons**: Lucide Icons / SVG Asset Library
- **State & Storage**: React Context + IndexedDB (`idb-keyval`) + LocalStorage
- **Styling**: Modern dark-mode UI with sleek glassmorphism and responsive design

---

## 🚀 Getting Started & How to Use

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher recommended) and `npm` installed.

### 1. Clone or Download Repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd "Goals & Job Tracker"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to the local URL shown in your terminal (usually `http://localhost:5173`).

### 4. Build for Production
To create an optimized production build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 📂 Project Structure

```plaintext
Goals & Job Tracker/
├── public/                 # Static assets (favicons, icons)
├── src/
│   ├── assets/             # Images and SVG illustrations
│   ├── components/         # Reusable UI component modules
│   │   ├── dashboard/      # Analytics, charts, and today's summary
│   │   ├── goals/          # Habit goals, modal forms, and heatmap
│   │   ├── jobs/           # Kanban board, calendar view, job modals
│   │   ├── settings/       # Data backup/restore and app preferences
│   │   ├── skills/         # Skill roadmap and study logging
│   │   ├── todos/          # Todo items, checklists, and forms
│   │   ├── GlobalSearchModal.tsx  # Fast Cmd/Ctrl+K search
│   │   └── Navbar.tsx      # Sidebar and mobile navigation bar
│   ├── context/            # Global AppContext state provider
│   ├── services/           # IndexedDB & LocalStorage persistence layer
│   ├── types/              # TypeScript interfaces and data models
│   ├── utils/              # Streak calculation and formatting helpers
│   ├── App.tsx             # Main layout & router orchestration
│   ├── main.tsx            # React application entry point
│   └── index.css           # Global design system & theme styles
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules for node_modules and builds
└── README.md               # Project documentation
```

---

## 💡 How to Use the App

1. **Dashboard**: Check your daily streak, today's schedule, and open high-priority tasks.
2. **Todos**: Click `Add Todo` to capture your daily tasks. Break them down with subtasks and assign priorities.
3. **Jobs**: Track job applications as you submit them. Drag or change status through `Applied` ➔ `Interview` ➔ `Offer`. Use the Calendar view to prepare for upcoming interview dates.
4. **Goals**: Define daily habits (e.g., LeetCode, Reading, Exercise). Log progress each day to turn your consistency heatmap green.
5. **Skills**: Add technologies you want to master (e.g., React, System Design, Python). Log daily study sessions to track accumulated hours.
6. **Backup Data**: Periodically go to **Settings** and click **Export JSON Backup** to keep a secure local copy of all your tracked progress.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
