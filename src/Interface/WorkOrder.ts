import type { Photo } from "./Photo";
import type { ServiceByWork } from "./ServiceByWork";

export interface WorkOrder {
    id:string,
    date?:string,
    title?:string,
    description?:string,
    recommendations?:string,
    price?:number,
    id_motorcycle?:string,
    id_mechanic?:string,
    service_by_workshops?:ServiceByWork[],
    photos?:Photo[]
}