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

    it("creates a csv file with the same content as input file when all requirements are met", ()=>{
        const invoiceLine = fileWithoneInvoiceLineHaving();
        const csvFilter = CSVFilter.create([headerLine, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine, invoiceLine]);
    });
    it("exclude invoice lines with IVA and IGIC taxes", ()=>{
        const invoiceLine = fileWithoneInvoiceLineHaving('21','7');
        const csvFilter = CSVFilter.create([headerLine, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine]);
    });
    it("exclude invoice lines with neither IVA nor IGIC taxes", ()=>{
        const invoiceLine = fileWithoneInvoiceLineHaving('','');
        const csvFilter = CSVFilter.create([headerLine, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine]);
    });
    it("exclude invoice lines with non numeric IVA or IGIC", ()=>{
        const invoiceLine = fileWithoneInvoiceLineHaving('IVA','');
        const csvFilter = CSVFilter.create([headerLine, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine]);
    });
    it("exclude invoice lines with incorrect IVA calculation", ()=>{
        const invoiceLine = fileWithoneInvoiceLineHaving('21','', '900');
        const csvFilter = CSVFilter.create([headerLine, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine]);
    });

    function fileWithoneInvoiceLineHaving(ivaTax:string = '21', igicTax:string = emptyField, netAmount:string = '790'){
        const invoiceId = '1';
        const invoiceDate = '02/05/2019';
        const grossAmount = '1000';
        const concept = 'ACERLaptop';
        const nif = 'B76430134';
    
        return [invoiceId, invoiceDate, grossAmount, netAmount, ivaTax, igicTax, concept, nif].join(',');
    }
});

