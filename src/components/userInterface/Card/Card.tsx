import * as React from 'react';
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
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}
interface RecipeReviewCardProps {
  item: {
    id: number;
    denominacion: string;
    descripcion: string;
    precioVenta: number;
    imagenes: { url: string }[];
    // Asegúrate de añadir cualquier otra propiedad necesaria del item
  };
  productQuantities: { [key: number]: number };
  handleAddOrRemoveProduct: (item: any) => void; // Ajusta el tipo de `item` según tu tipo de dato
  handleIncrementQuantity: (id: number) => void;
  handleDecrementQuantity: (id: number) => void;
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

const RecipeReviewCard: React.FC<RecipeReviewCardProps> = ({
  item,
  productQuantities,
  handleAddOrRemoveProduct,

}) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {item.denominacion.charAt(0)}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <ShareIcon />
          </IconButton>
        }
        title={item.denominacion}
        subheader={`$ ${item.precioVenta}`}
      />
      <CardMedia
        component="img"
        height="194"
        image={item.imagenes[0]?.url || '/static/images/cards/default.jpg'}
        alt={item.denominacion}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {item.descripcion}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={() => handleAddOrRemoveProduct(item)}>
          <FavoriteIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {productQuantities[item.id] || 0}
        </Typography>
        <IconButton aria-label="share">
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            This is a placeholder text for the detailed method description.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default RecipeReviewCard;