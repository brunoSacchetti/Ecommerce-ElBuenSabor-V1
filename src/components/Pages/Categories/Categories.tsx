import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoriaService } from '../../../services/CategoriaService';
import { ICategoria } from '../../../types/Categoria';
const API_URL = import.meta.env.VITE_API_URL;
import "./Categories.css";

export const Categories = () => {
  const categoriaService = new CategoriaService(API_URL + "/categoria");
  const [categorias, setCategorias] = useState<ICategoria[]>();
  const navigate = useNavigate();

  const getCategorias = async () => {
    try {
      const data = await categoriaService.getAll();
      const filteredCategorias = data.filter((cat: ICategoria) => !cat.esInsumo);
      setCategorias(filteredCategorias);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  useEffect(() => {
    getCategorias();
  }, []);

  const handleCategoriaClick = (categoria: ICategoria) => {
    navigate("/articulos", { state: { categoria } });
  };

  const getImagePath = (denominacion: string) => {
    return `./${denominacion.toLowerCase()}.jpg`; // Asumiendo que los nombres de las imágenes coinciden exactamente con las denominaciones en minúsculas
  };
  

  return (
    <div className="explore-menu" id='explore-menu'>
      <div className="centrados">
        <h1>Explora Nuestro Menú</h1>
        <p className='explore-menu-text'>
          Descubre nuestras mejores categorías y disfruta de una experiencia culinaria única. Ofrecemos una variedad de platos deliciosos preparados con ingredientes frescos y de alta calidad. Desde opciones tradicionales hasta innovadoras creaciones, tenemos algo para todos los gustos. ¡Déjate sorprender y disfruta de nuestros exquisitos productos!
        </p>
      </div>
      <div className="explore-menu-list">
      {categorias?.map((item, index) => (
          <div key={index} className="explore-menu-list-item" onClick={() => handleCategoriaClick(item)}>
            <img src={getImagePath(item.denominacion)} alt='' />
            <p>{item.denominacion}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

