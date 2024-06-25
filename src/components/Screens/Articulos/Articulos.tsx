import { useEffect, useState } from 'react';
import { ICategoria } from '../../../types/Categoria';
import IArticulo from '../../../types/IArticulo';
import { useLocation } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;
import "./Articulos.css";
import { ImagenService } from '../../../services/ImagenService';
import { useAppSelector } from '../../../hooks/redux';
import { addProductToCart, removeProductFromCart, updateProductQuantity } from '../../../redux/slices/cartSlice';
import { useDispatch } from 'react-redux';
import InfoIcon from '@mui/icons-material/Info';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import PriceFilter from '../../userInterface/PriceFilter/PriceFilter';
import { ModalArticulo } from '../../userInterface/Modal/ModalArticulo';
import { TextField } from '@mui/material';

export const Articulos = () => {
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [filterOption, setFilterOption] = useState<string>('default');
  const [modalState, setModalState] = useState<{ visible: boolean; item: IArticulo | null }>({ visible: false, item: null });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const location = useLocation();
  const { categoria } = location.state as { categoria: ICategoria };
  const imageServiceManufacturado = new ImagenService(`${API_URL}/ArticuloManufacturado`);
  const imageServiceInsumo = new ImagenService(`${API_URL}/ArticuloInsumo`);
  const dispatch = useDispatch();

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
    const allItems = [...insumos, ...manufacturados];

    const itemsWithImages = await Promise.all(
      allItems.map(async (item) => {
        const images = await fetchImages(item);
        return { ...item, imagenes: images };
      })
    );

    if (filterOption === 'priceAsc') {
      itemsWithImages.sort((a, b) => a.precioVenta - b.precioVenta);
    } else if (filterOption === 'priceDesc') {
      itemsWithImages.sort((a, b) => b.precioVenta - a.precioVenta);
    }

    setItems(itemsWithImages);
    setFilteredItems(itemsWithImages);
  };

  useEffect(() => {
    fetchAndFilterData();
  }, [filterOption]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.denominacion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [items, searchTerm]);

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

  const handleInfoClick = (item: IArticulo) => {
    setModalState({ visible: true, item });
  };

  return (
    <>
      <h2 style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "50px", color: "#f17d60" }}>{categoria.denominacion}</h2>
      <div style={{display:'flex', justifyContent: "space-around", alignItems: "center", marginBottom:'40px'}}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, width: "30%" }}>
          <TextField
            label="Buscar artículo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <PriceFilter filterOption={filterOption} setFilterOption={setFilterOption} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        {filteredItems.map((item, index) => (
          <Card key={index} sx={{ width: 320, marginBottom: '20px', background: '#f3c99a', border: '#fbbe7a 1px solid' }}>
            <AspectRatio minHeight="120px" maxHeight="200px" style={{ overflow: 'hidden' }}>
              <div
                style={{
                  backgroundImage: `url(${item.imagenes[0]?.url || './POLLOLOGO.png'})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  width: '100%',
                  height: '100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundColor:'#F3C99A'
                }}
              />
            </AspectRatio>
            <Typography level="title-lg">{item.denominacion}</Typography>
            <div style={{ display: "block", justifyContent: "center" }}>
              <Typography level="body-sm">Precio:</Typography>
              <Typography fontSize="lg" fontWeight="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                  $ {item.precioVenta} <button className="custom-btn" onClick={() => handleInfoClick(item)}><InfoIcon /></button>
                </div>
              </Typography>
            </div>
            <CardContent orientation="horizontal">
              <div style={{ display: 'flex', alignItems: 'center', maxHeight: '50px', zIndex:'0'}}>
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
      <ModalArticulo visible={modalState.visible} setVisible={(visible:any) => setModalState({ ...modalState, visible })} item={modalState.item} />
    </>
  );
};
