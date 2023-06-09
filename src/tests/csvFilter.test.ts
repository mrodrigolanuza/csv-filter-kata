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
        const invoiceLine = fileWithoneInvoiceLineHaving({});
        const csvFilter = CSVFilter.create([headerLine, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine, invoiceLine]);
    });
    it("includes invoice lines with correct IGIC applied", ()=>{
        const invoiceLine = fileWithoneInvoiceLineHaving({
            ivaTax: '',
            igicTax: '7',
            netAmount: '930'
        });
        const csvFilter = CSVFilter.create([headerLine, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine, invoiceLine]);
    });
    it("creates a multiple line csv file with the same content as input file when all requirements are met", ()=>{
        const invoiceLine = fileWithoneInvoiceLineHaving({invoiceId: '1'});
        const invoiceLine2 = fileWithoneInvoiceLineHaving({invoiceId:'2'});
        const csvFilter = CSVFilter.create([headerLine, invoiceLine, invoiceLine2]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine, invoiceLine, invoiceLine2]);
    });
    it("exclude invoice lines with IVA and IGIC taxes", ()=>{
        const invoiceLine = fileWithoneInvoiceLineHaving({
            ivaTax: '21',
            igicTax: '7'
        });
        const csvFilter = CSVFilter.create([headerLine, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine]);
    });
    it("exclude invoice lines with neither IVA nor IGIC taxes", ()=>{
        const invoiceLine = fileWithoneInvoiceLineHaving({
            ivaTax: '',
            igicTax: ''
        });
        const csvFilter = CSVFilter.create([headerLine, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine]);
    });
    it("exclude invoice lines with non numeric IVA or IGIC", ()=>{
        const invoiceLine = fileWithoneInvoiceLineHaving({
            ivaTax: 'no-numeric-iva'
        });
        const csvFilter = CSVFilter.create([headerLine, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine]);
    });
    it("exclude invoice lines with incorrect IVA calculation", ()=>{
        const invoiceLine = fileWithoneInvoiceLineHaving({
            ivaTax: '21',
            netAmount: '900'
        });
        const csvFilter = CSVFilter.create([headerLine, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine]);
    });
    it("exclude invoice lines with incorrect IGIC calculation", ()=>{
        const invoiceLine = fileWithoneInvoiceLineHaving({
            igicTax: '7',
            netAmount: '900'
        });
        const csvFilter = CSVFilter.create([headerLine, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine]);
    });
    it("exclude invoice lines with CIF an NIF both completed", ()=>{
        const invoiceLine = fileWithoneInvoiceLineHaving({ nif: 'B75457554' });
        const csvFilter = CSVFilter.create([headerLine, invoiceLine]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine]);
    });
    it("exclude repeated invoices", ()=>{
        const invoiceLine = fileWithoneInvoiceLineHaving({ invoiceId: '1' });
        const invoiceLine2 = fileWithoneInvoiceLineHaving({ invoiceId: '1' });
        const invoiceLine3 = fileWithoneInvoiceLineHaving({ invoiceId: '3' });
        const invoiceLine4 = fileWithoneInvoiceLineHaving({ invoiceId: '4' });
        const invoiceLine5 = fileWithoneInvoiceLineHaving({ invoiceId: '3' });
        const csvFilter = CSVFilter.create([headerLine, invoiceLine, invoiceLine2, invoiceLine3, invoiceLine4, invoiceLine5]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([headerLine, invoiceLine4]);
    });
    it("empty file creates another empty file", ()=>{
        const csvFilter = CSVFilter.create([]);

        const result = csvFilter.filteredLines;

        expect(result).toEqual([]);
    });
    it("not allows a file with a single line (no header)", ()=>{
        const invoiceLine = fileWithoneInvoiceLineHaving({});

        const result = () => CSVFilter.create([invoiceLine]);

        expect(result).toThrow();
    });

    interface FileWithoneInvoiceLineHavingParams {
        invoiceId?: string;
        ivaTax?: string;
        igicTax?: string;
        netAmount?: string;
        nif?: string;
    }

    function fileWithoneInvoiceLineHaving({
        invoiceId = '1',
        ivaTax = '21', 
        igicTax = emptyField, 
        netAmount = '790',
        nif = emptyField
    }: FileWithoneInvoiceLineHavingParams){
        const invoiceDate = '02/05/2019';
        const grossAmount = '1000';
        const concept = 'ACERLaptop';
        const cif = 'B76430134';
    
        return [invoiceId, invoiceDate, grossAmount, netAmount, ivaTax, igicTax, concept, cif, nif].join(',');
    }
});

