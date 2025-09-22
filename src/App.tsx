import { Routes, Route } from 'react-router-dom';
import Professional from "./Professional/Professional.tsx";
import { CssBaseline } from '@mui/material';
import PatientDisplay from './Display/Display.tsx';

function App() {
  return (
      <>
        <CssBaseline />
        <Routes>
          <Route path="/professional" element={<Professional />} />
          <Route path="/display" element={<PatientDisplay />} />
        </Routes>
      </>
  );
}

export default App;