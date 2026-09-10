import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from './pages/LandingPage.tsx';
import { SignInPage } from '@/pages/SignInPage.tsx';
import { SignUpPage } from '@/pages/SignUpPage.tsx';
import HomePage from '@/pages/HomePage.tsx';
import { CreatePostPage } from '@/pages/CreatePostPage.tsx';
import { AboutPage } from '@/pages/AboutPage.tsx';
import { UserProfilePage } from '@/pages/UserProfilePage.tsx';
import { SocialAccountsPage } from '@/pages/SocialAccountsPage.tsx';
import { ProtectedRoute } from '@/components/ProtectedRoute.tsx';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/home" element={<HomePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile/:id" element={<UserProfilePage />} />
            <Route path="/create" element={<CreatePostPage/>} />
            <Route path="/access" element={<SocialAccountsPage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-left" richColors />
    </>
  );
}

