export class CSVFilter{
    public constructor(private readonly lines:string[]){}

    //Método factoría
    static create(lines:string[]){
        return new CSVFilter(lines);
    }

    get filteredLines(){
        const result = [];
        result.push(this.lines[0]);
        const fields = this.lines[1].split(',');
        const grossAmount = fields[2];
        const netAmout = fields[3]
        const ivaField = fields[4];
        const igicField = fields[5];
        const regexDecimal = /[0-9]+/;
        const taxFieldAreMutuallyExclusive = (ivaField.match(regexDecimal) && !igicField)|| (!ivaField && igicField.match(regexDecimal));
        
        
        if(taxFieldAreMutuallyExclusive && this.checkIfNetAmountIsCorrect(netAmout, grossAmount, ivaField)){
            result.push(this.lines[1]);
        }

        return result;
    }

    private checkIfNetAmountIsCorrect(netAmountField:string, grossAmountField:string, taxField: string){
        const parsedNetAmount = parseFloat(netAmountField);
        const parsedGrossAmount = parseFloat(grossAmountField);
        const parsedTax = parseFloat(taxField);
        return parsedNetAmount === parsedGrossAmount - (parsedGrossAmount * parsedTax) / 100;
    }
}