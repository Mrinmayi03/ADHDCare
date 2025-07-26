import { NavLink } from "react-router-dom";

const links = [
  { to: "/",               label: "Home",          end: true  },
  { to: "/tasks",          label: "Tasks"                 },
  { to: "/moodlogs",           label: "Mood"                  },
  { to: "/medicationlogs",    label: "Medications"           },
  { to: "/trends",         label: "Mood Trends"           },
  { to: "/sentiment-charts", label: "Sentiment Summary"  },
  { to: "/wordcloud",      label: "Word Cloud"            },
];

export function NavBar() {
  return (
    <nav className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-4">
        <ul className="flex space-x-6 py-3">
          {links.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `hover:text-accent ${
                    isActive ? "border-b-2 border-accent pb-1" : ""
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
