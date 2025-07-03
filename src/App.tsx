import { useEffect, useState } from "react";
import "./App.css";
export default function App() {
  type Charactertype={
    id:string;image:string;name:string;species:string;status:string;
  } 
  const [characters, setCharacters] = useState<Charactertype[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/character")
      .then((res) => res.json())
      .then((data) => {
        setCharacters(data.results);      
        setLoading(false);
        console.log("hello");
      })
      .catch((err) => {
        console.error("Error al cargar personajes:", err);
        setLoading(true);
      });
  }, []);
  return (
    !loading && (
    <div className="container">
      <h1>Rick and Morty Viewer</h1>
      
        <div className="grid">
          {characters.map((char) => (
            <div key={char.id} className="card">
              <img src={char.image} alt={char.name} />
              <h3>{char.name}</h3>
              <p>{char.species} - {char.status}</p>
            </div>
          ))}
        </div>
    </div>)
  );
}