import { Base } from "./Base";
import IDomicilio from "./Domicilio";


export interface ICliente extends Base<ICliente> {
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    userName: string;
    fechaNacimiento: string;
    imagenCliente: {
        name:string;
        url:string;
    };
    domicilios: IDomicilio[];
    /* pedido: IPedido[]; */
}


