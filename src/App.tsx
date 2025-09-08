import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/organisms/navbar';


import NotFound from './pages/notfound';
import Home from './pages/home';
import Feedback from './pages/feedback';
// import Rankings from './pages/rankings';
import Inaccuracy from './pages/inaccuracy';
import { Footer } from './components/organisms/footer';
import { Wars } from './pages/wars';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WarDetail } from './pages/war-detail';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (

    <HashRouter>
      <div className="flex flex-col h-screen">
        <Navbar />
        <main className="flex-grow  pt-16">
          <QueryClientProvider client={queryClient} >
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/players" element={<Players />} /> */}
              {/* <Route path="/players/:characterName/:mode?" element={<PlayerDetails />} /> */}
              {/* <Route path="/companies" element={<Companies />} /> */}
              {/* <Route path="/companies/:companyName" element={<CompanyDetail />} /> */}
              <Route path="/wars" element={<Wars />} />
              <Route path="/wars/:warId" element={<WarDetail />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/inaccuracy" element={<Inaccuracy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </QueryClientProvider>
        </main>
        <Footer />
      </div>
    </HashRouter >

  );
};

export default App;
