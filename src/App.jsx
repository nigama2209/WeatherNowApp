import React, { lazy, Suspense } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = lazy(() => import("./components/Home"));

function App() {
  return (
    <Suspense fallback={<div className="text-center mt-5">Loading...</div>}>
      <Home />
    </Suspense>
  );
}

export default App;

