import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

type LostItem = {
  id: number;
  name: string;
  location: string;
  date: string;
  type: "Lost" | "Found";
};

const attendanceData = [
  { subject: "Database Systems", attended: 33, total: 40 },
  { subject: "Java Programming", attended: 41, total: 45 },
  { subject: "Computer Networks", attended: 29, total: 38 },
  { subject: "Machine Learning", attended: 36, total: 42 },
];

const assignments = [
  {
    id: 1,
    title: "DBMS Normalization",
    subject: "Database Systems",
    due: "Sep 12",
    status: "Urgent",
    progress: 70,
  },
  {
    id: 2,
    title: "Java OOP Assignment",
    subject: "Java Programming",
    due: "Sep 14",
    status: "Pending",
    progress: 40,
  },
  {
    id: 3,
    title: "Computer Networks Report",
    subject: "Computer Networks",
    due: "Sep 16",
    status: "Pending",
    progress: 20,
  },
  {
    id: 4,
    title: "ML Classification Model",
    subject: "Machine Learning",
    due: "Sep 18",
    status: "On Track",
    progress: 80,
  },
];

const lostItems: LostItem[] = [
  {
    id: 1,
    name: "Black Backpack",
    location: "CSE Block",
    date: "Sep 9",
    type: "Lost",
  },
  {
    id: 2,
    name: "Student ID Card",
    location: "Library",
    date: "Sep 10",
    type: "Found",
  },
  {
    id: 3,
    name: "Blue Water Bottle",
    location: "Canteen",
    date: "Sep 8",
    type: "Lost",
  },
  {
    id: 4,
    name: "Scientific Calculator",
    location: "ECE Block",
    date: "Sep 7",
    type: "Found",
  },
];

const schedule = [
  {
    time: "09:00",
    subject: "Database Systems",
    room: "Room 204",
  },
  {
    time: "11:00",
    subject: "Java Programming",
    room: "Lab 3",
  },
  {
    time: "14:00",
    subject: "Machine Learning",
    room: "Room 301",
  },
  {
    time: "16:00",
    subject: "Computer Networks",
    room: "Room 108",
  },
];

function getSavedTasks(): Task[] {
  try {
    const saved = localStorage.getItem("campusos_tasks");

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((item) => {
      if (typeof item === "string") {
        return {
          id: Date.now() + Math.random(),
          title: item,
          completed: false,
        };
      }

      return {
        id: Number(item.id) || Date.now() + Math.random(),
        title: String(item.title || ""),
        completed: Boolean(item.completed),
      };
    });
  } catch {
    return [];
  }
}

