import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Command,
  Compass,
  FileText,
  Filter,
  Flame,
  Github,
  GraduationCap,
  Heart,
  Home as HomeIcon,
  LayoutGrid,
  LifeBuoy,
  Loader2,
  MapPin,
  Menu,
  MoreHorizontal,
  PackageSearch,
  Plus,
  Search,
  Send,
  Settings2,
  Sparkles,
  Target,
  Timer,
  Trophy,
  Trash2,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

type Screen = "dashboard" | "attendance" | "assignments" | "my-day" | "lost-found" | "settings";
type Toast = { tone: "success" | "error" | "info"; message: string } | null;
type ThemeName = "default" | "marvel" | "cars" | "space";

type DayItem = {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  type: "class" | "task" | "break" | "activity";
  accent: string;
  done?: boolean;
};

type Assignment = {
  id: string;
  subject: string;
  title: string;
  due: string;
  dueLabel: string;
  progress: number;
  status: "in-progress" | "urgent" | "completed";
};

type LostItem = { id: string; emoji: string; title: string; location: string; time: string; tag: string; color: string; status: "waiting" | "returned"; owner: string };

const navItems: { id: Screen; label: string; icon: LucideIcon; short: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: HomeIcon, short: "Home" },
  { id: "attendance", label: "Attendance", icon: Target, short: "Attend" },
  { id: "assignments", label: "Assignments", icon: FileText, short: "Tasks" },
  { id: "my-day", label: "My Day", icon: CalendarDays, short: "My Day" },
  { id: "lost-found", label: "Lost & Found", icon: PackageSearch, short: "Found" },
  { id: "settings", label: "Settings", icon: Settings2, short: "Settings" },
];

const academicSubjects: Record<string, Record<string, string[]>> = {
  "CSE – Computer Science and Engineering": {
    "1st Year": ["Engineering Mathematics I", "Programming in C", "Engineering Physics", "Engineering Drawing"],
    "2nd Year": ["Database Management Systems", "Java Programming", "Computer Networks", "Operating Systems"],
    "3rd Year": ["Compiler Design", "Web Technologies", "Software Engineering", "Cloud Computing"],
    "4th Year": ["Machine Learning", "Distributed Systems", "Cyber Security", "Project Work"],
  },
  "ECE – Electronics and Communication Engineering": {
    "1st Year": ["Engineering Mathematics I", "Engineering Physics", "Basic Electrical Engineering", "Programming in C"],
    "2nd Year": ["Signals and Systems", "Electronic Devices", "Digital Logic Design", "Network Theory"],
    "3rd Year": ["Microprocessors", "Communication Systems", "VLSI Design", "Control Systems"],
    "4th Year": ["Wireless Communication", "Embedded Systems", "Optical Communication", "Project Work"],
  },
  "EEE – Electrical and Electronics Engineering": {
    "1st Year": ["Engineering Mathematics I", "Engineering Physics", "Basic Electrical Engineering", "Engineering Drawing"],
    "2nd Year": ["Electrical Machines I", "Power Systems I", "Power Electronics", "Network Theory"],
    "3rd Year": ["Electrical Machines II", "Control Systems", "Digital Signal Processing", "Switchgear and Protection"],
    "4th Year": ["Smart Grid Technology", "Electric Vehicle Systems", "Renewable Energy", "Project Work"],
  },
  "MECH – Mechanical Engineering": {
    "1st Year": ["Engineering Mathematics I", "Engineering Physics", "Engineering Drawing", "Workshop Practice"],
    "2nd Year": ["Thermodynamics", "Fluid Mechanics", "Manufacturing Processes", "Engineering Mechanics"],
    "3rd Year": ["Heat Transfer", "Machine Design", "Dynamics of Machinery", "Industrial Engineering"],
    "4th Year": ["CAD/CAM", "Robotics", "Automobile Engineering", "Project Work"],
  },
  "CIVIL – Civil Engineering": {
    "1st Year": ["Engineering Mathematics I", "Engineering Physics", "Engineering Drawing", "Basic Civil Engineering"],
    "2nd Year": ["Structural Analysis", "Fluid Mechanics", "Surveying", "Building Materials"],
    "3rd Year": ["Geotechnical Engineering", "Environmental Engineering", "Concrete Technology", "Transportation Engineering"],
    "4th Year": ["Advanced Structural Design", "Construction Management", "Water Resources", "Project Work"],
  },
  "AI & DS – Artificial Intelligence and Data Science": {
    "1st Year": ["Engineering Mathematics I", "Programming in Python", "Engineering Physics", "Data Literacy"],
    "2nd Year": ["Data Structures", "Database Management Systems", "Statistics for Data Science", "Object Oriented Programming"],
    "3rd Year": ["Machine Learning", "Big Data Analytics", "Deep Learning", "Data Visualization"],
    "4th Year": ["Natural Language Processing", "Recommender Systems", "MLOps", "Project Work"],
  },
  "AI & ML – Artificial Intelligence and Machine Learning": {
    "1st Year": ["Engineering Mathematics I", "Programming in Python", "Engineering Physics", "Digital Logic"],
    "2nd Year": ["Data Structures", "Database Management Systems", "Probability and Statistics", "Operating Systems"],
    "3rd Year": ["Machine Learning", "Deep Learning", "Computer Vision", "Natural Language Processing"],
    "4th Year": ["Reinforcement Learning", "Generative AI", "Responsible AI", "Project Work"],
  },
  "IT – Information Technology": {
    "1st Year": ["Engineering Mathematics I", "Programming in C", "Engineering Physics", "Digital Fundamentals"],
    "2nd Year": ["Data Structures", "Database Management Systems", "Web Programming", "Computer Organization"],
    "3rd Year": ["Software Engineering", "Computer Networks", "Operating Systems", "Information Security"],
    "4th Year": ["Cloud Computing", "Mobile Application Development", "DevOps", "Project Work"],
  },
};

const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const departmentOptions = Object.keys(academicSubjects);

const attendanceData = [
  { subject: "DBMS", code: "CS 301", attended: 33, total: 40, color: "violet", teacher: "Dr. R. Mehta" },
  { subject: "Java Programming", code: "CS 302", attended: 41, total: 45, color: "teal", teacher: "Prof. S. Iyer" },
  { subject: "Computer Networks", code: "CS 303", attended: 29, total: 38, color: "orange", teacher: "Dr. P. Nair" },
  { subject: "Machine Learning", code: "AI 205", attended: 36, total: 42, color: "pink", teacher: "Prof. A. Shah" },
];

