import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandPalette } from './components/layout/CommandPalette';

import { DashboardPage } from './pages/DashboardPage';
import { PromotionsPage } from './pages/PromotionsPage';
import { PromotionDetailPage } from './pages/PromotionDetailPage';
import { StudentsPage } from './pages/StudentsPage';
import { StudentDetailPage } from './pages/StudentDetailPage';
// import { TrainersPage } from './pages/TrainersPage'; // Masqué temporairement en front-end
import { InterviewsPage } from './pages/InterviewsPage';
import { MeetingsPage } from './pages/MeetingsPage';
import { ActionsPage } from './pages/ActionsPage';
import { PlanningPage } from './pages/PlanningPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ReportingPage } from './pages/ReportingPage';
import { ImportNeveaPage } from './pages/ImportNeveaPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        {/* Luxury Glassmorphic Ambient Canvas */}
        <div className="relative flex h-screen w-full bg-[#F8F9FB] font-sans text-slate-800 antialiased overflow-hidden selection:bg-[#00D084]/20 selection:text-slate-900">
          
          {/* Subtle Ambient Background Gradients for Glass Translucency */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            {/* Top-left soft emerald/teal ambient glow */}
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#00D084]/10 blur-3xl opacity-70"></div>
            {/* Top-right soft indigo/violet glow */}
            <div className="absolute -top-40 right-10 w-[500px] h-[500px] rounded-full bg-indigo-500/8 blur-3xl opacity-60"></div>
            {/* Center-bottom soft glow */}
            <div className="absolute bottom-10 left-1/3 w-[600px] h-[400px] rounded-full bg-emerald-400/6 blur-3xl opacity-50"></div>
            {/* Subtle luxury mesh grid lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px] opacity-25"></div>
          </div>

          {/* Translucent Glass Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="relative flex-1 flex flex-col min-w-0 h-full overflow-hidden z-10">
            {/* Translucent Glass Header */}
            <Header />

            {/* Scrollable Page Body */}
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
              <div className="max-w-7xl mx-auto pb-12">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/promotions" element={<PromotionsPage />} />
                  <Route path="/promotions/:id" element={<PromotionDetailPage />} />
                  <Route path="/apprenants" element={<StudentsPage />} />
                  <Route path="/apprenants/:id" element={<StudentDetailPage />} />
                  {/* Route Formateurs masquée temporairement côté front (architecture conservée) */}
                  <Route path="/formateurs" element={<Navigate to="/" replace />} />
                  <Route path="/entretiens" element={<InterviewsPage />} />
                  <Route path="/synchronisations" element={<MeetingsPage />} />
                  <Route path="/actions" element={<ActionsPage />} />
                  <Route path="/planning" element={<PlanningPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/reporting" element={<ReportingPage />} />
                  <Route path="/import-nevea" element={<ImportNeveaPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>
          </div>

          {/* Quick command palette (Cmd+K) */}
          <CommandPalette />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
