import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./componentes/Sidebar";

import Dashboard from "./paginas/Dashboard";
import Calendario from "./paginas/Calendario";
import Eventos from "./paginas/Eventos";
import Campi from "./paginas/Campi";
import Modalidades from "./paginas/Modalidades";
import Inscricoes from "./paginas/Inscricoes";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <div className="app">

                <Sidebar />

                <main className="main">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />

                        <Route
                            path="/calendario"
                            element={<Calendario />}
                        />

                        <Route
                            path="/eventos"
                            element={<Eventos />}
                        />

                        <Route
                            path="/campi"
                            element={<Campi />}
                        />

                        <Route
                            path="/modalidades"
                            element={<Modalidades />}
                        />
                        <Route
                          path="/inscricoes"
                          element={<Inscricoes />}
                        />
                    </Routes>
                </main>

            </div>
        </BrowserRouter>
    );
}

export default App;
