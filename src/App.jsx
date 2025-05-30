import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import FaceId from './pages/FaceId'

function App() {
  return (
<Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reconhecimento-facial" element={<FaceId />} />
      </Routes>
    </Router>
  )
}
export default App
