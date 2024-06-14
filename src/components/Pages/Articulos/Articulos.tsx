import React, { useEffect, useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import { CategoriaService } from '../../../services/CategoriaService';
import { ICategoria } from '../../../types/Categoria';
import IArticulo from '../../../types/IArticulo';
import { useLocation } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;
export const Articulos = () => {

  const categoriaService = new CategoriaService(API_URL + "/categoria");
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [filteredItems, setFilteredItems] = useState<IArticulo[]>([]);

  const location = useLocation();
  const { categoria } = location.state as { categoria: ICategoria };

  console.log(categoria);
  


  const filterInsumos = (categoria: ICategoria) => {
    const insumosNoElaborar = categoria.insumos
      .filter((insumo:any) => !insumo.esParaElaborar)
      .map((insumo:any) => ({
        id: insumo.id,
        denominacion: insumo.denominacion,
        descripcion: insumo.descripcion,
        precioVenta: insumo.precioVenta,
        tipo: "insumo",
      }));
    return insumosNoElaborar;
  };

  const filterArticulosManufacturados = (categoria: ICategoria) => {
    const articulosManufacturados = categoria.articulosManufacturados.map(
      (articulo:any) => ({
        id: articulo.id,
        denominacion: articulo.denominacion,
        descripcion: articulo.descripcion,
        precioVenta: articulo.precioVenta,
        tipo: "manufacturado",
      })
    );
    return articulosManufacturados;
  };

  const fetchAndFilterData = () => {
    const insumos = filterInsumos(categoria);
    const manufacturados = filterArticulosManufacturados(categoria);
    setFilteredItems([...insumos, ...manufacturados]);
  };

  useEffect(() => {
    fetchAndFilterData();
  }, [categoria]);

  return (
    <div className="articulos-container">
      <h1>Artículos en {categoria.denominacion}</h1>
      <div className="articulos-list">
        {filteredItems.map((item, index) => (
          <Card key={index} style={{ width: '18rem', marginBottom: '20px' }}>
            <Card.Img variant="top" src="./POLLOLOGO.png" />
            <Card.Body>
              <Card.Title>{item.denominacion}</Card.Title>
              <Card.Text>
                {item.descripcion}
                <br />
                Precio: {item.precioVenta}
              </Card.Text>
              <Button variant="primary">Comprar</Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};