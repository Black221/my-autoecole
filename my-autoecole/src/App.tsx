import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "./ui/primitives";
import { Home } from "./screens/Home";
import { Play } from "./screens/Play";

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play/:kind" element={<Play />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
