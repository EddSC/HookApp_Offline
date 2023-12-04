export type MantenimientoTypes = {
    idMantenimiento?: string;
    numreporte?: string;
    Nombres?: string;
    Tipo?: string;
    TagGrua?: string;
    Capacidad?: string;
    Marcas?: string;
    Area?: string;
    Frecuencia?: string;
    Fecha?: string;
    serie?: string;
};

export type PrioridadCondicion = {
    VarItem: number
    VarPrio: number
    VarStatus: number
    Tecnico: number
    VarMant: number
    VarTitulo: number
}

export type NoAplica = {
    VarItem: number
    VarTitulo: number
    VarMant: number
}

export type Nota = {
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

export type Cotizacion = {
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

export type Audio = {
    nombre: string
    imagen: string
    motivo: number
    mantenimiento: number
    titulo: number
    tecnico: number
    idOffline: string
}


export type DatosGrua = {
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

export type Electrico = {
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

export type PruebasPreOperacionales = {
    var_ppreope: string
    var_status: number
    var_det: string
    var_mant: number
    tecnico: number
}

export type TrabajoRealizado = {
    NotaEscrita: string
    IdWorkDone: number
    idMant: number
    idUser: number
}

export type TomaParametros = {
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

export type Email = {
    asunto: string
    destinatario: string
    varMessage: string
}

export type CorrectivoDesc = {
    Descripcion: string
}

export type CorrectivoObs = {
    idMantenimiento: number | string
    estado: string
    recomendacion: string[]
}

export type NotaObs = {
    idItem: number
    idTitulo: number
    tecnico: number
    idMant: number
    nota: string
}

export type Image = {
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

export type TaskDetailsType = {
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
