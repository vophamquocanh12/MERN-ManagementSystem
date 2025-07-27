const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center px-6">
      <h1 className="text-5xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-2xl font-semibold text-gray-800">Access Denied</p>
      <p className="text-gray-600 mt-2">You don't have permission to view this page.</p>
      <a
        href="/"
        className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Go Home
      </a>
    </div>
  );
};

export default Unauthorized;
