import type { Brand } from "./Brands"
import type { Client } from "./Clients"
import type { WorkOrder } from "./WorkOrder"

export interface Motorcycle {
    id:string,
    model?:string,
    plate?:string,
    year:Date,
    owner?:Client,
    work_orders?:WorkOrder[],
    brand?:Brand,
    id_workshop?:string,
    id_brand?:string,
    id_owner?:string
}