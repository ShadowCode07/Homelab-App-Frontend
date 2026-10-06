import { useState } from "react";
import DeviceList from "./pages/DeviceList.jsx";
import "./App.css";

function App() {
  return (
    <main>
      <div className="App">
        <h1>Device List</h1>
        <DeviceList />
      </div>
    </main>
  );
}

export default App;
