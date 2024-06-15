import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { CategoriaService } from '../../../services/CategoriaService';
import { ICategoria } from '../../../types/Categoria';
import IArticulo from '../../../types/IArticulo';
import { useLocation } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;
import "./Articulos.css";
import { ImagenService } from '../../../services/ImagenService';
import { useAppSelector } from '../../../hooks/redux';
import { addProductToCart, removeProductFromCart, updateProductQuantity } from '../../../redux/slices/cartSlice';
import { useDispatch } from 'react-redux';

export const Articulos = () => {
  const categoriaService = new CategoriaService(API_URL + '/categoria');
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [filteredItems, setFilteredItems] = useState<IArticulo[]>([]);

  const location = useLocation();
  const { categoria } = location.state as { categoria: ICategoria };

  const imageServiceManufacturado = new ImagenService(
    `${API_URL}/ArticuloManufacturado`
  );

  const imageServiceInsumo = new ImagenService(`${API_URL}/ArticuloInsumo`);

  const dispatch = useDispatch();

  console.log(categoria);

  const filterInsumos = (categoria: ICategoria) => {
    const insumosNoElaborar = categoria.insumos
      .filter((insumo: any) => !insumo.esParaElaborar)
      .map((insumo: any) => ({
        id: insumo.id,
        denominacion: insumo.denominacion,
        descripcion: insumo.descripcion,
        precioVenta: insumo.precioVenta,
        tipo: 'insumo',
        imagenes: [],
      }));
    return insumosNoElaborar;
  };

  const filterArticulosManufacturados = (categoria: ICategoria) => {
    const articulosManufacturados = categoria.articulosManufacturados.map(
      (articulo: any) => ({
        id: articulo.id,
        denominacion: articulo.denominacion,
        descripcion: articulo.descripcion,
        precioVenta: articulo.precioVenta,
        tipo: 'manufacturado',
        imagenes: [],
      })
    );
    return articulosManufacturados;
  };

  const fetchImages = async (item: IArticulo) => {
    try {
      let data;
      if (item.tipo === 'insumo') {
        data = await imageServiceInsumo.getImagesByArticuloId(item.id);
      } else if (item.tipo === 'manufacturado') {
        data = await imageServiceManufacturado.getImagesByArticuloId(item.id);
      } else {
        console.error('Tipo de producto no válido:', item.tipo);
        return;
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAndFilterData = async () => {
    const insumos = filterInsumos(categoria);
    const manufacturados = filterArticulosManufacturados(categoria);
    const items = [...insumos, ...manufacturados];
    
    const itemsWithImages = await Promise.all(
      items.map(async (item) => {
        const images = await fetchImages(item);
        return { ...item, imagenes: images };
      })
    );

    setFilteredItems(itemsWithImages);
  };

  useEffect(() => {
    fetchAndFilterData();
  }, [categoria]);

  // Carrito
  const { productsList } = useAppSelector((state) => state.cart);
  const { productQuantities } = useAppSelector((state) => state.cart);

  const handleAddOrRemoveProduct = (product: IArticulo) => {
    if (productsList.find((pdt) => pdt.id === product.id)) {
      dispatch(removeProductFromCart(product.id));
    } else {
      dispatch(addProductToCart(product));
    }
  };

  const handleIncrementQuantity = (id: number) => {
    dispatch(updateProductQuantity({ id, quantity: (productQuantities[id] || 0) + 1 }));
  };

  const handleDecrementQuantity = (id: number) => {
    dispatch(updateProductQuantity({ id, quantity: Math.max((productQuantities[id] || 0) - 1, 0) }));
  };

  const handleRadioChange = (id: number) => {
    // Aquí puedes implementar lógica específica para el cambio de radio buttons si es necesario
    console.log(`Seleccionaste el artículo con ID: ${id}`);
  };

  return (
    <div className="articulos-container">
      <h1>{categoria.denominacion}</h1>
      <div className="articulos-list">
        {filteredItems.map((item, index) => (
          <Card key={index} className="card">
            <div className="card-img-container">
              <Card.Img variant="top" src={item.imagenes[0]?.url || './POLLOLOGO.png'} />
            </div>
            <Card.Body className="card-body">
              <Card.Title className="card-title" style={{ color: 'rgb(241, 125, 96)' }}>
                {item.denominacion}
              </Card.Title>
              <Card.Text className="card-text">
                {item.descripcion}
                <br />
                <h5>Precio: ${item.precioVenta}</h5>
              </Card.Text>
              <div className="quantity-control">
                <button className="custom-btn" onClick={() => handleDecrementQuantity(item.id)}>-</button>
                <span className="quantity">
                  {productQuantities[item.id] || 0}
                </span>
                <button className="custom-btn" onClick={() => handleIncrementQuantity(item.id)}>+</button>
              </div>
              <button className="custom-btn" onClick={() => handleAddOrRemoveProduct(item)}>
                {productsList.find((pdt) => pdt.id === item.id) ? 'Quitar del carrito' : 'Añadir al carrito'}
              </button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};