const getAttendanceData = (department: string, year: string) => {
  const subjects = academicSubjects[department]?.[year] ?? [];
  const seed = yearOptions.indexOf(year) + 1;
  return subjects.map((subject, index) => ({ subject, code: `${department.slice(0, 2).toUpperCase()} ${seed}${index + 1}`, attended: 28 + ((index * 5 + seed) % 12), total: 34 + ((index * 3 + seed) % 10), color: ["violet", "teal", "orange", "pink"][index % 4], teacher: ["Dr. R. Mehta", "Prof. S. Iyer", "Dr. P. Nair", "Prof. A. Shah"][index % 4] }));
};

const makeSchedule = (department: string, year: string): DayItem[] => {
  const subjects = academicSubjects[department]?.[year] ?? [];
  const colors = ["violet", "teal", "orange", "pink"];
  return [
    { id: `${department}-${year}-breakfast`, time: "07:30", title: "Breakfast", subtitle: "Hostel mess · Start easy", type: "break", accent: "yellow" },
    ...subjects.slice(0, 2).map((subject, index) => ({ id: `${department}-${year}-${index}`, time: index === 0 ? "09:00" : "11:00", title: subject, subtitle: `${index === 0 ? "Room A-204" : "Lab 3"} · Faculty schedule`, type: "class" as const, accent: colors[index] })),
    { id: `${department}-${year}-lunch`, time: "13:00", title: "Lunch with friends", subtitle: "Central café · 45 min", type: "break", accent: "pink" },
    { id: `${department}-${year}-deep-work`, time: "14:00", title: subjects[2] ?? "Project deep work", subtitle: "Library 2F · Focus block", type: "task", accent: "orange" },
    { id: `${department}-${year}-gym`, time: "17:00", title: "Gym session", subtitle: "Sports complex · 60 min", type: "activity", accent: "blue" },
  ];
};

const makeAssignments = (department: string, year: string): Assignment[] => {
  const subjects = academicSubjects[department]?.[year] ?? [];
  return subjects.map((subject, index) => ({ id: `${department}-${year}-assignment-${index}`, subject, title: `${subject} weekly deliverable`, due: `Sep ${12 + index * 2}`, dueLabel: index === 0 ? "Due tomorrow" : `Due Sep ${12 + index * 2}`, progress: 0, status: index === 0 ? "urgent" : "in-progress" }));
};

const minutesOf = (time: string) => { const [hours, minutes] = time.split(":").map(Number); return hours * 60 + minutes; };
const getScheduleState = (items: DayItem[], date: Date) => {
  const currentMinutes = date.getHours() * 60 + date.getMinutes();
  const schedule = items.filter((item) => item.type === "class" || item.type === "task").sort((a, b) => minutesOf(a.time) - minutesOf(b.time));
  const activeIndex = schedule.findIndex((item, index) => currentMinutes >= minutesOf(item.time) && currentMinutes < (schedule[index + 1] ? minutesOf(schedule[index + 1].time) : minutesOf(item.time) + 90));
  if (activeIndex >= 0) return { item: schedule[activeIndex], label: "In progress", index: activeIndex };
  const nextIndex = schedule.findIndex((item) => minutesOf(item.time) > currentMinutes);
  if (nextIndex >= 0) return { item: schedule[nextIndex], label: "Up next", index: nextIndex };
  return { item: null, label: "No more classes today", index: -1 };
};

const initialAssignments: Assignment[] = [
  { id: "a1", subject: "Java Programming", title: "Build a REST API with Spring Boot", due: "Sep 12", dueLabel: "Due tomorrow", progress: 80, status: "urgent" },
  { id: "a2", subject: "DBMS", title: "Normalize the library database", due: "Sep 14", dueLabel: "Due Friday", progress: 40, status: "in-progress" },
  { id: "a3", subject: "Machine Learning", title: "Research paper: bias in datasets", due: "Sep 18", dueLabel: "Due next Thursday", progress: 100, status: "completed" },
  { id: "a4", subject: "Computer Networks", title: "Packet tracer lab report", due: "Sep 20", dueLabel: "Due Sep 20", progress: 20, status: "in-progress" },
  { id: "a5", subject: "Software Engineering", title: "Sprint retrospective notes", due: "Sep 22", dueLabel: "Due Sep 22", progress: 0, status: "in-progress" },
];

const initialDayItems: DayItem[] = [
  { id: "d1", time: "07:30", title: "Breakfast", subtitle: "Hostel mess · Start easy", type: "break", accent: "yellow" },
  { id: "d2", time: "09:00", title: "Database Management Systems", subtitle: "Room A-204 · Dr. R. Mehta", type: "class", accent: "violet" },
  { id: "d3", time: "11:00", title: "Java Programming", subtitle: "Lab 3 · Prof. S. Iyer", type: "class", accent: "teal" },
  { id: "d4", time: "13:00", title: "Lunch with Aisha", subtitle: "Central café · 45 min", type: "break", accent: "pink" },
  { id: "d5", time: "14:00", title: "Project deep work", subtitle: "Library 2F · Focus block", type: "task", accent: "orange" },
  { id: "d6", time: "17:00", title: "Gym session", subtitle: "Sports complex · 60 min", type: "activity", accent: "blue" },
];

const lostItems: LostItem[] = [
  { id: "l1", emoji: "👛", title: "Black leather wallet", location: "Found near CSE block", time: "12 min ago", tag: "High priority", color: "orange", status: "waiting", owner: "Maya Reddy" },
  { id: "l2", emoji: "🎧", title: "White wireless earbuds", location: "Library reading zone", time: "1 hr ago", tag: "Electronics", color: "violet", status: "waiting", owner: "Karthik Rao" },
  { id: "l3", emoji: "📒", title: "Blue spiral notebook", location: "Room B-104", time: "Yesterday", tag: "Study item", color: "teal", status: "returned", owner: "Aisha Khan" },
  { id: "l4", emoji: "🔑", title: "Single silver key", location: "Parking lot gate", time: "Yesterday", tag: "Small item", color: "pink", status: "waiting", owner: "Vikram Singh" },
];
const fallbackOwners = ["Maya Reddy", "Karthik Rao", "Aisha Khan", "Vikram Singh"];

const upcomingEvents = [
  { id: "e1", title: "Campus Hackathon 2026", date: "September 11, 2026", time: "09:00 AM – 06:00 PM", venue: "Innovation Hub", description: "Build, learn, and ship with your campus community. Teams of up to four are welcome.", icon: "🚀", color: "violet" },
  { id: "e2", title: "Design Thinking Workshop", date: "September 15, 2026", time: "02:00 PM – 04:00 PM", venue: "Seminar Hall B", description: "A practical workshop on turning messy problems into thoughtful, testable ideas.", icon: "✦", color: "orange" },
  { id: "e3", title: "Tech Talk: Careers in AI", date: "September 20, 2026", time: "11:00 AM – 12:30 PM", venue: "Main Auditorium", description: "Hear from alumni building the next generation of responsible AI products.", icon: "◉", color: "teal" },
];

