import  { useEffect, useState } from 'react';

import { ICategoria } from '../../../types/Categoria';
import IArticulo from '../../../types/IArticulo';
import { useLocation } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;
import "./Articulos.css";
import { ImagenService } from '../../../services/ImagenService';
import { useAppSelector } from '../../../hooks/redux';
import { addProductToCart, removeProductFromCart, updateProductQuantity } from '../../../redux/slices/cartSlice';
import { useDispatch } from 'react-redux';


import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';

import Typography from '@mui/joy/Typography';

import PriceFilter from '../../ui/PriceFilter/PriceFilter';


export const Articulos = () => {


  const [filteredItems, setFilteredItems] = useState<IArticulo[]>([]);

  const [filterOption, setFilterOption] = useState<string>('default'); 

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


  //Filtrar 
  const fetchAndFilterData = async () => {
    const insumos = filterInsumos(categoria);
    const manufacturados = filterArticulosManufacturados(categoria);
    let items = [...insumos, ...manufacturados];
    
    const itemsWithImages = await Promise.all(
      items.map(async (item) => {
        const images = await fetchImages(item);
        return { ...item, imagenes: images };
      })
    );

    // Ordenar los artículos según la opción de filtrado seleccionada
    if (filterOption === 'priceAsc') {
      itemsWithImages.sort((a, b) => a.precioVenta - b.precioVenta);
    } else if (filterOption === 'priceDesc') {
      itemsWithImages.sort((a, b) => b.precioVenta - a.precioVenta);
    }

    setFilteredItems(itemsWithImages);
  };

  useEffect(() => {
    fetchAndFilterData();
  }, [categoria, filterOption]);

  

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

  return (
    <>
    <h2 style={{display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "50px", color: "#f17d60"}}>{categoria.denominacion}</h2>
    <PriceFilter filterOption={filterOption} setFilterOption={setFilterOption} />
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
      {filteredItems.map((item, index) => (
        <Card key={index} sx={{ width: 320, marginBottom: '20px' }}>
          <AspectRatio minHeight="120px" maxHeight="200px" style={{ overflow: 'hidden' }}>
            <div
              style={{
                backgroundImage: `url(${item.imagenes[0]?.url || './POLLOLOGO.png'})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                width: '100%',
                height: '100%',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </AspectRatio>
          <Typography level="title-lg">{item.denominacion}</Typography>
          <Typography level="body-xs" sx={{ mt: 1 }}>{item.descripcion}</Typography>
          <div style={{display: "block", justifyContent: "center"}}>
            <Typography level="body-sm" >Precio:</Typography>
            <Typography fontSize="lg" fontWeight="lg">
              $ {item.precioVenta}
            </Typography>
          </div>
          <CardContent orientation="horizontal">
            <div style={{ display: 'flex', alignItems: 'center', maxHeight: '50px' }}>
              <button className="custom-btn" onClick={() => handleDecrementQuantity(item.id)}>-</button>
              <span className="quantity">{productQuantities[item.id] || 0}</span>
              <button className="custom-btn" onClick={() => handleIncrementQuantity(item.id)}>+</button>
            </div>
            <button className="custom-btn" style={{ maxHeight: '50px' }} onClick={() => handleAddOrRemoveProduct(item)}>
              {productsList.find((pdt) => pdt.id === item.id) ? 'Quitar del carrito' : 'Añadir al carrito'}
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
    </>
  );
  
};
