
import { Base } from "./Base";
import Provincia from "./Provincia"

interface ILocalidad extends Base<ILocalidad> {
  nombre:string;
  provincia: Provincia;
  
}

export default ILocalidad;