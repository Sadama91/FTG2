import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CropPlanner from './pages/CropPlanner';
import FarmDesign from './pages/FarmDesign';
import Production from './pages/Production';
import Leveling from './pages/Leveling';
import DataEditor from './pages/DataEditor';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="planner" element={<CropPlanner />} />
          <Route path="design" element={<FarmDesign />} />
          <Route path="production" element={<Production />} />
          <Route path="leveling" element={<Leveling />} />
          <Route path="data" element={<DataEditor />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
