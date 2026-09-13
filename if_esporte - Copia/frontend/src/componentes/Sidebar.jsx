import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h1>IF ESPORTE</h1>

      <nav>
        <NavLink to="/" end>
          🏠 Início
        </NavLink>

        <NavLink to="/calendario">
          📅 Calendário
        </NavLink>

        <NavLink to="/eventos">
          🏆 Eventos
        </NavLink>

        <NavLink to="/campi">
          🏫 Campi
        </NavLink>

        <NavLink to="/modalidades">
          ⚽ Modalidades
        </NavLink>

        <NavLink to="/inscricoes">
          📝 Inscrições
          
        </NavLink>

        <NavLink to="/preparacoes">
          🏋️ Preparações
        </NavLink>

        <NavLink to="/partidas">
          🏟️ Partidas
        </NavLink>

        <NavLink to="/classificacao">
          🥇 Classificação
        </NavLink>
        
      </nav>
    </aside>
  );
}

export default Sidebar;