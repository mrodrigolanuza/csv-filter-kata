/*
- Un fichero con una sola factura donde todo es correcto, debería producir como salida la misma línea
- Un fichero con una sola factura donde IVA e IGIC están rellenos, debería eliminar la línea
- Un fichero con una sola factura donde el neto está mal calculado, debería ser eliminada
- Un fichero con una sola factura donde CIF y NIF están rellenos, debería eliminar la línea
- Si el número de factura se repite en varias líneas, se eliminan todas ellas (sin dejar ninguna línea).
- Una lista vacía producirá una lista vacía de salida
- Un fichero de una sola línea es incorrecto porque no tiene cabecera
*/

import { CSVFilter } from "../core/csvFilter";

describe("The CSV filter..", ()=>{
    it("creates a csv file with the same content as input file when all requirements are met", ()=>{
        
        const headerLine = 'Num _factura, Fecha, Bruto, Neto, IVA, IGIC, Concepto, CIF_cliente, NIF_cliente';
        const invoiceLine = '1,02/05/2019,1008,810,19,,ACERLaptop,B76430134,';
        const filter = new CSVFilter([headerLine, invoiceLine]);

        const result = filter.filteredLines;

        expect(result).toEqual([headerLine, invoiceLine]);

    });
});