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
import { TrainersPage } from './pages/TrainersPage';
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
        <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-800 antialiased overflow-hidden">
          {/* Sidebar fixe */}
          <Sidebar />

          {/* Zone principale */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            {/* Header supérieur */}
            <Header />

            {/* Corps de page défilable */}
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
              <div className="max-w-7xl mx-auto pb-12">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/promotions" element={<PromotionsPage />} />
                  <Route path="/promotions/:id" element={<PromotionDetailPage />} />
                  <Route path="/apprenants" element={<StudentsPage />} />
                  <Route path="/apprenants/:id" element={<StudentDetailPage />} />
                  <Route path="/formateurs" element={<TrainersPage />} />
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

          {/* Palette de commande rapide (Cmd+K) */}
          <CommandPalette />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;

