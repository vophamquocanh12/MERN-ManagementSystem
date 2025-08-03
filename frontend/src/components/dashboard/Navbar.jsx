import useAuth from "../../context/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between items-center bg-teal-600 text-white px-6 py-3">
      <p className="text-lg font-semibold">
        Xin chào, {user?.name || "User"} ({user?.role})
      </p>
      <button
        onClick={logout}
        className="bg-teal-800 hover:bg-teal-900 px-4 py-2 rounded transition"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default Navbar;
