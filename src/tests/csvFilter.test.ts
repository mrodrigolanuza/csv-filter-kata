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
    const headerLine = 'Num _factura, Fecha, Bruto, Neto, IVA, IGIC, Concepto, CIF_cliente, NIF_cliente';
    const emptyField = '';

    function fileWithoneInvoiceLineHaving(ivaTax:string = '21', igicTax:string = emptyField){
        const invoiceId = '1';
        const invoiceDate = '02/05/2019';
        const grossAmount = '1000';
        const netAmout = '790'
        const concept = 'ACERLaptop';
        const nif = 'B76430134';

        return [invoiceId, invoiceDate, grossAmount, netAmout, ivaTax, igicTax, concept, nif].join(',');
    }

    it("creates a csv file with the same content as input file when all requirements are met", ()=>{
        const invoiceLine = fileWithoneInvoiceLineHaving();
        const csvFilter = CSVFilter.create([headerLine, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine, invoiceLine]);
    });
    it("exclude invoice lines with IVA and IGIC taxes", ()=>{
        const invoiceLine = '1,02/05/2021,1000,790,21,7,ACER Laptop,B76430134,';
        const csvFilter = CSVFilter.create([headerLine, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine]);
    });
    it("exclude invoice lines with neither IVA nor IGIC taxes", ()=>{
        const invoiceLine = '1,02/05/2021,1000,790,,,ACER Laptop,B76430134,';
        const csvFilter = CSVFilter.create([headerLine, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine]);
    });
    it("exclude invoice lines with non numeric IVA or IGIC", ()=>{
        const invoiceLine = '1,02/05/2021,1000,790,iva,,ACER Laptop,B76430134,';
        const csvFilter = CSVFilter.create([headerLine, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine]);
    });
});