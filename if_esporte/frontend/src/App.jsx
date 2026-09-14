import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./componentes/Sidebar";

import Dashboard from "./paginas/Dashboard";
import Calendario from "./paginas/Calendario";
import Eventos from "./paginas/Eventos";
import Campi from "./paginas/Campi";
import Modalidades from "./paginas/Modalidades";
import Inscricoes from "./paginas/Inscricoes";

import Login from "./paginas/Login";
import Cadastro from "./paginas/Cadastro";

import "./App.css";


// ================================
// LAYOUT PRINCIPAL
// ================================

function Layout({ children }) {
    return (
        <div className="app">
            <Sidebar />

            <main className="main">
                {children}
            </main>
        </div>
    );
}


// ================================
// PEGAR USUÁRIO DO LOCALSTORAGE
// ================================

function obterUsuario() {
    try {
        return JSON.parse(
            localStorage.getItem("usuario") || "null"
        );
    } catch (error) {
        console.error("Erro ao obter usuário:", error);
        return null;
    }
}


// ================================
// VERIFICA SE PODE ENTRAR NA ÁREA
// ================================

function RotaPublica({ children }) {
    const token = localStorage.getItem("token");
    const usuario = obterUsuario();

    // Usuário logado ou visitante
    if (
        token ||
        usuario?.role === "VISITANTE"
    ) {
        return children;
    }

    // Se não estiver logado, volta para o login
    return <Navigate to="/" replace />;
}


// ================================
// ROTA SOMENTE PARA USUÁRIOS LOGADOS
// ================================

function RotaAutenticada({ children }) {
    const token = localStorage.getItem("token");
    const usuario = obterUsuario();

    // Sem token = não está logado
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // Visitante não pode acessar
    if (usuario?.role === "VISITANTE") {
        return <Navigate to="/eventos" replace />;
    }

    return children;
}


// ================================
// APLICAÇÃO
// ================================

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* =========================
                    LOGIN
                ========================= */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =========================
                    CADASTRO
                ========================= */}

                <Route
                    path="/cadastro"
                    element={<Cadastro />}
                />


                {/* =========================
                    PÁGINAS PÚBLICAS
                    VISITANTE PODE VISUALIZAR
                ========================= */}

                <Route
                    path="/eventos"
                    element={
                        <RotaPublica>
                            <Layout>
                                <Eventos />
                            </Layout>
                        </RotaPublica>
                    }
                />

                <Route
                    path="/calendario"
                    element={
                        <RotaPublica>
                            <Layout>
                                <Calendario />
                            </Layout>
                        </RotaPublica>
                    }
                />

                <Route
                    path="/campi"
                    element={
                        <RotaPublica>
                            <Layout>
                                <Campi />
                            </Layout>
                        </RotaPublica>
                    }
                />

                <Route
                    path="/modalidades"
                    element={
                        <RotaPublica>
                            <Layout>
                                <Modalidades />
                            </Layout>
                        </RotaPublica>
                    }
                />


                {/* =========================
                    PÁGINAS SOMENTE LOGADAS
                ========================= */}

                <Route
                    path="/dashboard"
                    element={
                        <RotaAutenticada>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </RotaAutenticada>
                    }
                />

                <Route
                    path="/inscricoes"
                    element={
                        <RotaAutenticada>
                            <Layout>
                                <Inscricoes />
                            </Layout>
                        </RotaAutenticada>
                    }
                />


                {/* =========================
                    ROTA NÃO ENCONTRADA
                ========================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;