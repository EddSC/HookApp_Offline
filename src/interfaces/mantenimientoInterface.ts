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
    serie?: string
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

export interface Nota {
    idRecomen: number
    idComentarios: number
    item: number
    recomendacion: string
    comentario: string
    varNota: number
    varFoto: number
    varMant: number
    tecnico: number
    varTitulo: number
};

export interface Cotizacion {
    IdItems: number
    TipoCotizacion: number
    NotaEscrita: string
    Status: number
    Foto: number
    Audio: number
    idMant: number
    idUser: number
    titulo: number
    idOffline: string
}

export interface PrioridadCondicion {
    VarItem: number
    VarPrio: number
    VarStatus: number
    Tecnico: number
    VarMant: number
    VarTitulo: number
}

export interface Image {
    nombre: string
    imagen: string
    tipo: number
    mantenimiento: number
    tecnico: number
    motivo?: number
    titulo?: number
    nota?: number
    idOffline?: string
    IdWorkDone?: number | string
}
  
  export interface User {
    Status: number
    idtuser: number
    tcorreo: string
    tnombres: string
    tusertipo: number
  };
  
  
  export interface NoAplica {
    VarItem: number
    VarTitulo: number
    VarMant: number
  }
  
  export interface Nota {
    idRecomen: number
    idComentarios: number
    item: number
    recomendacion: string
    comentario: string
    varNota: number
    varFoto: number
    varMant: number
    tecnico: number
    varTitulo: number
  };
  
  export interface Cotizacion {
    IdItems: number
    TipoCotizacion: number
    NotaEscrita: string
    Status: number
    Foto: number
    Audio: number
    idMant: number
    idUser: number
    titulo: number
    idOffline: string
  }
  
  export interface Audio {
    nombre: string
    imagen: string
    motivo: number
    mantenimiento: number
    titulo: number
    tecnico: number
    idOffline: string
  }
  
  
  export interface DatosGrua {
    tecnico: number
    mant: number
    serie: string
    marca: string
    tag: string
    capLe: string
    area: string
    portal: boolean | number
    semiportal: boolean | number
    monoviga: boolean | number
    biviga: boolean | number
    carroi: boolean | number
    carroii: boolean | number
    monorielaux: boolean | number
    monorriel: boolean | number
    jib: boolean | number
    pedestal: boolean | number
    capi: string
    capii: string
    capiii: string
    capiv: string
    capv: string
    alti: number | string
    altii: number | string
    altiii: number | string
    altiv: number | string
    altv: number | string
    recorrido: string
    luzpuente: string
  }
  
  export interface Electrico {
    t1: number
    t2: number
    t3: number
    t4: number
    t5: number
    t6: number
    t7: number
    t8: number
    t9: number
  
    varcab: number
    armazon: number
    abierta: number
    aislada: number
  
    extremo: number
    centro: number
    carro: number
    encarro: number
    palaca: number
    joystick: number
    aireacond: number
  
    botonera: number
    pendiente: number
    ptefijo: number
    ptemensajero: number
  
    delcarro: number
    pulpito: number
    palanca: number
    joystick2: number
  
    silla: number
    infrarojo: number
    automatico: number
    radio: number
  
    poly: number
    resorte: number
    hyd: number
    goma: number
  
    polyCarro: number
    resorteCarro: number
    hydCarro: number
    gomaCarro: number
  
    no: number
    corta1: number
    corta2: number
    med2: number
    total: number
    pasamano: number
  
    bajo: number
    interp: number
    polvo: number
    gases: number
    hume: number
  
    areatrabajo: string
    tecnico: number
    mant: number
  }
  
  export interface PruebasPreOperacionales {
    var_ppreope: string
    var_status: number
    var_det: string
    var_mant: number
    tecnico: number
  }
  
  export interface TrabajoRealizado {
    NotaEscrita: string
    IdWorkDone: number
    idMant: number
    idUser: number
  }
  
  export interface TomaParametros {
    idParametro: string
    tipo?: number | string
    uv?: number | string 
    vw?: number | string 
    uw?: number | string 
    tipob?: number | string 
    uvb?: number | string 
    vwb?: number | string 
    uwb?: number | string 
    u: number | string
    v: number | string
    w: number | string
    bobina: number | string
    disco: number | string
    airgap?: number | string
    mantenimiento: number
    IdTitulo: number
    tecnico: number
  }
  
  export interface Email {
    asunto: string
    destinatario: string
    varMessage: string
  }
  
  export interface CorrectivoDesc {
    Descripcion: string
  }
  
  export interface CorrectivoObs {
    idMantenimiento: number | string
    estado: string
    recomendacion: string[]
  }
  
  export interface NotaObs {
    idItem: number
    idTitulo: number
    tecnico: number
    idMant: number
    nota: string
  }
  
  export interface TaskDetails {
    id: string
    idTaskDetail: string
    idMantenimiento: number | string
    idTitulo: number
    idOrden: number
    idItem: number
    item?: string
    tipo: string
    fechaHora: string
    status: 'pending' | 'processed'
    prioridadCondicion?: PrioridadCondicion
    noAplica?: NoAplica
    nota?: Nota
    cotizacion?: Cotizacion
    audio?: Audio
    image?: Image
    imageDone?: Image
    datosGrua?: DatosGrua
    electrico?: Electrico
    trabajoRealizado?: TrabajoRealizado
    pruebasPreOperacionales?: PruebasPreOperacionales
    tomaParametro?: TomaParametros
    messageEmail?: Email
    correctivoObs?: CorrectivoObs
    notaObs?: NotaObs
  }
  
  export interface Troubleshooting {
    Descripcion: string
    IdMantTrouble: number
    IdMantenimiento: number
    IdTipotrouble: number
    IdTrouble?: string
    TituloTrouble: string
    TroubleDescripcion: string
    TroubleSolucion: string
    tecnico: number
  }
  
  export interface TroubleshootingForm {
    var_tipo: number
    var_titulo: string
    var_desc: string
    var_solu: string
    var_mant: number
    tecnico: number
    idtrouble: string
  }
  