const iconForType = (type: DayItem["type"]) => {
  if (type === "class") return BookOpen;
  if (type === "task") return Sparkles;
  if (type === "activity") return Flame;
  return Heart;
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" }).format(date);
}

function initialsFor(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "AK";
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>(() => (readStorage("campus-screen", "dashboard") as Screen) || "dashboard");
  const [assignments, setAssignments] = useState<Assignment[]>(() => readStorage("campus-assignments", initialAssignments));
  const [dayItems, setDayItems] = useState<DayItem[]>(() => readStorage("campus-day-items", initialDayItems));
  const [search, setSearch] = useState("");
  const [lostSearch, setLostSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [taskError, setTaskError] = useState("");
  const [toast, setToast] = useState<Toast>(null);
  const [contactItem, setContactItem] = useState<(typeof lostItems)[number] | null>(null);
  const [lostData, setLostData] = useState<LostItem[]>(() => readStorage<LostItem[]>("campus-lost-items", lostItems).map((item, index) => ({ ...item, owner: item.owner || fallbackOwners[index % fallbackOwners.length] })));
  const [selectedEvent, setSelectedEvent] = useState<(typeof upcomingEvents)[number] | null>(null);
  const [department, setDepartment] = useState(() => readStorage("campus-department", departmentOptions[0]));
  const [year, setYear] = useState(() => readStorage("campus-year", "2nd Year"));
  const [location, setLocation] = useState(() => readStorage("campus-location", "PVPSIT Campus"));
  const [locationDraft, setLocationDraft] = useState(() => readStorage("campus-location", "PVPSIT Campus"));
  const [studentName, setStudentName] = useState(() => readStorage("campus-student-name", "Arjun Kumar"));
  const [studentNameDraft, setStudentNameDraft] = useState(() => readStorage("campus-student-name", "Arjun Kumar"));
  const [theme, setTheme] = useState<ThemeName>(() => { const saved = readStorage("campus-theme", "default") as string; return saved === "light" || saved === "dark" ? "default" : (saved as ThemeName); });
  const [notificationsRead, setNotificationsRead] = useState(() => readStorage("campus-notifications-read", false));
  const [refreshing, setRefreshing] = useState(false);
  const [online, setOnline] = useState(() => typeof navigator === "undefined" ? true : navigator.onLine);
  const [now, setNow] = useState(() => new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [supportSubject, setSupportSubject] = useState("General help");
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [assignmentDraft, setAssignmentDraft] = useState({ title: "", subject: "", due: "", priority: "Normal" });
  const [showLostForm, setShowLostForm] = useState(false);
  const [lostDraft, setLostDraft] = useState({ title: "", location: "", category: "Study item" });

  useEffect(() => {
    window.localStorage.setItem("campus-screen", screen);
  }, [screen]);

  useEffect(() => {
    window.localStorage.setItem("campus-assignments", JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    window.localStorage.setItem("campus-day-items", JSON.stringify(dayItems));
  }, [dayItems]);

  useEffect(() => {
    window.localStorage.setItem("campus-department", JSON.stringify(department));
  }, [department]);

  useEffect(() => {
    window.localStorage.setItem("campus-year", JSON.stringify(year));
  }, [year]);

  useEffect(() => { window.localStorage.setItem("campus-lost-items", JSON.stringify(lostData)); }, [lostData]);
 const profileInitialized = useRef(false);

useEffect(() => {
  if (!profileInitialized.current) {
    profileInitialized.current = true;
    return;
  }

  setAssignments(makeAssignments(department, year));
  setDayItems(makeSchedule(department, year));
}, [department, year]);
  useEffect(() => { const interval = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(interval); }, []);

  useEffect(() => {
    window.localStorage.setItem("campus-location", JSON.stringify(location));
  }, [location]);

  useEffect(() => {
    window.localStorage.setItem("campus-student-name", JSON.stringify(studentName));
  }, [studentName]);

  useEffect(() => {
    window.localStorage.setItem("campus-theme", JSON.stringify(theme));
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => { window.localStorage.setItem("campus-notifications-read", JSON.stringify(notificationsRead)); }, [notificationsRead]);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const navigate = (next: Screen) => {
    setScreen(next);
    setSearch("");
    setLostSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateAssignment = (id: string) => {
    setAssignments((current) => current.map((item) => item.id === id ? { ...item, progress: item.progress === 100 ? 0 : 100, status: item.progress === 100 ? "in-progress" : "completed" } : item));
    setToast({ tone: "success", message: "Assignment progress updated and saved." });
  };

  const deleteAssignment = (id: string) => {
    setAssignments((current) => current.filter((item) => item.id !== id));
    setToast({ tone: "success", message: "Assignment removed." });
  };

  const addAssignment = () => {
    if (!assignmentDraft.title.trim() || !assignmentDraft.subject.trim() || !assignmentDraft.due) {
      setToast({ tone: "error", message: "Add a title, subject, and due date." });
      return;
    }
    setAssignments((current) => [{ id: `assignment-${Date.now()}`, subject: assignmentDraft.subject.trim(), title: assignmentDraft.title.trim(), due: assignmentDraft.due, dueLabel: `Due ${assignmentDraft.due}`, progress: 0, status: assignmentDraft.priority === "High" ? "urgent" : "in-progress" }, ...current]);
    setAssignmentDraft({ title: "", subject: "", due: "", priority: "Normal" });
    setShowAssignmentForm(false);
    setToast({ tone: "success", message: "Assignment added to your workspace." });
  };

  const addTask = () => {
    const trimmed = newTask.trim();
    if (!trimmed) {
      setTaskError("Give your task a short name first.");
      return;
    }
    if (trimmed.length > 60) {
      setTaskError("Keep your task under 60 characters.");
      return;
    }
    setDayItems((current) => [...current, { id: `custom-${Date.now()}`, time: "19:00", title: trimmed, subtitle: "Personal task · Added just now", type: "task", accent: "blue" }]);
    setNewTask("");
    setTaskError("");
    setShowAdd(false);
    setToast({ tone: "success", message: "Added to your day. It will stay here after refresh." });
  };

  const refreshData = () => {
    if (refreshing) return;
    if (!online) {
      setToast({ tone: "error", message: "You’re offline. Reconnect to refresh CampusOS data." });
      return;
    }
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      setToast({ tone: "success", message: "CampusOS is up to date." });
    }, 700);
  };

  const filteredAssignments = useMemo(() => assignments.filter((item) => {
    const matchesSearch = `${item.subject} ${item.title}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "completed" ? item.status === "completed" : item.status !== "completed");
    return matchesSearch && matchesFilter;
  }), [assignments, filter, search]);

  const filteredLost = useMemo(() => lostData.filter((item) => `${item.title} ${item.location} ${item.tag}`.toLowerCase().includes(lostSearch.toLowerCase())), [lostData, lostSearch]);
  const completedCount = assignments.filter((item) => item.status === "completed").length;
  const currentNav = navItems.find((item) => item.id === screen);

  return (
    <div className={`campus-shell theme-${theme} ${theme === "space" ? "dark-theme" : ""}`}>
      <aside className="side-rail">
        <div className="brand-lockup">
          <div className="brand-mark"><GraduationCap size={22} strokeWidth={2.6} /></div>
          <div><strong>campus<span>os</span></strong><small>student command center</small></div>
        </div>
        <div className="rail-section-label">Workspace</div>
        <nav className="rail-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} className={`rail-link ${screen === item.id ? "active" : ""}`} onClick={() => navigate(item.id)}><Icon size={18} /><span>{item.label}</span>{item.id === "assignments" && <b className="nav-count">{assignments.filter((a) => a.status !== "completed").length}</b>}</button>;
          })}
        </nav>
        <div className="rail-spacer" />
        <div className="rail-tip"><Sparkles size={16} /><div><b>Small steps, big days.</b><span>Keep your momentum going.</span></div></div>
        <button className="rail-link muted-link" onClick={() => setShowSupport(true)}><LifeBuoy size={18} /><span>Help & support</span></button>
        <button className="profile-chip profile-chip-button" onClick={() => setShowProfile(true)}><div className="avatar">{initialsFor(studentName)}</div><div><b>{studentName}</b><span>{department.split(" – ")[0]} · {year}</span></div><MoreHorizontal size={18} className="profile-more" /></button>
      </aside>

      <main className="main-canvas">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setShowMenu((value) => !value)} aria-label="Toggle navigation"><Menu size={21} /></button>
          <div className="breadcrumb"><span>CampusOS</span><ChevronRight size={14} /><strong>{currentNav?.label}</strong></div>
          <div className="top-actions">
            <span className="current-time" aria-label="Current time">{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            <a className="icon-button github-link" href="https://github.com" target="_blank" rel="noreferrer" aria-label="Open GitHub"><Github size={19} /></a>
            <button className="icon-button notification" aria-label="Notifications" onClick={() => { setShowNotifications(true); setNotificationsRead(true); }}><Bell size={19} />{!notificationsRead && <i />}</button>
            <button className="mini-avatar" aria-label="Open profile" onClick={() => setShowProfile(true)}>{initialsFor(studentName)}</button>
          </div>
        </header>

        {showMenu && <div className="mobile-menu-panel">{navItems.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => { navigate(item.id); setShowMenu(false); }} className={screen === item.id ? "active" : ""}><Icon size={18} />{item.label}</button>; })}</div>}

        <div className="content-wrap">
          {screen === "dashboard" && <Dashboard navigate={navigate} assignments={assignments} refreshData={refreshData} refreshing={refreshing} studentName={studentName} now={now} dayItems={dayItems} />}
          {screen === "attendance" && <Attendance department={department} year={year} />}
          {screen === "assignments" && <Assignments assignments={filteredAssignments} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} updateAssignment={updateAssignment} deleteAssignment={deleteAssignment} completedCount={completedCount} onAdd={() => setShowAssignmentForm(true)} />}
          {screen === "my-day" && <MyDay dayItems={dayItems} setDayItems={setDayItems} now={now} showAdd={showAdd} setShowAdd={setShowAdd} newTask={newTask} setNewTask={setNewTask} taskError={taskError} setTaskError={setTaskError} addTask={addTask} />}
          {screen === "lost-found" && <LostFound items={filteredLost} search={lostSearch} setSearch={setLostSearch} onContact={setContactItem} onAdd={(item) => setLostData((current) => [item, ...current])} />}
          {screen === "settings" && <SettingsPage department={department} setDepartment={setDepartment} year={year} setYear={setYear} location={location} locationDraft={locationDraft} setLocationDraft={setLocationDraft} setLocation={setLocation} studentName={studentName} studentNameDraft={studentNameDraft} setStudentNameDraft={setStudentNameDraft} setStudentName={setStudentName} theme={theme} setTheme={setTheme} />}
        </div>

        <nav className="bottom-nav" aria-label="Mobile navigation">{navItems.map((item) => { const Icon = item.icon; return <button key={item.id} className={screen === item.id ? "active" : ""} onClick={() => navigate(item.id)}><Icon size={19} /><span>{item.short}</span></button>; })}</nav>
      </main>

      {toast && <div className={`toast toast-${toast.tone}`} role="status"><div className="toast-icon">{toast.tone === "error" ? <AlertCircle size={17} /> : toast.tone === "success" ? <Check size={17} /> : <Sparkles size={17} />}</div><span>{toast.message}</span><button onClick={() => setToast(null)} aria-label="Dismiss"><X size={15} /></button></div>}
      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} read={notificationsRead} />}
      {showProfile && <ProfileModal name={studentName} department={department} year={year} onClose={() => setShowProfile(false)} />}
      {showSupport && <SupportModal subject={supportSubject} setSubject={setSupportSubject} message={supportMessage} setMessage={setSupportMessage} onClose={() => setShowSupport(false)} onSent={() => { setShowSupport(false); setSupportMessage(""); setToast({ tone: "success", message: "Your message is saved in this CampusOS session." }); }} />}
      {showAssignmentForm && <AssignmentModal subjects={academicSubjects[department]?.[year] ?? []} draft={assignmentDraft} setDraft={setAssignmentDraft} onClose={() => setShowAssignmentForm(false)} onSave={addAssignment} />}
      {contactItem && <div className="modal-backdrop" onClick={() => setContactItem(null)}><div className="contact-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setContactItem(null)} aria-label="Close"><X size={18} /></button><div className={`modal-emoji ${contactItem.color}`}>{contactItem.emoji}</div><span className="eyebrow">ITEM RECOVERY</span><h2>{contactItem.title}</h2><p>{contactItem.location} · {contactItem.time}</p><div className="contact-person"><div className="avatar small">{initialsFor(contactItem.owner)}</div><div><b>{contactItem.owner}</b><span>Contact person for this item</span></div></div><button className="primary-button full" onClick={() => { setLostData((current) => current.map((item) => item.id === contactItem.id ? { ...item, status: "returned" } : item)); setContactItem(null); setToast({ tone: "success", message: "Item marked as returned to its owner." }); }}><Send size={16} /> Mark item returned</button><small className="modal-note">CampusOS never reveals your personal number.</small></div></div>}
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function Dashboard({ navigate, assignments, refreshData, refreshing, studentName, now, dayItems }: { navigate: (screen: Screen) => void; assignments: Assignment[]; refreshData: () => void; refreshing: boolean; studentName: string; now: Date; dayItems: DayItem[] }) {
  const scheduleState = getScheduleState(dayItems, now);
  const next = scheduleState.item;
  const rhythmItems = dayItems.filter((item) => item.type === "class" || item.type === "task").slice(0, 3);
  return <>
    <PageHeading eyebrow={`${formatDate(now)} · ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`} title={`${now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening"}, ${studentName.split(" ")[0]}`} description="A calm start to a full day. Here’s what deserves your attention." action={<button className="outline-button" onClick={refreshData} disabled={refreshing}>{refreshing ? <Loader2 size={16} className="spin" /> : <Command size={16} />}{refreshing ? "Syncing" : "Refresh data"}</button>} />
    <div className="hero-grid">
      <section className="welcome-card"><div className="welcome-glow" /><div className="welcome-copy"><span className="eyebrow light">YOUR DAY AT A GLANCE</span><h2>Make room for<br /><em>what matters.</em></h2><p>Three classes, one deep-work block, and enough space to breathe.</p><button className="light-button" onClick={() => navigate("my-day")}>Open My Day <ArrowUpRight size={16} /></button></div><div className="orbital orbital-one" /><div className="orbital orbital-two" /><div className="day-score"><span>DAY SCORE</span><strong>82</strong><small>/ 100</small><div className="score-bar"><i /></div><b>On track</b></div></section>
      <section className="next-card"><div className="section-top"><div><span className="eyebrow">NEXT UP</span><h3>{next?.title ?? "No more classes today"}</h3></div><div className="next-icon violet"><BookOpen size={19} /></div></div><div className="next-time"><strong>{next?.time ?? "—"}</strong><span>{scheduleState.label}</span></div><div className="next-meta"><span><MapPin size={14} /> {next?.subtitle.split(" · ")[0] ?? "See you tomorrow"}</span><span><Clock3 size={14} /> 90 min</span></div><span className="next-status"><span className="status-dot" /> {scheduleState.label}</span></section>
    </div>
    <div className="stat-row"><StatCard icon={<Target size={18} />} label="Attendance" value="84.6%" sub="2 classes safe to miss" tone="violet" onClick={() => navigate("attendance")} /><StatCard icon={<FileText size={18} />} label="Assignments" value={`${assignments.filter((item) => item.status !== "completed").length} open`} sub={`${assignments.filter((item) => item.status === "urgent").length} due tomorrow`} tone="orange" onClick={() => navigate("assignments")} /><StatCard icon={<Trophy size={18} />} label="Streak" value="6 days" sub="Keep showing up" tone="teal" onClick={() => navigate("my-day")} /></div>
    <div className="dashboard-columns">
      <section className="panel schedule-panel"><PanelTitle icon={<CalendarDays size={17} />} title="Today’s rhythm" action={<button className="text-button" onClick={() => navigate("my-day")}>See My Day <ChevronRight size={14} /></button>} /><div className="mini-schedule">{rhythmItems.map((item, index) => <Fragment key={item.id}><div className={`schedule-time ${scheduleState.item?.id === item.id ? "active-time" : ""}`}>{item.time}</div><div className="schedule-line"><span className={index === 1 ? "teal-dot" : index === 2 ? "orange-dot" : ""} /><div><b>{item.title}</b><small>{item.subtitle}</small></div></div></Fragment>)}</div></section>
      <section className="panel focus-panel"><PanelTitle icon={<Flame size={17} />} title="Focus for today" /><div className="focus-illustration"><div className="focus-ring ring-one" /><div className="focus-ring ring-two" /><div className="focus-center"><Sparkles size={22} /></div><span className="float-card float-a">◒ 82%</span><span className="float-card float-b">+ 6 day streak</span></div><h3>Protect your momentum.</h3><p>You’re building a rhythm. One focused block today keeps the week light.</p><button className="soft-button" onClick={() => navigate("my-day")}>Plan a focus block <Plus size={15} /></button></section>
    </div>
  </>;
}

function StatCard({ icon, label, value, sub, tone, onClick }: { icon: React.ReactNode; label: string; value: string; sub: string; tone: string; onClick: () => void }) {
  return <button className="stat-card" onClick={onClick}><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-text"><span>{label}</span><strong>{value}</strong><small>{sub}</small></div><ArrowUpRight size={16} className="stat-arrow" /></button>;
}

function PanelTitle({ icon, title, action }: { icon: React.ReactNode; title: string; action?: React.ReactNode }) {
  return <div className="panel-title"><div><span className="title-icon">{icon}</span><h2>{title}</h2></div>{action}</div>;
}

function SettingsPage({ department, setDepartment, year, setYear, location, locationDraft, setLocationDraft, setLocation, studentName, studentNameDraft, setStudentNameDraft, setStudentName, theme, setTheme }: { department: string; setDepartment: (value: string) => void; year: string; setYear: (value: string) => void; location: string; locationDraft: string; setLocationDraft: (value: string) => void; setLocation: (value: string) => void; studentName: string; studentNameDraft: string; setStudentNameDraft: (value: string) => void; setStudentName: (value: string) => void; theme: ThemeName; setTheme: (value: ThemeName) => void }) {
  const subjects = academicSubjects[department]?.[year] ?? [];
  const saveLocation = () => setLocation(locationDraft.trim() || "PVPSIT Campus");
  const saveStudentName = () => setStudentName(studentNameDraft.trim().slice(0, 40) || studentName);
  return <>
    <PageHeading eyebrow="PERSONALIZE YOUR CAMPUSOS" title="Settings" description="Shape your academic view and make CampusOS feel like yours." />
    <div className="settings-grid">
      <section className="panel settings-card academic-settings"><div className="settings-card-heading"><div className="settings-heading-icon violet"><GraduationCap size={19} /></div><div><span className="eyebrow">ACADEMIC PROFILE</span><h2>What are you studying?</h2><p>Your department and year power the subjects shown across your planner.</p></div></div><div className="settings-fields"><label><span>Department</span><select value={department} onChange={(event) => setDepartment(event.target.value)}>{departmentOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label><span>Year</span><select value={year} onChange={(event) => setYear(event.target.value)}>{yearOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label></div><div className="subjects-header"><div><span className="eyebrow">YOUR SUBJECTS</span><h3>{year} · {department.split(" – ")[0]}</h3></div><span className="subject-count">{subjects.length} subjects</span></div><div className="subject-list">{subjects.map((subject, index) => <div className="subject-row" key={subject}><span className={`subject-number ${["violet", "teal", "orange", "pink"][index % 4]}`}>0{index + 1}</span><strong>{subject}</strong><ChevronRight size={15} /></div>)}</div></section>
      <div className="settings-side">
        <section className="panel settings-card"><div className="settings-card-heading compact"><div className="settings-heading-icon violet"><Users size={18} /></div><div><span className="eyebrow">YOUR PROFILE</span><h2>Student name</h2><p>Change how CampusOS greets you across the app.</p></div></div><div className="profile-edit-form"><input value={studentNameDraft} maxLength={40} onChange={(event) => setStudentNameDraft(event.target.value)} aria-label="Student name" /><button className="primary-button" onClick={saveStudentName}>Save</button></div><div className="profile-preview"><div className="avatar">{initialsFor(studentName)}</div><div><small>Preview</small><strong>{studentName}</strong></div></div></section>
        <section className="panel settings-card"><div className="settings-card-heading compact"><div className="settings-heading-icon teal"><MapPin size={18} /></div><div><span className="eyebrow">YOUR CAMPUS</span><h2>Location</h2><p>Used to personalize nearby updates.</p></div></div><div className="location-current"><span className="status-dot" /><div><small>Current location</small><strong>{location}</strong></div><Compass size={19} /></div><div className="location-form"><input value={locationDraft} maxLength={60} onChange={(event) => setLocationDraft(event.target.value)} aria-label="Campus location" /><button className="primary-button" onClick={saveLocation}>Save</button></div></section>
        <section className="panel settings-card theme-settings"><div className="settings-card-heading compact"><div className="settings-heading-icon orange"><Sparkles size={18} /></div><div><span className="eyebrow">APPEARANCE</span><h2>Theme</h2><p>Choose a comfortable view for long study sessions.</p></div></div><div className="theme-toggle theme-picker"><button className={theme === "default" ? "selected" : ""} onClick={() => setTheme("default")}><span>☀️</span><b>Default</b><small>Current CampusOS</small></button><button className={theme === "marvel" ? "selected" : ""} onClick={() => setTheme("marvel")}><span>★</span><b>Marvel</b><small>Cinematic energy</small></button><button className={theme === "cars" ? "selected" : ""} onClick={() => setTheme("cars")}><span>🏁</span><b>Cars</b><small>Racing focus</small></button><button className={theme === "space" ? "selected" : ""} onClick={() => setTheme("space")}><span>✦</span><b>Space</b><small>Galaxy mode</small></button></div></section>
      </div>
    </div>
  </>;
}

function EventModal({ event, onClose }: { event: (typeof upcomingEvents)[number]; onClose: () => void }) {
  return <div className="modal-backdrop" onClick={onClose}><div className="event-modal" onClick={(eventClick) => eventClick.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close event"><X size={18} /></button><div className={`event-modal-art ${event.color}`}><span>{event.icon}</span><small>UPCOMING EVENT</small></div><div className="event-modal-content"><span className="eyebrow">CAMPUS EVENTS</span><h2>{event.title}</h2><p className="event-description">{event.description}</p><div className="event-detail-list"><div><CalendarDays size={16} /><span><b>Date</b>{event.date}</span></div><div><Clock3 size={16} /><span><b>Time</b>{event.time}</span></div><div><MapPin size={16} /><span><b>Venue</b>{event.venue}</span></div></div><button className="primary-button full" onClick={onClose}><CheckCircle2 size={16} /> Got it, save the date</button></div></div></div>;
}

function ModalFrame({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return <div className="modal-backdrop" onClick={onClose}><div className="generic-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button><span className="eyebrow">CAMPUSOS</span><h2>{title}</h2>{children}</div></div>;
}

function NotificationsModal({ onClose, read }: { onClose: () => void; read: boolean }) {
  const notifications = [{ title: "Java assignment due tomorrow", description: "Your current syllabus workspace has work waiting for a final review.", time: "Today · 09:20" }, { title: "Next class schedule updated", description: "Your department and year timetable is synced across CampusOS.", time: "Today · 08:30" }, { title: "Hackathon registration is open", description: "Save your spot for Campus Hackathon 2026.", time: "Yesterday" }];
  return <ModalFrame title="Notifications" onClose={onClose}><div className="notification-list">{notifications.map((item, index) => <article className={`notification-item ${!read && index < 2 ? "unread" : ""}`} key={item.title}><span className="notification-dot" /><div><b>{item.title}</b><p>{item.description}</p><small>{item.time}</small></div></article>)}</div></ModalFrame>;
}

function ProfileModal({ name, department, year, onClose }: { name: string; department: string; year: string; onClose: () => void }) {
  return <ModalFrame title="Profile details" onClose={onClose}><div className="profile-modal-head"><div className="avatar large">{initialsFor(name)}</div><div><h3>{name}</h3><p>{name.toLowerCase().replace(/\s+/g, ".")}@campusos.edu</p></div></div><div className="profile-details-grid"><div><small>Department</small><b>{department.split(" – ")[0]}</b></div><div><small>Year</small><b>{year}</b></div><div><small>Workspace</small><b>Student account</b></div></div><button className="primary-button full" onClick={onClose}>Done</button></ModalFrame>;
}

function SupportModal({ subject, setSubject, message, setMessage, onClose, onSent }: { subject: string; setSubject: (value: string) => void; message: string; setMessage: (value: string) => void; onClose: () => void; onSent: () => void }) {
  return <ModalFrame title="Help & support" onClose={onClose}><p className="modal-description">Send a message to the College Management desk. This demo stores your message in the current session.</p><label className="modal-field"><span>Subject</span><select value={subject} onChange={(event) => setSubject(event.target.value)}><option>General help</option><option>Academic issue</option><option>Campus facility</option><option>Report a problem</option></select></label><label className="modal-field"><span>Message</span><textarea value={message} onChange={(event) => setMessage(event.target.value.slice(0, 500))} placeholder="Tell us how we can help..." rows={5} /></label><button className="primary-button full" disabled={!message.trim()} onClick={onSent}><Send size={16} /> Save support message</button></ModalFrame>;
}

function AssignmentModal({ subjects, draft, setDraft, onClose, onSave }: { subjects: string[]; draft: { title: string; subject: string; due: string; priority: string }; setDraft: (value: { title: string; subject: string; due: string; priority: string }) => void; onClose: () => void; onSave: () => void }) {
  return <ModalFrame title="Add assignment" onClose={onClose}><label className="modal-field"><span>Assignment title</span><input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="e.g. Build a REST API" /></label><label className="modal-field"><span>Subject</span><select value={draft.subject} onChange={(event) => setDraft({ ...draft, subject: event.target.value })}><option value="">Choose a subject</option>{subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}</select></label><div className="modal-two-col"><label className="modal-field"><span>Due date</span><input type="date" value={draft.due} onChange={(event) => setDraft({ ...draft, due: event.target.value })} /></label><label className="modal-field"><span>Priority</span><select value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value })}><option>Normal</option><option>High</option></select></label></div><button className="primary-button full" onClick={onSave}><Plus size={16} /> Add assignment</button></ModalFrame>;
}

function Attendance({ department, year }: { department: string; year: string }) {
  const data = getAttendanceData(department, year);
  return <><PageHeading eyebrow="ACADEMIC PULSE" title="Attendance" description="Know your buffer before the week gets busy." action={<div className="academic-pill"><span className="status-dot" /> {department.split(" – ")[0]} · {year}</div>} /><section className="attendance-overview"><div className="attendance-score"><div className="score-donut"><div><strong>{(data.reduce((sum, item) => sum + item.attended, 0) / data.reduce((sum, item) => sum + item.total, 0) * 100).toFixed(1)}</strong><span>overall %</span></div></div><div><span className="eyebrow">ACADEMIC CONFIGURATION</span><h2>{department.split(" – ")[0]} · {year}</h2><p>Subjects update automatically from your Settings profile.</p></div></div><div className="attendance-metrics"><div><span>Department</span><strong>{department.split(" – ")[0]}</strong></div><div><span>Year</span><strong>{year}</strong></div><div><span>Subjects</span><strong>{data.length}</strong></div></div></section><div className="section-heading-row"><div><span className="eyebrow">SUBJECT BREAKDOWN</span><h2>Your attendance, at a glance</h2></div></div><div className="attendance-grid">{data.map((item) => { const percent = Math.round((item.attended / item.total) * 100); return <article className="attendance-card" key={item.subject}><div className="attendance-card-head"><div className={`subject-badge ${item.color}`}>{item.subject.slice(0, 2).toUpperCase()}</div><div><h3>{item.subject}</h3><span>{item.code} · {item.teacher}</span></div></div><div className="progress-label"><strong>{percent}%</strong><span>{item.attended} of {item.total} classes</span></div><div className="progress-track"><i className={item.color} style={{ width: `${percent}%` }} /></div><div className={`attendance-status ${percent < 80 ? "warn" : percent > 88 ? "great" : "steady"}`}>{percent < 80 ? "Needs attention" : percent > 88 ? "Excellent rhythm" : "On track"}<span>{percent < 80 ? "Attend next 3" : `${Math.max(0, Math.floor((item.attended - item.total * 0.8) / 0.8))} safe to miss`}</span></div></article>; })}</div></>;
}

function Assignments({ assignments, search, setSearch, filter, setFilter, updateAssignment, deleteAssignment, completedCount, onAdd }: { assignments: Assignment[]; search: string; setSearch: (value: string) => void; filter: "all" | "active" | "completed"; setFilter: (value: "all" | "active" | "completed") => void; updateAssignment: (id: string) => void; deleteAssignment: (id: string) => void; completedCount: number; onAdd: () => void }) {
  return <><PageHeading eyebrow="YOUR WORKSPACE" title="Assignments" description={`${completedCount} completed · ${assignments.filter((item) => item.status !== "completed").length} still in motion`} action={<button className="primary-button" onClick={onAdd}><Plus size={16} /> Add assignment</button>} /><div className="toolbar"><div className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value.slice(0, 80))} placeholder="Search assignments..." aria-label="Search assignments" />{search && <button onClick={() => setSearch("")} aria-label="Clear search"><X size={15} /></button>}</div><div className="filter-tabs">{(["all", "active", "completed"] as const).map((value) => <button key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>{value === "all" ? "All work" : value === "active" ? "In progress" : "Completed"}</button>)}</div></div>{assignments.length === 0 ? <div className="empty-state"><div className="empty-icon"><Search size={24} /></div><h3>No assignments found</h3><p>Try a different search, or clear the filters to see everything.</p><button className="soft-button" onClick={() => { setSearch(""); setFilter("all"); }}>Clear search <X size={15} /></button></div> : <div className="assignment-list">{assignments.map((item) => <article className={`assignment-card ${item.status === "completed" ? "is-complete" : ""}`} key={item.id}><div className={`assignment-symbol ${item.status}`}>{item.status === "completed" ? <Check size={19} /> : <FileText size={19} />}</div><div className="assignment-main"><div className="assignment-topline"><span>{item.subject}</span><span className={`due-pill ${item.status}`}>{item.status === "completed" ? "Complete" : item.dueLabel}</span></div><h3>{item.title}</h3><div className="assignment-progress"><div className="progress-track"><i className={item.status} style={{ width: `${item.progress}%` }} /></div><span>{item.progress === 100 ? "100%" : "0%"}</span></div></div><button className={`check-button ${item.status === "completed" ? "checked" : ""}`} onClick={() => updateAssignment(item.id)} aria-label={`Mark ${item.title} ${item.status === "completed" ? "incomplete" : "complete"}`}>{item.status === "completed" ? <Check size={17} /> : <span />}</button><button className="delete-button" onClick={() => deleteAssignment(item.id)} aria-label={`Delete ${item.title}`}><Trash2 size={15} /></button></article>)}</div>}</>;
}

function MyDay({ dayItems, setDayItems, now, showAdd, setShowAdd, newTask, setNewTask, taskError, setTaskError, addTask }: { dayItems: DayItem[]; setDayItems: React.Dispatch<React.SetStateAction<DayItem[]>>; now: Date; showAdd: boolean; setShowAdd: (value: boolean) => void; newTask: string; setNewTask: (value: string) => void; taskError: string; setTaskError: (value: string) => void; addTask: () => void }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [editing, setEditing] = useState<DayItem | null>(null);
  const scheduleState = getScheduleState(dayItems, now);
  return <><PageHeading eyebrow="THE WOW FEATURE" title="My Day" description="One timeline for class, focus, friends, and everything in between." action={<button className="primary-button" onClick={() => { setShowAdd(true); setTaskError(""); }}><Plus size={16} /> Add to day</button>} /><div className="day-layout"><section className="day-timeline panel"><div className="timeline-top"><div><span className="eyebrow">{formatDate(now)}</span><h2>A day with intention.</h2></div><div className="day-weather"><span>☀️</span><div><b>28°</b><small>clear skies</small></div></div></div><div className="timeline-list">{dayItems.map((item, index) => { const Icon = iconForType(item.type); const isHere = scheduleState.item?.id === item.id; return <div className={`timeline-item ${index === 0 ? "first" : ""} ${isHere ? "timeline-current" : ""}`} key={item.id}><div className="timeline-time">{item.time}</div><div className={`timeline-node ${item.accent}`}><Icon size={15} /></div><div className="timeline-content"><div className="timeline-card"><div><h3>{item.title}</h3><p>{item.subtitle}</p></div><div className="timeline-actions"><button className="dots-button" aria-label={`More options for ${item.title}`} onClick={() => setOpenMenu(openMenu === item.id ? null : item.id)}><MoreHorizontal size={17} /></button>{openMenu === item.id && <div className="item-menu"><button onClick={() => { setEditing(item); setOpenMenu(null); }}>Change time</button><button onClick={() => { setDayItems((current) => current.filter((entry) => entry.id !== item.id)); setOpenMenu(null); }}>Delete</button></div>}</div></div>{isHere && <span className="now-marker"><i /> You are here · {scheduleState.label}</span>}</div></div>; })}</div>{scheduleState.index < 0 && <p className="schedule-complete">No more classes today. Your schedule is complete.</p>}</section><aside className="day-side"><section className="panel productivity-animation"><div className="orbit-core"><Sparkles size={22} /></div><div className="orbit orbit-a" /><div className="orbit orbit-b" /><span className="eyebrow">MOMENTUM LOOP</span><h3>Small progress compounds.</h3><p>Your timeline keeps the day moving, one focused block at a time.</p><div className="momentum-bars"><i /><i /><i /><i /><i /></div></section></aside></div>{showAdd && <div className="add-task-panel panel"><div><span className="eyebrow">QUICK ADD</span><h3>What belongs in your day?</h3></div><div className="add-task-form"><div className="input-wrap"><input autoFocus maxLength={60} value={newTask} onChange={(event) => { setNewTask(event.target.value); setTaskError(""); }} onKeyDown={(event) => { if (event.key === "Enter") addTask(); }} placeholder="e.g. Review project slides" aria-label="New task" /><span>{newTask.length}/60</span></div><button className="primary-button" onClick={addTask}><Check size={16} /> Add task</button><button className="ghost-button" onClick={() => setShowAdd(false)}>Cancel</button></div>{taskError && <p className="inline-error"><AlertCircle size={15} />{taskError}</p>}</div>}{editing && <ModalFrame title="Change time" onClose={() => setEditing(null)}><label className="modal-field"><span>Time</span><input type="time" value={editing.time} onChange={(event) => setEditing({ ...editing, time: event.target.value })} /></label><button className="primary-button full" onClick={() => { setDayItems((current) => current.map((item) => item.id === editing.id ? editing : item)); setEditing(null); }}>Save time</button></ModalFrame>}</>;
}

function LostFound({ items, search, setSearch, onContact, onAdd }: { items: LostItem[]; search: string; setSearch: (value: string) => void; onContact: (item: LostItem) => void; onAdd: (item: LostItem) => void }) {
  const [showReport, setShowReport] = useState(false);
  const [draft, setDraft] = useState({ title: "", location: "", category: "Study item" });
  const saveReport = () => { if (!draft.title.trim() || !draft.location.trim()) return; onAdd({ id: `lost-${Date.now()}`, emoji: draft.category === "Electronics" ? "🎧" : draft.category === "Small item" ? "🔑" : "📒", title: draft.title.trim(), location: draft.location.trim(), time: "Just now", tag: draft.category, color: "violet", status: "waiting", owner: `Campus Desk ${items.length + 1}` }); setDraft({ title: "", location: "", category: "Study item" }); setShowReport(false); };
  return <><PageHeading eyebrow="LOOK OUT FOR EACH OTHER" title="Lost & Found" description="A small campus is a kinder campus. Help something find its way home." action={<button className="outline-button" onClick={() => setShowReport(true)}><PackageSearch size={16} /> Report an item</button>} /><section className="lost-hero"><div className="lost-hero-copy"><div className="hero-icon"><Heart size={21} /></div><span className="eyebrow light">COMMUNITY BOARD</span><h2>Found something?<br /><em>Keep it moving.</em></h2><p>Every recovered item is a little moment of campus kindness.</p></div><div className="lost-stats"><div><strong>{items.filter((item) => item.status === "returned").length}</strong><span>items reunited</span></div><div><strong>{items.filter((item) => item.status === "waiting").length}</strong><span>waiting for owners</span></div></div></section><div className="toolbar lost-toolbar"><div className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value.slice(0, 80))} placeholder="Search by item or place..." aria-label="Search lost and found" />{search && <button onClick={() => setSearch("")} aria-label="Clear search"><X size={15} /></button>}</div><span className="result-count">{items.length} {items.length === 1 ? "item" : "items"}</span></div>{items.length === 0 ? <div className="empty-state"><div className="empty-icon"><PackageSearch size={24} /></div><h3>Nothing on the board yet</h3><p>Try searching for “wallet”, “library”, or “earbuds”.</p><button className="soft-button" onClick={() => setSearch("")}>Show all items <ArrowUpRight size={15} /></button></div> : <div className="lost-grid">{items.map((item) => <article className="lost-card" key={item.id}><div className={`lost-item-art ${item.color}`}><span>{item.emoji}</span><small>{item.status === "returned" ? "Item returned" : item.tag}</small></div><div className="lost-card-body"><div className="lost-card-meta"><span><Clock3 size={13} /> {item.time}</span><span><MapPin size={13} /> Campus</span></div><h3>{item.title}</h3><p>{item.location}</p><small className="owner-line">Contact: {item.owner}</small>{item.status === "waiting" ? <button className="contact-button" onClick={() => onContact(item)}>Contact owner <ArrowUpRight size={15} /></button> : <span className="returned-label"><CheckCircle2 size={14} /> Returned to owner</span>}</div></article>)}</div>}{showReport && <ModalFrame title="Report an item" onClose={() => setShowReport(false)}><label className="modal-field"><span>Item name</span><input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="e.g. Black wallet" /></label><label className="modal-field"><span>Found location</span><input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} placeholder="e.g. CSE block" /></label><label className="modal-field"><span>Category</span><select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}><option>Study item</option><option>Electronics</option><option>Small item</option></select></label><button className="primary-button full" disabled={!draft.title.trim() || !draft.location.trim()} onClick={saveReport}><Plus size={16} /> Publish report</button></ModalFrame>}</>;
}
