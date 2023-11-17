export interface Upkeep {
    Area: string
    Capacidad: string
    Fecha: string
    Frecuencia: string
    Marcas: string
    Nombres: string
    TagGrua: string
    Tipo: string
    idMantenimiento: string
    idtuser: number
    numreporte: string
};

export interface Task {
    Fecha: string
    Id: number
    IdMant: number
    Titulodescripcion: string
    cabeceracolor: string
    orden: number
    parametros: string
    tecnico: number
};

export interface TaskDetail {
    Completo: number
    Condicion: string
    IdMantenimiento: number
    IdTitulo: number
    Item: string
    Prioridad: number
    Status: number
    id_item: number
    num_ord: number
    estado?: 'pending' | 'processed'
};