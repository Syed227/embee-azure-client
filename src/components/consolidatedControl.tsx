import { Link, Outlet } from "react-router-dom";



export default function ConsolidatedControl() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-extrabold p-3 heading my-6">
  Consolidated View
</h1>
      <div className="flex space-x-4 mb-4">
        <Link
          to="/consolidated/EA"
          className="bg-[#ab2026] hover:bg-[#1D4568] text-white px-4 py-2 rounded shadow-sm"
        >
          Consolidated EA
        </Link>
        <Link
          to="/consolidated/CSP"
          className="bg-[#ab2026] hover:bg-[#1D4568] text-white px-4 py-2 rounded shadow-sm"
        >
          Consolidated CSP
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
