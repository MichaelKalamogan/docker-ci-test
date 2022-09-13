import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import OtherPage from "./OtherPage.js";
import Fib from "./Fib.js";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header>
          <Link to="/">Home</Link>
          <Link to="/otherpage">Other Page</Link>
        </header>

        <Routes>
          <Route path="/" element={<Fib />} />
          <Route path="/otherpage" element={<OtherPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
