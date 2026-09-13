import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="dashboard">

      <header className="dashboard-header">
        <h2>IF Esporte</h2>
        <p>
          Acompanhe eventos, competições e atividades esportivas do IF Baiano.
        </p>
      </header>

      <section className="dashboard-grid">

        <div className="destaque">
          <img
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211"
            alt="Evento esportivo"
          />

          <div className="destaque-conteudo">
            <h2>JAIF 2026</h2>
            <p>
              Jogos dos Institutos Federais com participação dos campi.
            </p>
          </div>
        </div>

        <div className="calendario">

          <div className="calendario-cabecalho">
            <button>‹</button>

            <h2>Setembro 2026</h2>

            <button>›</button>
          </div>

          <div className="dias-semana">
            <span>DOM</span>
            <span>SEG</span>
            <span>TER</span>
            <span>QUA</span>
            <span>QUI</span>
            <span>SEX</span>
            <span>SÁB</span>
          </div>

          <div className="grade-calendario">

            <div className="dia"></div>
            <div className="dia"></div>
            <div className="dia">
              <strong>1</strong>
            </div>

            <div className="dia">
              <strong>2</strong>
            </div>

            <div className="dia">
              <strong>3</strong>
            </div>

            <div className="dia">
              <strong>4</strong>
            </div>

            <div className="dia">
              <strong>5</strong>
            </div>

            <div className="dia">
              <strong>6</strong>
            </div>

            <div className="dia">
              <strong>7</strong>
            </div>

            <div className="dia">
              <strong>8</strong>
            </div>

            <div className="dia">
              <strong>9</strong>
            </div>

            <div className="dia">
              <strong>10</strong>
            </div>

            <div className="dia">
              <strong>11</strong>
            </div>

            <div className="dia">
              <strong>12</strong>
            </div>

            <div className="dia">
              <strong>13</strong>
            </div>

            <div className="dia">
              <strong>14</strong>
            </div>

            <div className="dia">
              <strong>15</strong>
            </div>

            <div className="dia">
              <strong>16</strong>
              <div className="evento-calendario">
                JAIF
              </div>
            </div>

            <div className="dia">
              <strong>17</strong>
            </div>

            <div className="dia">
              <strong>18</strong>
            </div>

            <div className="dia">
              <strong>19</strong>
            </div>

            <div className="dia">
              <strong>20</strong>
            </div>

            <div className="dia">
              <strong>21</strong>
            </div>

            <div className="dia">
              <strong>22</strong>
            </div>

            <div className="dia">
              <strong>23</strong>
            </div>

            <div className="dia">
              <strong>24</strong>
            </div>

            <div className="dia">
              <strong>25</strong>
            </div>

            <div className="dia">
              <strong>26</strong>
            </div>

            <div className="dia">
              <strong>27</strong>
            </div>

            <div className="dia">
              <strong>28</strong>
            </div>

            <div className="dia">
              <strong>29</strong>
            </div>

            <div className="dia">
              <strong>30</strong>
            </div>

          </div>

          <Link to="/calendario" className="btn btn-secondary">
            Ver calendário completo
          </Link>

        </div>

      </section>

      <section className="secao">

        <div className="secao-header">
          <h2>Próximos eventos</h2>

          <Link to="/eventos">
            Ver todos
          </Link>
        </div>

        <div className="cards">

          <div className="card">
            <img
              src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211"
              alt="Competição esportiva"
            />

            <div className="card-conteudo">
              <h3>JAIF 2026</h3>
              <p>Jogos dos Institutos Federais</p>
              <p>📅 Setembro de 2026</p>
            </div>
          </div>

          <div className="card">
            <img
              src="https://images.unsplash.com/photo-1517649763962-0c623066013b"
              alt="Futebol"
            />

            <div className="card-conteudo">
              <h3>Intercampi</h3>
              <p>Competição entre os campi</p>
              <p>📅 Outubro de 2026</p>
            </div>
          </div>

          <div className="card">
            <img
              src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c"
              alt="Atividade esportiva"
            />

            <div className="card-conteudo">
              <h3>Festival Esportivo</h3>
              <p>Atividades esportivas e recreativas</p>
              <p>📅 Novembro de 2026</p>
            </div>
          </div>

        </div>

      </section>

      <section className="secao">

        <div className="secao-header">
          <h2>Campi</h2>

          <Link to="/campi">
            Ver todos
          </Link>
        </div>

        <div className="cards-campi">

          <div className="card-campus">
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585"
              alt="Campus"
            />

            <div className="card-campus-conteudo">
              <h3>Campus Senhor do Bonfim</h3>
              <p>Senhor do Bonfim - BA</p>
            </div>
          </div>

          <div className="card-campus">
            <img
              src="https://images.unsplash.com/photo-1564981797816-1043664bf78d"
              alt="Campus"
            />

            <div className="card-campus-conteudo">
              <h3>Campus Guanambi</h3>
              <p>Guanambi - BA</p>
            </div>
          </div>

          <div className="card-campus">
            <img
              src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a"
              alt="Campus"
            />

            <div className="card-campus-conteudo">
              <h3>Campus Catu</h3>
              <p>Catu - BA</p>
            </div>
          </div>

          <div className="card-campus">
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f"
              alt="Campus"
            />

            <div className="card-campus-conteudo">
              <h3>Campus Serrinha</h3>
              <p>Serrinha - BA</p>
            </div>
          </div>

        </div>

      </section>

      <section className="secao">

        <div className="secao-header">
          <h2>Modalidades</h2>

          <Link to="/modalidades">
            Ver todas
          </Link>
        </div>

        <div className="cards-modalidades">

          <div className="card-modalidade">
            <div>⚽</div>
            <h3>Futebol</h3>
          </div>

          <div className="card-modalidade">
            <div>🏀</div>
            <h3>Basquete</h3>
          </div>

          <div className="card-modalidade">
            <div>🏐</div>
            <h3>Vôlei</h3>
          </div>

          <div className="card-modalidade">
            <div>🏓</div>
            <h3>Tênis de Mesa</h3>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;