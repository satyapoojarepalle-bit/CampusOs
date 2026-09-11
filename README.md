# 🎓 CampusOS

### A Student-Focused Campus Management & Productivity Web App

CampusOS is a frontend web application designed to help students manage their
academic activities, assignments, daily tasks, and personal preferences from
one simple dashboard.

🔗 **Live Demo:** https://campus-os-lac-one.vercel.app  
🔗 **GitHub:** https://github.com/satyapoojarepalle-bit/CampusOs

---

## 📌 Problem Statement

Students often manage assignments, daily tasks, and academic activities across
multiple platforms or notebooks. This makes it difficult to keep track of
pending work and maintain an organized daily routine.

**CampusOS** aims to bring these essential student productivity features
together into one responsive and easy-to-use interface.

---

## 🎯 Target Users

College students who want a simple digital workspace to organize:

- 📚 Assignments
- ✅ Daily tasks
- 📅 Academic activities
- ⚙️ Personal preferences

---

# 🚀 Development Tracker

> CampusOS is currently under active development.  
> This tracker reflects the current implementation and upcoming work.

### 🏗️ Project Setup

- [x] Project initialized
- [x] GitHub repository created
- [x] Frontend project structure
- [x] Vercel deployment
- [ ] Final production cleanup

---

## ✨ Core Features Tracker

### 📊 Dashboard

- [ ] Dashboard interface
- [ ] Academic overview
- [ ] Productivity summary
- [ ] Quick navigation
- [ ] Responsive dashboard layout

**Status:** 🟡 In Progress

---

### 📝 Assignments

- [ ] Add assignments
- [ ] View assignment details
- [ ] Track academic work
- [ ] Manage pending assignments
- [ ] Assignment completion status
- [ ] Assignment persistence

**Status:** 🔵 Planned

---

### ✅ My Day

- [ ] Add daily tasks
- [ ] View today's tasks
- [ ] Mark tasks as completed
- [ ] Manage daily activities
- [ ] Persist tasks after refresh

**Status:** 🔵 Planned

---

### ⚙️ Settings

- [ ] Student preferences
- [ ] Application settings
- [ ] Personalization
- [ ] Theme preferences

**Status:** 🔵 Planned

---

## 💾 Data & State Management

- [ ] LocalStorage integration
- [ ] Persist assignments
- [ ] Persist daily tasks
- [ ] Persist user preferences
- [ ] Restore state after refresh
- [ ] Handle empty stored data gracefully

**Status:** 🔵 Planned

---

## 📱 Responsive Design Tracker

- [ ] Desktop layout
- [ ] Tablet layout
- [ ] Mobile layout
- [ ] 375px viewport testing
- [ ] No horizontal scrolling
- [ ] Responsive navigation
- [ ] Responsive forms

**Status:** 🔵 Planned

---

# 🧪 Validation & Robustness Tracker

The following checks are planned based on the hackathon stress-test
requirements.

### 📱 Mobile Testing

- [ ] Test at 375px width
- [ ] Check layout reflow
- [ ] Check navigation usability
- [ ] Check for horizontal scrolling

### 📝 Form Validation

- [ ] Empty form validation
- [ ] Inline validation messages
- [ ] Invalid input handling

### 📏 Long Input

- [ ] Test 400-character input
- [ ] Prevent layout breaking
- [ ] Truncate or wrap long content where required

### 🖱️ Duplicate Submission

- [ ] Prevent rapid duplicate submissions
- [ ] Disable submit button while processing

### 🔍 Empty States

- [ ] Empty assignment state
- [ ] Empty task state
- [ ] Search with no results
- [ ] User-friendly empty-state messages

### ⏳ Loading States

- [ ] Loading indicators
- [ ] Loading state for asynchronous operations

### ⚠️ Error Handling

- [ ] Request failure messages
- [ ] Offline/error scenario
- [ ] Prevent infinite loading states

### 🔄 Refresh Persistence

- [ ] Test refresh during active flow
- [ ] Preserve important application state
- [ ] Graceful recovery after refresh

### 🧹 Final Quality Check

- [ ] No console errors
- [ ] No broken navigation
- [ ] No overlapping elements
- [ ] Final browser testing

---

# 🎨 UI / UX Tracker

### Design

- [ ] Clean navigation
- [ ] Consistent spacing
- [ ] Readable typography
- [ ] Clear visual hierarchy
- [ ] Student-friendly interface

### Interaction

- [ ] Hover states
- [ ] Focus states
- [ ] Button feedback
- [ ] Form feedback
- [ ] Delete confirmation where required

### Accessibility & Usability

- [ ] Keyboard-friendly interaction
- [ ] Visible focus states
- [ ] Readable text
- [ ] Mobile-friendly controls

---

# 🛠️ Tech Stack

| Technology | Purpose | Status |
|:---|:---|:---:|
| HTML | Page structure | ✅ |
| CSS | Styling & responsive design | ✅ |
| JavaScript | Frontend functionality | ✅ |
| React | UI development | ✅ |
| TypeScript | Application logic | ✅ |
| LocalStorage | Persistent client-side data | 🔵 |
| Vercel | Deployment | ✅ |

---

# 🏗️ Project Structure

```text
CampusOs/
│
├── project-final/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
