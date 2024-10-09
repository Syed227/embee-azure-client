import { Link, Outlet } from "react-router-dom";
import cancel from '../assets/cancel.svg'

type Props = {
 
  role: string;
};

export default function UpdateData({ role }: Props) {
  console.log(role)
  if (role === "Account Manager") {
    return (
      <div className="p-4 flex flex-col items-center">
        <img src={cancel} alt="Access Denied" className=" w-40 h-40 mb-4 p-5" />
        <p className="text-lg text-[#1D4568] font-semibold">You don't have access to this feature</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-extrabold p-3 my-6 heading">
        Update Data
      </h1>
      <div className="flex space-x-4 mb-4">
        <Link
          to="/update/updateEA"
          className="bg-[#ab2026] hover:bg-[#1D4568] text-white px-4 py-2 rounded shadow-sm"
        >
          Update EA
        </Link>
        <Link
          to="/updateCSP"
          className="bg-[#ab2026] hover:bg-[#1D4568] text-white px-4 py-2 rounded shadow-sm"
        >
          Update CSP
        </Link>
      </div>
      <Outlet />
    </div>
  );
}