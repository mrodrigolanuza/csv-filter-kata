export class CSVFilter{
    public constructor(private readonly lines:string[]){}

    //Método factoría
    static create(lines:string[]){
        if(lines.length === 1){
            throw new Error('Single line is not allowed');
        }

        return new CSVFilter(lines);
    }
    get filteredLines(){
        if(this.lines.length === 0){
            return [];
        }
           
        const header = this.lines[0];
        const invoices = this.lines.slice(1);
        const validatedInvoices = this.takeValidInvoices(invoices);
        const duplicatedIds = this.takeRepeatedInvoicesIds(validatedInvoices);
        const validatedAndNonRepeatedInvoices = validatedInvoices.filter((invoice)=>!duplicatedIds.includes(this.invoiceId(invoice)));
        return [header].concat(validatedAndNonRepeatedInvoices);
    }

    private isValidInvoice = (invoice) => {
        const fields = invoice.split(',');
        const grossAmount = fields[2];
        const netAmout = fields[3]
        const ivaField = fields[4];
        const igicField = fields[5];
        const cifField = fields[7];
        const nifField = fields[8];
        const regexDecimal = /[0-9]+/;
        const areTaxFieldMutuallyExclusive = (ivaField.match(regexDecimal) && !igicField)|| (!ivaField && igicField.match(regexDecimal));
        const areCifNifMutiallyExclusive = (!cifField || !nifField);
        const isNetAmountWellCalculated = 
            this.hasCorrectAmount(netAmout, grossAmount, ivaField) || 
            this.hasCorrectAmount(netAmout, grossAmount, igicField);
        
        return areTaxFieldMutuallyExclusive && areCifNifMutiallyExclusive && isNetAmountWellCalculated;
    }

    private hasCorrectAmount(netAmountField:string, grossAmountField:string, taxField: string){
        const parsedNetAmount = parseFloat(netAmountField);
        const parsedGrossAmount = parseFloat(grossAmountField);
        const parsedTax = parseFloat(taxField);
        return parsedNetAmount === parsedGrossAmount - (parsedGrossAmount * parsedTax) / 100;
    }

    private takeRepeatedInvoicesIds(invoices:string[]){
        const invoicesIds = invoices.map(invoice =>  this.invoiceId(invoice));
        return invoicesIds.filter((id, index) => invoicesIds.indexOf(id) != index);
    }

    private invoiceId(invoice:string){
        return invoice.split(',')[0];
    }

    private takeValidInvoices(invoices:string[]){
        return invoices.filter(this.isValidInvoice);
    }
}