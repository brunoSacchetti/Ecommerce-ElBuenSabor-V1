import IArticuloInsumo from "../types/ArticuloInsumo";
import InsumoEditDto from "../types/Dtos/InsumosDto/InsumoEditDto";
import InsumoPost from "../types/Dtos/InsumosDto/InsumoPost";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de personas
export class ArticuloInsumoService extends BackendClient<IArticuloInsumo | InsumoPost> {


}