export interface WorkOrder {
    id:string,
    date?:Date,
    title?:string,
    description?:string,
    recommendations?:string,
    price?:number,
    id_motorcycle?:string,
    id_mechanic?:string,
}