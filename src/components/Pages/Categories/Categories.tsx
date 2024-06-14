import React, { useEffect, useState } from 'react'
import { CategoriaService } from '../../../services/CategoriaService';
import { ICategoria } from '../../../types/Categoria';
const API_URL = import.meta.env.VITE_API_URL;
import "./Categories.css"

export const Categories = () => {

  const categoriaService = new CategoriaService(API_URL + "/categoria")
  const [categorias,setCategorias] = useState<ICategoria[]>();

  const getCategorias = async () => {
    try {
      const categoriaData = await categoriaService.getAll();
      setCategorias(categoriaData);
    } catch (error) {
      console.error("Error al obtener categorias:", error);
    }
  };

  useEffect(() => {
    getCategorias();
  }, []);


  console.log(categorias);
  
  return (
    <div className="explore-menu" id='explore-menu'>
      <h1>Explora Nuestro Menú</h1>
      <p className='explore-menu-text'>
        Descubre nuestras mejores categorías y disfruta de una experiencia culinaria única. Ofrecemos una variedad de platos deliciosos preparados con ingredientes frescos y de alta calidad. Desde opciones tradicionales hasta innovadoras creaciones, tenemos algo para todos los gustos. ¡Déjate sorprender y disfruta de nuestros exquisitos productos!
      </p>
      <div className="explore-menu-list">
        {categorias?.map((item, index) => (
          <div key={index} className="explore-menu-list-item">
            <img src="./POLLOLOGO.png" alt='' />
            <p>{item.denominacion}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
}
