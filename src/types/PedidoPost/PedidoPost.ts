
import { DetallePedidoPost } from "./DetallePedidoPost";

export interface PedidoPost {
    id: number;
    total: number,
    tipoEnvio: string,
    formaPago: string,
    clienteID?: number,
    domicilioID?: number | null,
    detallePedidos: DetallePedidoPost[]
}