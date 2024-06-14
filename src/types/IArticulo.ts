import { Base } from "./Base";
import IImagen from "./IImagen";
import IUnidadMedida from "./UnidadMedida";

export default interface IArticulo extends Base<IArticulo>{
  denominacion: string;
  precioVenta: number;
  unidadMedida: IUnidadMedida;
  idCategoria: number;
  categoriaNombre: string;
  imagenes: IImagen[];
}