import './App.css';
import "sanitize.css"

import Start from "./Start"
import Leaderboard from './Leaderboard';

import { BrowserRouter, Routes, Route } from "react-router-dom"
function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index path="start/:batchId" element={<Start />} />
            <Route path="leaderboard/:batchId" element={<Leaderboard />}/>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
