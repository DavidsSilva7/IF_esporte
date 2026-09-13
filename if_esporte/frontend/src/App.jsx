import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./componetes/Sidebar";

import Dashboard from "./paginas/Dashboard";
import Calendario from "./paginas/Calendario";
import Eventos from "./paginas/Eventos";
import Campi from "./paginas/Campi";
import Modalidades from "./paginas/Modalidades";
import Inscricoes from "./paginas/Inscricoes";
import Login from "./paginas/Login";
import Cadastro from "./paginas/Cadastro";

import "./App.css";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* LOGIN */}
                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route
                    path="/cadastro"
                    element={<Cadastro />}
                />

                {/* ÁREA PRINCIPAL */}
                <Route
                    path="/"
                    element={
                        <div className="app">
                            <Sidebar />

                            <main className="main">
                                <Dashboard />
                            </main>
                        </div>
                    }
                />

                <Route
                    path="/calendario"
                    element={
                        <Layout>
                            <Calendario />
                        </Layout>
                    }
                />

                <Route
                    path="/eventos"
                    element={
                        <Layout>
                            <Eventos />
                        </Layout>
                    }
                />

                <Route
                    path="/campi"
                    element={
                        <Layout>
                            <Campi />
                        </Layout>
                    }
                />

                <Route
                    path="/modalidades"
                    element={
                        <Layout>
                            <Modalidades />
                        </Layout>
                    }
                />

                <Route
                    path="/inscricoes"
                    element={
                        <Layout>
                            <Inscricoes />
                        </Layout>
                    }
                />

                {/* QUALQUER ROTA DESCONHECIDA */}
                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>

        </BrowserRouter>
    );
}


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

export default App;