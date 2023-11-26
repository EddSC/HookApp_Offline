import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { ref } from 'vue';

// variables
const db = ref<SQLiteDBConnection>();
const sqlite = new SQLiteConnection(CapacitorSQLite);

interface TableConfig {
    name: string;
    schema: string;
}

const tableConfigs = [
    {
        name: 'mantenimiento',
        schema: `
            CREATE TABLE IF NOT EXISTS mantenimiento (
                idMantenimiento TEXT PRIMARY KEY NOT NULL,
                numreporte TEXT NOT NULL,
                Nombres TEXT NOT NULL,
                Tipo TEXT NOT NULL,
                TagGrua TEXT NOT NULL,
                Capacidad TEXT NOT NULL,
                Area TEXT NOT NULL,
                Marcas TEXT NOT NULL,
                Fecha TEXT NOT NULL,
                Frecuencia TEXT NOT NULL,
                idtuser TEXT NOT NULL,
                serie TEXT NULL
            );
        `
    },
    {
        name: 'task',
        schema: `
            CREATE TABLE IF NOT EXISTS task (
                IdMant TEXT NOT NULL,
                Id TEXT NOT NULL,
                Titulodescripcion TEXT NOT NULL,
                Fecha TEXT NOT NULL,
                tecnico TEXT NOT NULL,
                orden TEXT NOT NULL,
                parametros TEXT NOT NULL,
                cabeceracolor TEXT NOT NULL
            );
        `
    },
    {
        name: 'taskdetail',
        schema: `
            CREATE TABLE IF NOT EXISTS taskdetail (
                IdMantenimiento TEXT NOT NULL,
                IdTitulo TEXT NOT NULL,
                id_item TEXT NOT NULL,
                Item TEXT NOT NULL,
                num_ord TEXT NOT NULL,
                Prioridad NULL,
                Status TEXT NOT NULL,
                Completo TEXT NOT NULL,
                Condicion TEXT NOT NULL
            );
        `
    }
    // Agregar configuraciones para otras tablas aquí...
] as TableConfig[];

export const initializeDatabase = async () => {
    const platform = Capacitor.getPlatform();
    try {
        if (platform === "web") {
            // Create the 'jeep-sqlite' Stencil component
            const jeepSqliteEl = document.createElement('jeep-sqlite');
            document.body.appendChild(jeepSqliteEl);
            await customElements.whenDefined('jeep-sqlite');
            console.log(`after customElements.whenDefined`)

            // Initialize the Web store
            await sqlite.initWebStore();
            console.log(`after initWebStore`)
        }
        await createDB();
        await createTableMantenimiento(tableConfigs);
    } catch (error) {
        console.log(`error: ${error}`);
    }
}

export const createDB = async () => {
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection("HookApp_Offline", false)).result;
    if (ret.result && isConn) {
        db.value = await sqlite.retrieveConnection("HookApp_Offline", false);
    } else {
        db.value = await sqlite.createConnection("HookApp_Offline", false, "no-encryption", 1, false);
    }
}

export const closeSQLiteConnection = async () => {
    await sqlite.closeConnection("HookApp_Offline", false);
}

export const createTableMantenimiento = async (tables:TableConfig[]) => {
    try {
        await db.value?.open();
        for (const table of tables) {
            await db.value?.execute(table.schema);
        }
    } catch (err) {
        console.error(`Error creating table: ${err}`);
        throw new Error(`Error creating table: ${err}`);
    } finally {
        await db.value?.close();
    }
}

export const insertData = async (tableName: string, data:any) => {
    try {
        await db.value?.open(); 
        for ( const item of data ) {
            const columns = Object.keys(item).join(', '); // Obtén los nombres de las columnas dinámicamente
            const values = Object.values(item).map((val) => '?').join(', '); // Crea placeholders para los valores
            const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
            await db.value?.query(query, Object.values(item));
        }
    } catch (error) {
        console.log(`error: ${error}`);
    } finally {
        await db.value?.close();
    }
}

export const updateData = async (tableName: string, updatedData: any, condition: string, values: any[]) => {
    try {
        await db.value?.open();
        const updateValues = Object.keys(updatedData)
            .map((key) => `${key} = ?`)
            .join(', ');
        const query = `UPDATE ${tableName} SET ${updateValues} WHERE ${condition}`;
        const params = [...Object.values(updatedData), ...values];
        await db.value?.query(query, params);
        console.log('Datos actualizados correctamente en la tabla', tableName);
    } catch (error) {
        console.error('Error al actualizar datos:', error);
    } finally {
        await db.value?.close();
    }
}

export const deleteData = async (tableName: string, condition: string, values:any[]) => {
    try {
        await db.value?.open();
        const query = `DELETE FROM ${tableName} WHERE ${condition};`
        const res = await db.value?.query(query, values);
        return res;
    } catch (error) {
        console.error('Error al eliminar datos:', error);
    } finally {
        await db.value?.close();
    }
}

export const getData = async (tableName:string) => {
    try {
        await db.value?.open();
        const res = `
    SELECT * FROM ${tableName};
    `
        const ret = await db.value?.query(res);
        return ret?.values ?? [] as any;
    } catch (error) {
        console.log(`error: ${error}`);
    } finally {
        await db.value?.close();
    }
}

export const getDataCondicion = async (tableName:string, condition: string, id:string) => {
    try {
        await db.value?.open();
        const res = `
    SELECT * FROM ${tableName}  WHERE ${condition};
    `
        const ret = await db.value?.query(res, [id]);
        return ret?.values ?? [] as any;
    } catch (error) {
        console.log(`error: ${error}`);
    } finally {
        await db.value?.close();
    }
}

export const getDataItems = async (tableName:string, condition: string, id:string, orden:string) => {
    try {
        await db.value?.open();
        const res = `
    SELECT * FROM ${tableName}  WHERE ${condition};
    `
        const ret = await db.value?.query(res, [id,orden]);
        return ret?.values ?? [] as any;
    } catch (error) {
        console.log(`error: ${error}`);
    } finally {
        await db.value?.close();
    }
}

export const getDataTareass = async () => {
    try {
        await db.value?.open();
        const res = `
    SELECT * FROM task;
    `
        const ret = await db.value?.query(res);
        return ret?.values ?? [] as any;
    } catch (error) {
        console.log(`error: ${error}`);
    } finally {
        await db.value?.close();
    }
}

