import { useEffect, useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CategoriaService } from '../../../services/CategoriaService';
import { ICategoria } from '../../../types/Categoria';
import "./Categories.css";

const API_URL = import.meta.env.VITE_API_URL;
const PIXABAY_API_KEY = '44580530-05aeba8ec27327140aa204abd';


export const Categories = forwardRef<HTMLDivElement>((_, ref) => {
  const categoriaService = new CategoriaService(API_URL + "/categoria");
  const [categorias, setCategorias] = useState<ICategoria[]>();
  const [imagePaths, setImagePaths] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    getCategorias();
  }, []);

  const getCategorias = async () => {
    try {
      const data = await categoriaService.getAll();
      const filteredCategorias = data.filter((cat: ICategoria) => !cat.esInsumo);
      setCategorias(filteredCategorias);
      preloadImages(filteredCategorias);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const preloadImages = async (categorias: ICategoria[]) => {
    const paths: { [key: string]: string } = {};
    for (const categoria of categorias) {
      try {
        const path = await getPixabayImage(categoria.denominacion);
        paths[categoria.denominacion] = path;
      } catch (error) {
        console.error(`Error al obtener la imagen para ${categoria.denominacion}:`, error);
        // Aquí podrías manejar el error de carga de imagen si lo deseas
        paths[categoria.denominacion] = ''; // Otra opción en caso de error
      }
    }
    setImagePaths(paths);
  };

  const getPixabayImage = async (denominacion: string): Promise<string> => {
    try {
      const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(denominacion)}&image_type=photo`;

      const response = await axios.get<any>(url); // Usamos `any` para flexibilidad en la respuesta

      if (response.data && response.data.hits && response.data.hits.length > 0) {
        return response.data.hits[0].webformatURL;
      } else {
        console.warn(`No se encontraron imágenes para la categoría: ${denominacion}`);
        return ''; // Devuelve una cadena vacía si no hay imagen encontrada
      }
    } catch (error) {
      console.error('Error al obtener imagen de Pixabay:', error);
      return ''; // Devuelve una cadena vacía en caso de error
    }
  };

  const handleCategoriaClick = (categoria: ICategoria) => {
    navigate("/articulos", { state: { categoria } });
  };

  return (
    <div className="explore-menu" id="explore-menu" ref={ref}>
      <div className="centrados">
        <h1>Explora Nuestro Menú</h1>
        <p className='explore-menu-text'>
          Descubre nuestras mejores categorías y disfruta de una experiencia culinaria única. Ofrecemos una variedad de platos deliciosos preparados con ingredientes frescos y de alta calidad. Desde opciones tradicionales hasta innovadoras creaciones, tenemos algo para todos los gustos. ¡Déjate sorprender y disfruta de nuestros exquisitos productos!
        </p>
      </div>
      <div className="explore-menu-list">
        {categorias?.map((item, index) => (
          <div key={index} className="explore-menu-list-item" onClick={() => handleCategoriaClick(item)}>
            <img src={imagePaths[item.denominacion]} alt={item.denominacion} />
            <p>{item.denominacion}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
});
