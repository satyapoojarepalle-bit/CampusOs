import { useEffect, useState } from "react";

function App() {
  const [page, setPage] = useState("Dashboard");

  // Search
  const [lostSearch, setLostSearch] = useState("");
  const [assignmentSearch, setAssignmentSearch] = useState("");

  // Student profile
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem("campusos_name") || "";
  });

  const [department, setDepartment] = useState(() => {
    return localStorage.getItem("campusos_department") || "CSE";
  });

  const [year, setYear] = useState(() => {
    return localStorage.getItem("campusos_year") || "2nd Year";
  });

  // My Day
  const [task, setTask] = useState("");

  const [tasks, setTasks] = useState<string[]>(() => {
    const savedTasks = localStorage.getItem("campusos_tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Save tasks automatically
  useEffect(() => {
    localStorage.setItem("campusos_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Save profile automatically
  useEffect(() => {
    localStorage.setItem("campusos_name", studentName);
    localStorage.setItem("campusos_department", department);
    localStorage.setItem("campusos_year", year);
  }, [studentName, department, year]);

  const addTask = () => {
    if (task.trim() !== "") {
      setTasks([...tasks, task.trim()]);
      setTask("");
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="topbar">
        <div>
          <h1>CampusOS</h1>
          <p>Your Student Campus Companion</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="navigation">
        <button onClick={() => setPage("Dashboard")}>
          Dashboard
        </button>

        <button onClick={() => setPage("Attendance")}>
          Attendance
        </button>

        <button onClick={() => setPage("Assignments")}>
          Assignments
        </button>

        <button onClick={() => setPage("My Day")}>
          My Day
        </button>

        <button onClick={() => setPage("Lost & Found")}>
          Lost & Found
        </button>

        <button onClick={() => setPage("Settings")}>
          Settings
        </button>
      </nav>

      {/* Main Content */}
      <main className="content">
        <h2>{page}</h2>

        {/* ================= DASHBOARD ================= */}

        {page === "Dashboard" && (
          <div>
            <h3>
              Welcome back{studentName ? `, ${studentName}` : ""} 👋
            </h3>

            <p>
              Here's your campus overview for today.
            </p>

            <div>
              <h4>Attendance</h4>
              <p>84.6%</p>
            </div>

            <div>
              <h4>Assignments</h4>
              <p>3 assignments pending</p>
            </div>

            <div>
              <h4>Today's Schedule</h4>

              <p>09:00 AM — Database Systems</p>
              <p>11:00 AM — Java Programming</p>
              <p>02:00 PM — Machine Learning</p>
            </div>

            <div>
              <h4>Study Streak</h4>
              <p>6 days 🔥</p>
            </div>
          </div>
        )}

        {/* ================= ATTENDANCE ================= */}

        {page === "Attendance" && (
          <div>
            <h3>Attendance Overview</h3>

            <div>
              <h4>Database Systems</h4>
              <p>33 / 40 classes</p>
              <p>Attendance: 82.5%</p>
            </div>

            <div>
              <h4>Java Programming</h4>
              <p>41 / 45 classes</p>
              <p>Attendance: 91.1%</p>
            </div>

            <div>
              <h4>Computer Networks</h4>
              <p>29 / 38 classes</p>
              <p>Attendance: 76.3%</p>
            </div>

            <div>
              <h4>Machine Learning</h4>
              <p>36 / 42 classes</p>
              <p>Attendance: 85.7%</p>
            </div>
          </div>
        )}

        {/* ================= ASSIGNMENTS ================= */}

        {page === "Assignments" && (
          <div>
            <h3>Assignments</h3>

            <p>
              Track your academic work and deadlines.
            </p>

            <input
              type="text"
              placeholder="Search assignments..."
              value={assignmentSearch}
              onChange={(e) =>
                setAssignmentSearch(e.target.value)
              }
            />

            <div>
              {[
                {
                  title: "Database Systems — SQL Queries",
                  due: "September 12",
                  status: "In Progress",
                },
                {
                  title: "Java Programming — OOP Concepts",
                  due: "September 14",
                  status: "Pending",
                },
                {
                  title: "Machine Learning — Regression",
                  due: "September 16",
                  status: "In Progress",
                },
                {
                  title: "Computer Networks — TCP/IP",
                  due: "September 18",
                  status: "Pending",
                },
              ]
                .filter((assignment) =>
                  assignment.title
                    .toLowerCase()
                    .includes(
                      assignmentSearch.toLowerCase()
                    )
                )
                .map((assignment, index) => (
                  <div key={index}>
                    <h4>{assignment.title}</h4>

                    <p>Due: {assignment.due}</p>

                    <p>
                      Status: {assignment.status}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= MY DAY ================= */}

        {page === "My Day" && (
          <div>
            <h3>My Day</h3>

            <p>
              Plan and organize your daily campus activities.
            </p>

            <input
              type="text"
              placeholder="Add a task..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTask();
                }
              }}
            />

            <button onClick={addTask}>
              Add Task
            </button>

            <div>
              <h4>Today's Tasks</h4>

              <p>
                📚 Review Machine Learning notes
              </p>

              <p>
                📝 Complete DBMS assignment
              </p>

              <p>
                💻 Practice Java problems
              </p>

              {tasks.map((item, index) => (
                <p key={index}>
                  ✅ {item}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* ================= LOST & FOUND ================= */}

        {page === "Lost & Found" && (
          <div>
            <h3>Lost & Found</h3>

            <p>
              Find lost items around campus.
            </p>

            <input
              type="text"
              placeholder="Search for an item..."
              value={lostSearch}
              onChange={(e) =>
                setLostSearch(e.target.value)
              }
            />

            <div>
              <h4>Recently Reported</h4>

              {[
                "🎒 Black Backpack — Library",
                "💳 Student ID Card — Canteen",
                "🔑 Keychain — Block A",
                "📱 Mobile Phone — Seminar Hall",
              ]
                .filter((item) =>
                  item
                    .toLowerCase()
                    .includes(
                      lostSearch.toLowerCase()
                    )
                )
                .map((item, index) => (
                  <p key={index}>
                    {item}
                  </p>
                ))}
            </div>
          </div>
        )}

        {/* ================= SETTINGS ================= */}

        {page === "Settings" && (
          <div>
            <h3>Settings</h3>

            <p>
              Manage your CampusOS profile and preferences.
            </p>

            <div>
              <h4>Student Profile</h4>

              <label>Name</label>

              <br />

              <input
                type="text"
                placeholder="Enter your name"
                value={studentName}
                onChange={(e) =>
                  setStudentName(e.target.value)
                }
              />

              <br />
              <br />

              <label>Department</label>

              <br />

              <select
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
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

              <br />
              <br />

              <label>Year</label>

              <br />

              <select
                value={year}
                onChange={(e) =>
                  setYear(e.target.value)
                }
              >
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>

            <br />

            <div>
              <h4>Current Profile</h4>

              <p>
                Name: {studentName || "Not set"}
              </p>

              <p>
                Department: {department}
              </p>

              <p>
                Year: {year}
              </p>
            </div>

            <div>
              <h4>Preferences</h4>

              <button
                onClick={() =>
                  alert("Settings saved successfully!")
                }
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;