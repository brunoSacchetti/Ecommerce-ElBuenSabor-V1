
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
import "./Promociones.css"
const API_URL = import.meta.env.VITE_API_URL

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

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
   const [promociones, setPromociones] = useState<any[]>([]);
  
   //const promocionesService = new PromocionService(API_URL + "/promocion");

   const getPromociones = async () => {
    try {
      const response = await fetch(`${API_URL}/promocion`);
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const data = await response.json();
      setPromociones(data);
    } catch (error) {
      console.error("Error al obtener las promociones:", error);
    }
  };

  useEffect(() => {
    getPromociones()
  }, [])

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
    < div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-around'}}>
      
    {promociones.map((item:any, index:any) => (
      
    <Card sx={{ maxWidth: 345 }} key={index} style={{background: '#F3C99A'}} >
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
        image={item.imagenes[0].url}
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
      <Collapse in={expanded} timeout="auto" unmountOnExit style={{background: '#F5D4AF'}}>
            {item.detalles.map((detalle:any, index:any) => (
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
                    Descripcion {detalle.manufacturado.descripcion}
                  </Typography>
                )}
              </CardContent>
            ))}
          </Collapse>
    </Card>
    ))}
    </div>
  );

}

export default Promociones;