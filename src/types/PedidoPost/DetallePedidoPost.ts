import { Base } from "../../Base";

export interface DetallePedidoPost extends Base<DetallePedidoPost> {
    cantidad: number;
    subTotal: number;
    idArticulo: number;
}