import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "./ui/primitives";
import { Home } from "./screens/Home";
import { Play } from "./screens/Play";
import { CoursIndex } from "./screens/CoursIndex";
import { CoursDetail } from "./screens/CoursDetail";

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cours" element={<CoursIndex />} />
          <Route path="/cours/:themeId" element={<CoursDetail />} />
          <Route path="/play/:kind" element={<Play />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
