import { useState } from "react";
import Navbar from "../components/Navbar";
import SearchComponent from "../components/SearchComponent";

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className={`${isLoginOpen ? "backdrop-blur-md" : ""}`}>
      <Navbar isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} />
      <SearchComponent />
    </div>
  );
}
