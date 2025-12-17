import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ChatProvider } from './context/ChatContext';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import AppRoutes from './AppRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ChatProvider>
            <div className="app-layout">
              <Nav />
              <main className="main-content">
                <AppRoutes />
              </main>
              
              <ChatWidget />
              <Footer />
            </div>
          </ChatProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;