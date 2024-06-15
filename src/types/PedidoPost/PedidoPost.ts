import { Base } from "../Base";
import { DetallePedidoPost } from "./DetallePedidoPost";

export interface PedidoPost extends Base<PedidoPost> {
    tipoEnvio: string,
    formaPago: string,
    clienteID?: number,
    domicilioID?: number
    detallePedidos: DetallePedidoPost[]
}