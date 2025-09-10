import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './lib/Layout';

function Home() {
  return <h2>Bem-vindo ao EcoHub!</h2>;
}

function About() {
  return <h2>Sobre o EcoHub</h2>;
}

export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
