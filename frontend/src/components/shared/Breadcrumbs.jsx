// src/components/shared/Breadcrumbs.jsx
import { useLocation, Link } from "react-router-dom";

const Breadcrumbs = ({ customLabels = {} }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  const labelMap = {
    home: "Trang chủ",
    "admin-dashboard": "Tổng quan",
    employees: "Nhân viên",
    view: "Chi tiết",
    create: "Tạo mới",
    edit: "Chỉnh sửa",
    // bạn có thể thêm bất cứ từ nào cần
  };

  return (
    <nav className="text-sm text-gray-600 mb-4">
      <ul className="flex space-x-2 items-center">
        <li>
          <Link to="/" className="hover:underline">
            Trang chủ
          </Link>
        </li>
        {pathnames.map((segment, idx) => {
          const route = "/" + pathnames.slice(0, idx + 1).join("/");

          // Ưu tiên dùng customLabels (VD: ID hiển thị tên nhân viên)
          const label = customLabels[segment] || labelMap[segment] || segment;

          return (
            <li key={idx} className="flex items-center space-x-1">
              <span>/</span>
              <Link to={route} className="hover:underline capitalize">
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
