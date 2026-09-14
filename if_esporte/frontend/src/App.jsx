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

// ======================================================
// PEGAR USUÁRIO DO LOCALSTORAGE
// ======================================================

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

// ======================================================
// LAYOUT PRINCIPAL
// ======================================================

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

// ======================================================
// ROTA PÚBLICA
// ======================================================
//
// Dashboard, eventos, calendário, campi e modalidades
// podem ser acessados sem login.
//
// ======================================================

function RotaPublica({ children }) {
    return (
        <Layout>
            {children}
        </Layout>
    );
}

// ======================================================
// ROTA AUTENTICADA
// ======================================================
//
// Exige login.
// ======================================================

function RotaAutenticada({ children }) {
    const token = localStorage.getItem("token");
    const usuario = obterUsuario();

    // Não está logado
    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // Visitante não pode acessar
    // áreas exclusivas de usuários
    if (usuario?.role === "VISITANTE") {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return (
        <Layout>
            {children}
        </Layout>
    );
}

// ======================================================
// ROTA ADMIN
// ======================================================

function RotaAdmin({ children }) {
    const token = localStorage.getItem("token");
    const usuario = obterUsuario();

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (usuario?.role !== "ADMIN") {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return (
        <Layout>
            {children}
        </Layout>
    );
}

// ======================================================
// ROTA ADMIN OU ORGANIZADOR
// ======================================================

function RotaGerenciamento({ children }) {
    const token = localStorage.getItem("token");
    const usuario = obterUsuario();

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (
        usuario?.role !== "ADMIN" &&
        usuario?.role !== "ORGANIZADOR"
    ) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return (
        <Layout>
            {children}
        </Layout>
    );
}

// ======================================================
// APLICAÇÃO
// ======================================================

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* ==================================================
                    DASHBOARD / INÍCIO
                ================================================== */}

                <Route
                    path="/"
                    element={
                        <RotaPublica>
                            <Dashboard />
                        </RotaPublica>
                    }
                />

                {/* Mantém /dashboard funcionando */}

                <Route
                    path="/dashboard"
                    element={
                        <RotaPublica>
                            <Dashboard />
                        </RotaPublica>
                    }
                />

                {/* ==================================================
                    LOGIN
                ================================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* ==================================================
                    CADASTRO
                ================================================== */}

                <Route
                    path="/cadastro"
                    element={<Cadastro />}
                />

                {/* ==================================================
                    EVENTOS
                ================================================== */}

                <Route
                    path="/eventos"
                    element={
                        <RotaPublica>
                            <Eventos />
                        </RotaPublica>
                    }
                />

                {/* ==================================================
                    CALENDÁRIO
                ================================================== */}

                <Route
                    path="/calendario"
                    element={
                        <RotaPublica>
                            <Calendario />
                        </RotaPublica>
                    }
                />

                {/* ==================================================
                    CAMPI
                ================================================== */}

                <Route
                    path="/campi"
                    element={
                        <RotaPublica>
                            <Campi />
                        </RotaPublica>
                    }
                />

                {/* ==================================================
                    MODALIDADES
                ================================================== */}

                <Route
                    path="/modalidades"
                    element={
                        <RotaPublica>
                            <Modalidades />
                        </RotaPublica>
                    }
                />

                {/* ==================================================
                    INSCRIÇÕES
                ================================================== */}

                <Route
                    path="/inscricoes"
                    element={
                        <RotaAutenticada>
                            <Inscricoes />
                        </RotaAutenticada>
                    }
                />

                {/* ==================================================
                    PREPARAÇÕES
                ================================================== */}

                <Route
                    path="/preparacoes"
                    element={
                        <RotaGerenciamento>
                            <div className="page">

                                <h2>Preparações</h2>

                                <p>
                                    Área de preparação esportiva.
                                </p>

                            </div>
                        </RotaGerenciamento>
                    }
                />

                {/* ==================================================
                    PARTIDAS
                ================================================== */}

                <Route
                    path="/partidas"
                    element={
                        <RotaGerenciamento>
                            <div className="page">

                                <h2>Partidas</h2>

                                <p>
                                    Área de acompanhamento das partidas.
                                </p>

                            </div>
                        </RotaGerenciamento>
                    }
                />

                {/* ==================================================
                    CLASSIFICAÇÃO
                ================================================== */}

                <Route
                    path="/classificacao"
                    element={
                        <RotaGerenciamento>
                            <div className="page">

                                <h2>Classificação</h2>

                                <p>
                                    Área de classificação das competições.
                                </p>

                            </div>
                        </RotaGerenciamento>
                    }
                />

                {/* ==================================================
                    USUÁRIOS
                ================================================== */}

                <Route
                    path="/usuarios"
                    element={
                        <RotaAdmin>
                            <div className="page">

                                <h2>Usuários</h2>

                                <p>
                                    Gerenciamento de usuários do sistema.
                                </p>

                            </div>
                        </RotaAdmin>
                    }
                />

                {/* ==================================================
                    ROTA NÃO ENCONTRADA
                ================================================== */}

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