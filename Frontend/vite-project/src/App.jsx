
import React from "react";
import Navbar from "./components/Navbar";


const App = () => {
  return (
    <div style={{ display: "flex" }}>
      <Navbar />
      <div style={{ flex: 1, padding: "2rem" }}>
        <h1>Welcome, Admin</h1>
        {/* Other main content goes here */}
      </div>
    </div>
  );
};

export default App;