export default function App() {
  const [page, setPage] = useState("Dashboard");

  const [lostSearch, setLostSearch] = useState("");
  const [assignmentSearch, setAssignmentSearch] = useState("");

  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem("campusos_name") || "";
  });

  const [department, setDepartment] = useState(() => {
    return localStorage.getItem("campusos_department") || "CSE";
  });

  const [year, setYear] = useState(() => {
    return localStorage.getItem("campusos_year") || "2nd Year";
  });

  const [task, setTask] = useState("");

  const [tasks, setTasks] = useState<Task[]>(getSavedTasks);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("campusos_theme") === "dark";
  });

  const [showAddLostItem, setShowAddLostItem] = useState(false);

  const [newLostItem, setNewLostItem] = useState({
    name: "",
    location: "",
    type: "Lost" as "Lost" | "Found",
  });

  const [reportedItems, setReportedItems] = useState<LostItem[]>(() => {
    try {
      const saved = localStorage.getItem("campusos_reported_items");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("campusos_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("campusos_name", studentName);
    localStorage.setItem("campusos_department", department);
    localStorage.setItem("campusos_year", year);
  }, [studentName, department, year]);

  useEffect(() => {
    localStorage.setItem(
      "campusos_reported_items",
      JSON.stringify(reportedItems),
    );
  }, [reportedItems]);

  useEffect(() => {
    localStorage.setItem(
      "campusos_theme",
      darkMode ? "dark" : "light",
    );
  }, [darkMode]);

  const allLostItems = [...reportedItems, ...lostItems];

  const filteredAssignments = assignments.filter((item) => {
    const search = assignmentSearch.toLowerCase();

    return (
      item.title.toLowerCase().includes(search) ||
      item.subject.toLowerCase().includes(search)
    );
  });

  const filteredLostItems = allLostItems.filter((item) => {
    const search = lostSearch.toLowerCase();

    return (
      item.name.toLowerCase().includes(search) ||
      item.location.toLowerCase().includes(search) ||
      item.type.toLowerCase().includes(search)
    );
  });

  const completedTasks = tasks.filter((item) => item.completed).length;

  const taskProgress =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  const pendingAssignments = assignments.filter(
    (item) => item.status !== "On Track",
  ).length;

  function addTask() {
    const trimmed = task.trim();

    if (!trimmed) {
      return;
    }

    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title: trimmed,
        completed: false,
      },
    ]);

    setTask("");
  }

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item,
      ),
    );
  }

  function deleteTask(id: number) {
    setTasks((current) =>
      current.filter((item) => item.id !== id),
    );
  }

  function clearCompletedTasks() {
    setTasks((current) =>
      current.filter((item) => !item.completed),
    );
  }

  function reportLostItem() {
    if (
      !newLostItem.name.trim() ||
      !newLostItem.location.trim()
    ) {
      alert("Please enter the item name and location.");
      return;
    }

    const item: LostItem = {
      id: Date.now(),
      name: newLostItem.name.trim(),
      location: newLostItem.location.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      type: newLostItem.type,
    };

    setReportedItems((current) => [item, ...current]);

    setNewLostItem({
      name: "",
      location: "",
      type: "Lost",
    });

    setShowAddLostItem(false);
  }

  function saveSettings() {
    localStorage.setItem("campusos_name", studentName);
    localStorage.setItem("campusos_department", department);
    localStorage.setItem("campusos_year", year);

    alert("Settings saved successfully.");
  }

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 17) {
      return "Good afternoon";
    }

    return "Good evening";
  }

  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, Arial, sans-serif;
          background: #f5f7fb;
        }

        button,
        input,
        select {
          font: inherit;
        }

        .app {
          min-height: 100vh;
          background: #f5f7fb;
          color: #172033;
        }

        .app.dark {
          background: #111827;
          color: #f3f4f6;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 28px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .dark .topbar {
          background: #172033;
          border-color: #293449;
        }

        .brand {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .brand span {
          color: #4f46e5;
        }

        .profile {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #667085;
        }

        .dark .profile {
          color: #b8c0d0;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #4f46e5;
          color: white;
          font-weight: 700;
        }

        .layout {
          display: flex;
          min-height: calc(100vh - 69px);
        }

        .sidebar {
          width: 230px;
          padding: 22px 14px;
          background: white;
          border-right: 1px solid #e5e7eb;
        }

        .dark .sidebar {
          background: #172033;
          border-color: #293449;
        }

        .nav-title {
          padding: 0 12px 10px;
          font-size: 11px;
          font-weight: 700;
          color: #98a2b3;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .nav-button {
          width: 100%;
          margin-bottom: 5px;
          padding: 11px 13px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #667085;
          text-align: left;
          cursor: pointer;
          transition: 0.2s;
        }

        .nav-button:hover {
          background: #f2f4f7;
          color: #344054;
        }

        .nav-button.active {
          background: #eef2ff;
          color: #4338ca;
          font-weight: 700;
        }

        .dark .nav-button {
          color: #b8c0d0;
        }

        .dark .nav-button:hover {
          background: #202b40;
        }

        .dark .nav-button.active {
          background: #29345c;
          color: #c7d2fe;
        }

        .content {
          flex: 1;
          max-width: 1250px;
          margin: 0 auto;
          padding: 30px;
          width: 100%;
        }

        .page-heading {
          margin-bottom: 24px;
        }

        .eyebrow {
          color: #667085;
          font-size: 13px;
          margin-bottom: 7px;
        }

        .dark .eyebrow {
          color: #aab4c6;
        }

        h1 {
          margin: 0;
          font-size: 31px;
          letter-spacing: -0.8px;
        }

        h2 {
          margin: 0;
          font-size: 21px;
        }

        .subtitle {
          margin-top: 7px;
          color: #667085;
        }

        .dark .subtitle {
          color: #aab4c6;
        }

        .welcome {
          padding: 24px;
          border-radius: 16px;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: white;
          margin-bottom: 20px;
          box-shadow: 0 12px 30px rgba(79, 70, 229, 0.18);
        }

        .welcome h2 {
          margin-bottom: 7px;
        }

        .welcome p {
          margin: 0;
          opacity: 0.9;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 20px;
        }

        .card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 19px;
        }

        .dark .card {
          background: #172033;
          border-color: #293449;
        }

        .stat-label {
          color: #667085;
          font-size: 13px;
          margin-bottom: 9px;
        }

        .dark .stat-label {
          color: #aab4c6;
        }

        .stat-value {
          font-size: 27px;
          font-weight: 800;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          gap: 20px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .schedule-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid #eaecf0;
        }

        .dark .schedule-item {
          border-color: #293449;
        }

        .schedule-item:last-child {
          border-bottom: 0;
        }

        .time {
          width: 65px;
          font-weight: 700;
          font-size: 14px;
        }

        .subject {
          flex: 1;
        }

        .subject strong {
          display: block;
          margin-bottom: 4px;
        }

        .muted {
          color: #667085;
          font-size: 13px;
        }

        .dark .muted {
          color: #aab4c6;
        }

        .streak {
          font-size: 42px;
          font-weight: 800;
          margin: 10px 0;
        }

        .progress {
          height: 8px;
          overflow: hidden;
          border-radius: 999px;
          background: #eaecf0;
          margin-top: 8px;
        }

        .progress-bar {
          height: 100%;
          border-radius: inherit;
          background: #4f46e5;
        }

        .search-row {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
        }

        .input {
          width: 100%;
          padding: 11px 13px;
          border: 1px solid #d0d5dd;
          border-radius: 9px;
          outline: none;
          background: white;
          color: #172033;
        }

        .dark .input {
          background: #111827;
          border-color: #374151;
          color: white;
        }

        .input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }

        .button {
          border: 0;
          border-radius: 9px;
          padding: 11px 16px;
          background: #4f46e5;
          color: white;
          font-weight: 700;
          cursor: pointer;
        }

        .button:hover {
          background: #4338ca;
        }

        .button.secondary {
          background: #eef2ff;
          color: #4338ca;
        }

        .dark .button.secondary {
          background: #29345c;
          color: #c7d2fe;
        }

        .button.danger {
          background: #fee4e2;
          color: #b42318;
        }

        .dark .button.danger {
          background: #4a2529;
          color: #fda29b;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th,
        .table td {
          padding: 14px 10px;
          text-align: left;
          border-bottom: 1px solid #eaecf0;
        }

        .dark .table th,
        .dark .table td {
          border-color: #293449;
        }

        .table th {
          color: #667085;
          font-size: 12px;
          text-transform: uppercase;
        }

        .dark .table th {
          color: #aab4c6;
        }

        .badge {
          display: inline-block;
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          background: #f2f4f7;
        }

        .badge.urgent {
          background: #fee4e2;
          color: #b42318;
        }

        .badge.track {
          background: #dcfae6;
          color: #067647;
        }

        .badge.pending {
          background: #fff4cc;
          color: #8a5a00;
        }

        .task-input {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
        }

        .task-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 0;
          border-bottom: 1px solid #eaecf0;
        }

        .dark .task-item {
          border-color: #293449;
        }

        .checkbox {
          width: 21px;
          height: 21px;
          cursor: pointer;
          accent-color: #4f46e5;
        }

        .task-title {
          flex: 1;
          font-size: 15px;
        }

        .task-title.completed {
          text-decoration: line-through;
          color: #98a2b3;
        }

        .task-actions {
          display: flex;
          gap: 7px;
        }

        .icon-button {
          border: 0;
          background: transparent;
          cursor: pointer;
          padding: 6px 8px;
          border-radius: 7px;
          color: #667085;
        }

        .icon-button:hover {
          background: #f2f4f7;
        }

        .dark .icon-button:hover {
          background: #293449;
        }

        .empty {
          text-align: center;
          padding: 35px 10px;
          color: #667085;
        }

        .dark .empty {
          color: #aab4c6;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field label {
          font-size: 13px;
          font-weight: 700;
        }

        .full {
          grid-column: 1 / -1;
        }

        .profile-preview {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 25px;
          padding: 18px;
          border-radius: 12px;
          background: #f8f9fc;
        }

        .dark .profile-preview {
          background: #111827;
        }

        .large-avatar {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #4f46e5;
          color: white;
          font-size: 20px;
          font-weight: 800;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(15, 23, 42, 0.55);
        }

        .modal {
          width: min(480px, 100%);
          padding: 23px;
          border-radius: 16px;
          background: white;
          box-shadow: 0 25px 70px rgba(0,0,0,0.2);
        }

        .dark .modal {
          background: #172033;
        }

        .modal h2 {
          margin-bottom: 18px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .lost-card {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #eaecf0;
        }

        .dark .lost-card {
          border-color: #293449;
        }

        .lost-card:last-child {
          border-bottom: 0;
        }

        .lost-info strong {
          display: block;
          margin-bottom: 5px;
        }

        .lost-meta {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        @media (max-width: 900px) {
          .sidebar {
            width: 185px;
          }

          .stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .grid-2 {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .topbar {
            padding: 14px 16px;
          }

          .profile-text {
            display: none;
          }

          .layout {
            display: block;
          }

          .sidebar {
            width: 100%;
            display: flex;
            gap: 5px;
            overflow-x: auto;
            padding: 9px;
            border-right: 0;
            border-bottom: 1px solid #e5e7eb;
          }

          .dark .sidebar {
            border-bottom-color: #293449;
          }

          .nav-title {
            display: none;
          }

          .nav-button {
            white-space: nowrap;
            width: auto;
            margin: 0;
          }

          .content {
            padding: 20px 15px;
          }

          h1 {
            font-size: 26px;
          }

          .stats {
            grid-template-columns: 1fr 1fr;
          }

          .settings-grid {
            grid-template-columns: 1fr;
          }

          .full {
            grid-column: auto;
          }

          .table {
            min-width: 650px;
          }

          .table-wrapper {
            overflow-x: auto;
          }
        }

        @media (max-width: 450px) {
          .stats {
            grid-template-columns: 1fr;
          }

          .task-input,
          .search-row {
            flex-direction: column;
          }

          .lost-card {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>

      <header className="topbar">
        <div className="brand">
          Campus<span>OS</span>
        </div>

        <div className="profile">
          <div className="profile-text">
            {department} · {year}
          </div>

          <div className="avatar">
            {(studentName || "S").charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="nav-title">Workspace</div>

          {[
            "Dashboard",
            "Attendance",
            "Assignments",
            "My Day",
            "Lost & Found",
            "Settings",
          ].map((item) => (
            <button
              key={item}
              className={
                page === item
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() => setPage(item)}
            >
              {item}
            </button>
          ))}
        </aside>

        <main className="content">
          {page === "Dashboard" && (
            <>
              <div className="page-heading">
                <div className="eyebrow">{today}</div>
                <h1>
                  {getGreeting()}
                  {studentName ? `, ${studentName}` : ""}
                </h1>
                <div className="subtitle">
                  Your academic day, organized in one place.
                </div>
              </div>

              <section className="welcome">
                <h2>Welcome to CampusOS</h2>
                <p>
                  Stay on top of attendance, assignments and
                  your daily campus routine.
                </p>
              </section>

              <section className="stats">
                <div className="card">
                  <div className="stat-label">Attendance</div>
                  <div className="stat-value">84.6%</div>
                  <div className="muted">Overall attendance</div>
                </div>

                <div className="card">
                  <div className="stat-label">Pending work</div>
                  <div className="stat-value">
                    {pendingAssignments}
                  </div>
                  <div className="muted">
                    Assignments requiring attention
                  </div>
                </div>

                <div className="card">
                  <div className="stat-label">Day streak</div>
                  <div className="stat-value">6 days</div>
                  <div className="muted">
                    Keep your momentum going
                  </div>
                </div>

                <div className="card">
                  <div className="stat-label">My Day progress</div>
                  <div className="stat-value">
                    {taskProgress}%
                  </div>
                  <div className="muted">
                    {completedTasks}/{tasks.length} tasks complete
                  </div>
                </div>
              </section>

              <div className="grid-2">
                <section className="card">
                  <div className="section-header">
                    <h2>Today's schedule</h2>
                    <span className="muted">4 classes</span>
                  </div>

                  {schedule.map((item) => (
                    <div className="schedule-item" key={item.time}>
                      <div className="time">{item.time}</div>

                      <div className="subject">
                        <strong>{item.subject}</strong>
                        <span className="muted">
                          {item.room}
                        </span>
                      </div>
                    </div>
                  ))}
                </section>

                <section className="card">
                  <div className="section-header">
                    <h2>My Day</h2>
                  </div>

                  <div className="streak">{taskProgress}%</div>

                  <div className="muted">
                    Daily task completion
                  </div>

                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${taskProgress}%` }}
                    />
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <button
                      className="button"
                      onClick={() => setPage("My Day")}
                    >
                      Open My Day
                    </button>
                  </div>
                </section>
              </div>
            </>
          )}

          {page === "Attendance" && (
            <>
              <div className="page-heading">
                <div className="eyebrow">Academic tracking</div>
                <h1>Attendance</h1>
                <div className="subtitle">
                  Monitor attendance subject by subject.
                </div>
              </div>

              <section className="card">
                <div className="section-header">
                  <h2>Attendance overview</h2>
                  <strong>84.6%</strong>
                </div>

                {attendanceData.map((item) => {
                  const percentage = Math.round(
                    (item.attended / item.total) * 100,
                  );

                  return (
                    <div
                      key={item.subject}
                      style={{ marginBottom: 22 }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 10,
                        }}
                      >
                        <strong>{item.subject}</strong>

                        <span className="muted">
                          {item.attended}/{item.total} ·{" "}
                          {percentage}%
                        </span>
                      </div>

                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </section>
            </>
          )}

          {page === "Assignments" && (
            <>
              <div className="page-heading">
                <div className="eyebrow">Academic workload</div>
                <h1>Assignments</h1>
                <div className="subtitle">
                  Search and track your current assignments.
                </div>
              </div>

              <section className="card">
                <div className="search-row">
                  <input
                    className="input"
                    placeholder="Search assignments or subjects..."
                    value={assignmentSearch}
                    onChange={(event) =>
                      setAssignmentSearch(event.target.value)
                    }
                  />
                </div>

                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Assignment</th>
                        <th>Subject</th>
                        <th>Due</th>
                        <th>Status</th>
                        <th>Progress</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredAssignments.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <strong>{item.title}</strong>
                          </td>

                          <td>{item.subject}</td>

                          <td>{item.due}</td>

                          <td>
                            <span
                              className={`badge ${
                                item.status === "Urgent"
                                  ? "urgent"
                                  : item.status === "On Track"
                                    ? "track"
                                    : "pending"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>

                          <td style={{ minWidth: 130 }}>
                            <div>{item.progress}%</div>

                            <div className="progress">
                              <div
                                className="progress-bar"
                                style={{
                                  width: `${item.progress}%`,
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredAssignments.length === 0 && (
                  <div className="empty">
                    No assignments found.
                  </div>
                )}
              </section>
            </>
          )}

          {page === "My Day" && (
            <>
              <div className="page-heading">
                <div className="eyebrow">Personal productivity</div>
                <h1>My Day</h1>
                <div className="subtitle">
                  Plan your day and keep track of what is done.
                </div>
              </div>

              <section className="card">
                <div className="section-header">
                  <div>
                    <h2>Today's tasks</h2>
                    <div className="muted">
                      {completedTasks} of {tasks.length} completed
                    </div>
                  </div>

                  {completedTasks > 0 && (
                    <button
                      className="button secondary"
                      onClick={clearCompletedTasks}
                    >
                      Clear completed
                    </button>
                  )}
                </div>

                <div className="progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${taskProgress}%` }}
                  />
                </div>

                <div className="task-input" style={{ marginTop: 20 }}>
                  <input
                    className="input"
                    placeholder="Add a task for today..."
                    value={task}
                    onChange={(event) =>
                      setTask(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        addTask();
                      }
                    }}
                  />

                  <button
                    className="button"
                    onClick={addTask}
                  >
                    Add task
                  </button>
                </div>

                {tasks.length === 0 ? (
                  <div className="empty">
                    <strong>No tasks yet.</strong>
                    <div style={{ marginTop: 6 }}>
                      Add your first task and start planning your
                      day.
                    </div>
                  </div>
                ) : (
                  tasks.map((item) => (
                    <div className="task-item" key={item.id}>
                      <input
                        className="checkbox"
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleTask(item.id)}
                      />

                      <div
                        className={
                          item.completed
                            ? "task-title completed"
                            : "task-title"
                        }
                      >
                        {item.title}
                      </div>

                      <div className="task-actions">
                        <button
                          className="icon-button"
                          title="Delete task"
                          onClick={() => deleteTask(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </section>
            </>
          )}

          {page === "Lost & Found" && (
            <>
              <div className="page-heading">
                <div className="eyebrow">Campus community</div>
                <h1>Lost & Found</h1>
                <div className="subtitle">
                  Search campus items or report something you
                  lost or found.
                </div>
              </div>

              <section className="card">
                <div className="section-header">
                  <h2>Campus items</h2>

                  <button
                    className="button"
                    onClick={() => setShowAddLostItem(true)}
                  >
                    Report Item
                  </button>
                </div>

                <div className="search-row">
                  <input
                    className="input"
                    placeholder="Search item, location or type..."
                    value={lostSearch}
                    onChange={(event) =>
                      setLostSearch(event.target.value)
                    }
                  />
                </div>

                {filteredLostItems.length === 0 ? (
                  <div className="empty">
                    No matching items found.
                  </div>
                ) : (
                  filteredLostItems.map((item) => (
                    <div className="lost-card" key={item.id}>
                      <div className="lost-info">
                        <strong>{item.name}</strong>

                        <div className="lost-meta">
                          <span className="muted">
                            {item.location}
                          </span>

                          <span className="muted">·</span>

                          <span className="muted">
                            {item.date}
                          </span>
                        </div>
                      </div>

                      <span
                        className={
                          item.type === "Found"
                            ? "badge track"
                            : "badge urgent"
                        }
                      >
                        {item.type}
                      </span>
                    </div>
                  ))
                )}
              </section>
            </>
          )}

          {page === "Settings" && (
            <>
              <div className="page-heading">
                <div className="eyebrow">Personalize CampusOS</div>
                <h1>Settings</h1>
                <div className="subtitle">
                  Update your student profile and preferences.
                </div>
              </div>

              <section className="card">
                <div className="profile-preview">
                  <div className="large-avatar">
                    {(studentName || "S").charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {studentName || "Student"}
                    </strong>

                    <div className="muted">
                      {department} · {year}
                    </div>
                  </div>
                </div>

                <div className="settings-grid">
                  <div className="field full">
                    <label>Student name</label>

                    <input
                      className="input"
                      placeholder="Enter your name"
                      value={studentName}
                      onChange={(event) =>
                        setStudentName(event.target.value)
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Department</label>

                    <select
                      className="input"
                      value={department}
                      onChange={(event) =>
                        setDepartment(event.target.value)
                      }
                    >
                      <option>CSE</option>
                      <option>AI & ML</option>
                      <option>AI & DS</option>
                      <option>ECE</option>
                      <option>EEE</option>
                      <option>MECH</option>
                      <option>CIVIL</option>
                      <option>IT</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>Year</label>

                    <select
                      className="input"
                      value={year}
                      onChange={(event) =>
                        setYear(event.target.value)
                      }
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                    </select>
                  </div>

                  <div className="field full">
                    <label>Appearance</label>

                    <button
                      className="button secondary"
                      onClick={() => setDarkMode((value) => !value)}
                    >
                      {darkMode
                        ? "Switch to Light Mode"
                        : "Switch to Dark Mode"}
                    </button>
                  </div>

                  <div className="full">
                    <button
                      className="button"
                      onClick={saveSettings}
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      {showAddLostItem && (
        <div
          className="modal-backdrop"
          onClick={() => setShowAddLostItem(false)}
        >
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>Report Lost & Found Item</h2>

            <div className="field">
              <label>Item name</label>

              <input
                className="input"
                placeholder="Example: Black backpack"
                value={newLostItem.name}
                onChange={(event) =>
                  setNewLostItem((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </div>

            <div className="field" style={{ marginTop: 15 }}>
              <label>Location</label>

              <input
                className="input"
                placeholder="Example: Library"
                value={newLostItem.location}
                onChange={(event) =>
                  setNewLostItem((current) => ({
                    ...current,
                    location: event.target.value,
                  }))
                }
              />
            </div>

            <div className="field" style={{ marginTop: 15 }}>
              <label>Type</label>

              <select
                className="input"
                value={newLostItem.type}
                onChange={(event) =>
                  setNewLostItem((current) => ({
                    ...current,
                    type: event.target.value as "Lost" | "Found",
                  }))
                }
              >
                <option value="Lost">I lost this item</option>
                <option value="Found">I found this item</option>
              </select>
            </div>

            <div className="modal-actions">
              <button
                className="button secondary"
                onClick={() => setShowAddLostItem(false)}
              >
                Cancel
              </button>

              <button
                className="button"
                onClick={reportLostItem}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}