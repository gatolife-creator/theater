import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <>
      <div className="navbar fixed left-2 top-3 z-[9999] w-[calc(100%-1rem)] rounded-3xl bg-blue-400/30 shadow-lg backdrop-blur-sm">
        <Link to="/" className="btn btn-ghost text-xl">
          Theater
        </Link>
      </div>
      <div className="h-[100px] w-full" />
    </>
  );
};
