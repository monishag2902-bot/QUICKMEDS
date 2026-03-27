import React from "react";
import AddMedicine from "./AddMedicine";
import Search from "./Search";
import List from "./List";

function App() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>QuickMeds</h1>

      <AddMedicine />
      <Search />
      <List />
    </div>
  );
}

export default App;
