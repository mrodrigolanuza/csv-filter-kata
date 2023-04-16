export class CSVFilter{
    public constructor(private readonly lines:string[]){}

    //Método factoría
    static create(lines:string[]){
        return new CSVFilter(lines);
    }
    get filteredLines(){
        const header = this.lines[0];
        const invoices = this.lines.slice(1);
        const validatedInvoices = invoices.filter(this.validateInvoice);
        const duplicatedIds = this.takeRepeatedInvoicesIds(validatedInvoices);
        const validatedAndNonRepeatedInvoices = validatedInvoices.filter((invoice)=>!duplicatedIds.includes(invoice.split(',')[0]));
        return [header].concat(validatedAndNonRepeatedInvoices);
    }

    private validateInvoice = (invoice) => {
        const fields = invoice.split(',');
        const grossAmount = fields[2];
        const netAmout = fields[3]
        const ivaField = fields[4];
        const igicField = fields[5];
        const cifField = fields[7];
        const nifField = fields[8];
        const regexDecimal = /[0-9]+/;
        const taxFieldAreMutuallyExclusive = (ivaField.match(regexDecimal) && !igicField)|| (!ivaField && igicField.match(regexDecimal));
        const cifNifAreMutiallyExclusive = (!cifField || !nifField);
        const netAmountIsWellCalculated = 
            this.checkIfNetAmountIsCorrect(netAmout, grossAmount, ivaField) || 
            this.checkIfNetAmountIsCorrect(netAmout, grossAmount, igicField);
        
        return taxFieldAreMutuallyExclusive && cifNifAreMutiallyExclusive && netAmountIsWellCalculated;
    }

    private checkIfNetAmountIsCorrect(netAmountField:string, grossAmountField:string, taxField: string){
        const parsedNetAmount = parseFloat(netAmountField);
        const parsedGrossAmount = parseFloat(grossAmountField);
        const parsedTax = parseFloat(taxField);
        return parsedNetAmount === parsedGrossAmount - (parsedGrossAmount * parsedTax) / 100;
    }

    private takeRepeatedInvoicesIds(invoices:string[]){
        const invoicesIds = invoices.map(invoice =>  invoice.split(',')[0]);
        return invoicesIds.filter((id, index) => invoicesIds.indexOf(id) != index);
    }
}