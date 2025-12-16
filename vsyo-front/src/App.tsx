import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MarketDetail from "./pages/MarketDetail";
import Portfolio from "./pages/Portfolio";
import NotFound from "./pages/NotFound";
import CreateMarket from "./pages/CreateMarket";
import Index from "./pages/Index";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/market/:id" element={<MarketDetail />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/create" element={<CreateMarket />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
