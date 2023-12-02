import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <>
      <div className="navbar fixed top-3 left-2 bg-blue-400/30 backdrop-blur-sm rounded-3xl shadow-lg w-[calc(100%-1rem)]">
        <Link to="/" className="btn btn-ghost text-xl">
          Theater
        </Link>
      </div>
      <div className="w-full h-[100px]" />
    </>
  );
};
