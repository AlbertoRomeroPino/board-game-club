import { useState } from "react";
import type { CreateBoardGame } from "../types/BoardGame";

interface GameFormProps {
  onSubmit: (juego: CreateBoardGame) => void;
  initialData?: Partial<CreateBoardGame>;
  isLoading?: boolean;
}

const CATEGORIAS_DISPONIBLES = [
  "Estrategia",
  "Familiar",
  "Party",
  "Cooperativo",
  "Cartas",
  "Dados",
  "Abstracto",
  "Temático",
  "Eurogame",
  "Ameritrash",
];

const GameForm = ({ onSubmit, initialData, isLoading = false }: GameFormProps) => {
  const [formData, setFormData] = useState<CreateBoardGame>({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    imageUrl: initialData?.imageUrl ?? "",
    minPlayers: initialData?.minPlayers ?? 2,
    maxPlayers: initialData?.maxPlayers ?? 4,
    playTime: initialData?.playTime ?? 30,
    category: initialData?.category ?? [],
    rating: initialData?.rating ?? 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (categoria: string) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.includes(categoria)
        ? prev.category.filter((c) => c !== categoria)
        : [...prev.category, categoria],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="juegos-form">
      <div className="form-row">
        <label htmlFor="title">Título</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Nombre del juego"
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe el juego..."
          rows={4}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="imageUrl">URL de la imagen</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen.jpg"
          required
        />
      </div>

      <div className="form-row-group">
        <div className="form-row">
          <label htmlFor="minPlayers">Mín. jugadores</label>
          <input
            type="number"
            id="minPlayers"
            name="minPlayers"
            value={formData.minPlayers}
            onChange={handleChange}
            min={1}
            max={20}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="maxPlayers">Máx. jugadores</label>
          <input
            type="number"
            id="maxPlayers"
            name="maxPlayers"
            value={formData.maxPlayers}
            onChange={handleChange}
            min={1}
            max={20}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="playTime">Tiempo (min)</label>
          <input
            type="number"
            id="playTime"
            name="playTime"
            value={formData.playTime}
            onChange={handleChange}
            min={5}
            max={600}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="rating">Valoración</label>
        <input
          type="number"
          id="rating"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          min={0}
          max={10}
          step={0.1}
          required
        />
      </div>

      <div className="form-row">
        <label>Categorías</label>
        <div className="category-grid">
          {CATEGORIAS_DISPONIBLES.map((categoria) => (
            <label key={categoria} className="category-checkbox">
              <input
                type="checkbox"
                checked={formData.category.includes(categoria)}
                onChange={() => handleCategoryChange(categoria)}
              />
              <span>{categoria}</span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Guardando..." : "Guardar juego"}
      </button>
    </form>
  );
};

export default GameForm;
