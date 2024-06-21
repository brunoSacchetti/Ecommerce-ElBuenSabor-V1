
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DiscountIcon from '@mui/icons-material/Discount';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IPromocion from '../../../types/Promocion';
import { useEffect, useState } from 'react';
import { PromocionService } from '../../../services/PromocionService';

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
    const [expanded, setExpanded] = useState(false);
  
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

  console.log(promociones);
  
  


  return (
    <>
    {promociones.map((item:any, index:any) => (
    <Card sx={{ maxWidth: 345 }} key={index}>
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
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <DiscountIcon /> <Typography variant="body2" color="text.secondary"> $ {item.precioPromocional}
        </Typography>
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
            {item.detalles.map((detalle : any, index : any) => (
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
    </>
  );

}

export default Promociones;