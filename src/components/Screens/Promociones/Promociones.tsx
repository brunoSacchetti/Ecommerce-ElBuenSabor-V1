import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DiscountIcon from '@mui/icons-material/Discount';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks/redux';
import IArticulo from '../../../types/IArticulo';
import { addProductToCart, removeProductFromCart, updateProductQuantity } from '../../../redux/slices/cartSlice';
import { useDispatch } from 'react-redux';
import "./Promociones.css";
import { TextField } from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL;

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Promociones = () => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const { productsList, productQuantities } = useAppSelector((state) => state.cart);
  const [promociones, setPromociones] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPromociones, setFilteredPromociones] = useState<any[]>([]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const getPromociones = async () => {
    try {
      const response = await fetch(`${API_URL}/promocion`);
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const data = await response.json();
      setPromociones(data);
      setFilteredPromociones(data); // Set initial filtered list to all promotions
    } catch (error) {
      console.error("Error al obtener las promociones:", error);
    }
  };

  /* //TRAEMOS SOLO LAS PROMOCIONES HABILITADAS
  const getPromociones = async () => {
    try {
      const response = await fetch(`${API_URL}/promocion`);
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const data = await response.json();
      const habilitadas = data.filter((promocion : any) => promocion.habilitado); // Filtrar promociones habilitadas
      setPromociones(habilitadas);
      setFilteredPromociones(habilitadas); // Set initial filtered list to all enabled promotions
    } catch (error) {
      console.error("Error al obtener las promociones:", error);
    }
  }; */
  

  useEffect(() => {
    getPromociones();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPromociones(promociones);
    } else {
      const filtered = promociones.filter((promo) =>
        promo.denominacion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPromociones(filtered);
    }
  }, [promociones, searchTerm]);

  const handleAddOrRemoveProduct = (product: IArticulo | any) => {
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
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
  <TextField
    label="Buscar promocion"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ width: "50%" }}
  />
</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        {filteredPromociones.map((item: any, index: any) => (
          <Card sx={{ maxWidth: 345 }} key={index} style={{ background: '#F3C99A' }}>
            <CardHeader
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={item.denominacion}
            />
            <CardMedia
              component="img"
              height="194"
              image={item.imagenes[0]?.url || './default-image.png'}
              alt="img promo"
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Desde el {item.fechaDesde} a las {item.horaDesde}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hasta {item.fechaHasta} a las {item.horaHasta}
              </Typography>
            </CardContent>
            <IconButton aria-label="add to favorites">
              <DiscountIcon /> <Typography variant="body2" color="text.secondary"> $ {item.precioPromocional}
              </Typography>
            </IconButton>
            <CardActions disableSpacing>
              <div style={{ display: 'flex', alignItems: 'center', maxHeight: '50px' }}>
                <button className="custom-btn" onClick={() => handleDecrementQuantity(item.id)}>-</button>
                <span className="quantity">{productQuantities[item.id] || 0}</span>
                <button className="custom-btn" onClick={() => handleIncrementQuantity(item.id)}>+</button>
              </div>
              <button className="custom-btn" style={{ maxHeight: '50px' }} onClick={() => handleAddOrRemoveProduct(item)}>
                {productsList.find((pdt) => pdt.id === item.id) ? 'Quitar del carrito' : 'Añadir al carrito'}
              </button>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit style={{ background: '#F5D4AF' }}>
              {item.detalles.map((detalle: any, index: any) => (
                <CardContent key={index}>
                  <Typography paragraph>Detalle:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {detalle.insumo ? detalle.insumo.denominacion : detalle.manufacturado.denominacion}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cantidad: {detalle.cantidad}
                  </Typography>
                  {detalle.manufacturado && (
                    <Typography variant="body2" color="text.secondary">
                      Descripción: {detalle.manufacturado.descripcion}
                    </Typography>
                  )}
                </CardContent>
              ))}
            </Collapse>
          </Card>
        ))}
      </div>
    </>
  );
}

export default Promociones;
