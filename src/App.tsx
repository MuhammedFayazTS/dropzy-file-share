import { useSocket } from "./hooks/useSocket";
import { Route, Routes } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Content from "./Content";
import Home from "./pages/Home";

function App() {
  useSocket();

  return (
    <main className="w-full h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Content />} >
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
      <Footer />
    </main>
  )
}
export default App
