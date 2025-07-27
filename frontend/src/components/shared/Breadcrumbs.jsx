// src/components/shared/Breadcrumbs.jsx
import { useLocation, Link } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="text-sm text-gray-600 mb-4">
      <ul className="flex space-x-2 items-center">
        <li><Link to="/" className="hover:underline">Home</Link></li>
        {pathnames.map((segment, idx) => {
          const route = "/" + pathnames.slice(0, idx + 1).join("/");
          return (
            <li key={idx} className="capitalize flex items-center space-x-1">
              <span>/</span>
              <Link to={route} className="hover:underline">{segment.replace(/-/g, " ")}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
