import { useEffect, useState } from "react";
//import { useEffect, useState } from "react";
import "./App.css"; // Asegúrate de que este archivo CSS exista y contenga estilos para .container, .grid, .card, etc.

// Define las interfaces para la estructura de datos esperada de tu API F1
interface Pilot {
  _id: string; // ID de MongoDB
  name: string; // Nombre del piloto
  equipo: string; // Equipo del piloto
  nacionalidad: string; // Nacionalidad del piloto
  promedioPosicionFinalGeneral: number; // Promedio de posición final general
  porcentajeAbandonoGeneral: number; // Porcentaje de abandono general
  // generalPerfomance: number; // Ya se usa en RankingEntry, no es necesario aquí
  // vehiculoId: string; // Ya se maneja la población, no es necesario aquí para visualización directa
}

interface Circuit {
  _id: string; // ID de MongoDB
  name: string; // Nombre del circuito
  ubication: string; // Ubicación del circuito
  temperature: number; // Temperatura del circuito
  tipoCircuito: string; // Tipo de circuito (urbano, tradicional, híbrido)
  cantidadCurvas: number; // Cantidad de curvas
  porcentajeAccidentesHistorico: number; // Porcentaje de accidentes histórico
  longitudRectaMasLargaKm: number; // Longitud de la recta más larga en Km
  cambioElevacionMetros: number; // Cambio de elevación en metros
  dificultadCircuito: number; // Dificultad calculada del circuito
}

interface RankingEntry {
  pilot: Pilot;
  finalPerformance: number;
}

interface CircuitRanking {
  circuit: Circuit;
  ranking: RankingEntry[];
}

export default function App() {
  // Cambiamos el nombre de 'characters' a 'allRankings' para que sea más descriptivo
  // y su tipo a 'CircuitRanking[]' para que coincida con la respuesta de la API.
  const [allRankings, setAllRankings] = useState<CircuitRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Añadimos estado para errores

  useEffect(() => {
    const fetchAllRankings = async () => {
      try {
        setLoading(true); // Inicia el estado de carga
        setError(null);   // Limpia errores anteriores

        const response = await fetch("http://localhost:3000/pilots/ranking/all");

        if (!response.ok) {
          // Si la respuesta no es 2xx, lanza un error
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener los rankings');
        }

        const data: CircuitRanking[] = await response.json();
        // ¡CORRECCIÓN CLAVE AQUÍ! La 'data' es directamente el array de rankings.
        setAllRankings(data);
        console.log("Datos de rankings recibidos:", data);

      } catch (err: any) {
        console.error("Error al cargar rankings:", err);
        setError(err.message || "Ocurrió un error desconocido al cargar los rankings.");
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchAllRankings();
  }, []);

  if (loading) {
    return <div className="loading-message">Cargando predicciones...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (allRankings.length === 0) {
    return <div className="no-data-message">No hay predicciones de ranking disponibles.</div>;
  }

  return (
    <div className="container">
      <h1>Predicción de Rendimiento de Pilotos F1</h1>

      {/* Mapeamos sobre cada objeto de circuito con su ranking */}
      {allRankings.map((circuitData) => (
        <div key={circuitData.circuit._id} className="circuit-card">
          {/* Información detallada del Circuito */}
          <h2 className="circuit-name">{circuitData.circuit.name}</h2>
          <p className="circuit-detail">Ubicación: <span className="font-medium">{circuitData.circuit.ubication}</span></p>
          <p className="circuit-detail">Temperatura: <span className="font-medium">{circuitData.circuit.temperature}°C</span></p>
          <p className="circuit-detail">Tipo: <span className="font-medium">{circuitData.circuit.tipoCircuito}</span></p>
          <p className="circuit-detail">Curvas: <span className="font-medium">{circuitData.circuit.cantidadCurvas}</span></p>
          <p className="circuit-detail">Recta más larga: <span className="font-medium">{circuitData.circuit.longitudRectaMasLargaKm} Km</span></p>
          <p className="circuit-detail">Cambio de Elevación: <span className="font-medium">{circuitData.circuit.cambioElevacionMetros} Metros</span></p>
          <p className="circuit-detail">Accidentes Históricos: <span className="font-medium">{circuitData.circuit.porcentajeAccidentesHistorico}%</span></p>
          <p className="circuit-detail">Dificultad Calculada: <span className="font-medium">{circuitData.circuit.dificultadCircuito.toFixed(2)}</span></p>

          <h3>Ranking de Pilotos:</h3>
          <div className="grid">
            {/* Mapeamos sobre el array de ranking dentro de cada circuito */}
            {circuitData.ranking.length > 0 ? (
              circuitData.ranking.map((entry, index) => (
                <div key={entry.pilot._id} className="card">
                  <h3>{index + 1}. {entry.pilot.name}</h3>
                  <p>Equipo: {entry.pilot.equipo}</p>
                  <p>Nacionalidad: {entry.pilot.nacionalidad}</p>
                  <p>Promedio Posición Final: {entry.pilot.promedioPosicionFinalGeneral}</p>
                  <p>Porcentaje Abandono: {entry.pilot.porcentajeAbandonoGeneral}%</p>
                  <p className="final-performance">Rendimiento Final: {entry.finalPerformance.toFixed(4)}</p>
                </div>
              ))
            ) : (
              <p>No hay pilotos en el ranking para este circuito.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}