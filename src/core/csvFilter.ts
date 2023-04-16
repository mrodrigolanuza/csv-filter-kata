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
        const cifField = fields[7];
        const nifField = fields[8];
        const regexDecimal = /[0-9]+/;
        const taxFieldAreMutuallyExclusive = (ivaField.match(regexDecimal) && !igicField)|| (!ivaField && igicField.match(regexDecimal));
        const cifNifAreMutiallyExclusive = (!cifField || !nifField);
        const netAmountIsWellCalculated = 
            this.checkIfNetAmountIsCorrect(netAmout, grossAmount, ivaField) || 
            this.checkIfNetAmountIsCorrect(netAmout, grossAmount, igicField);
        
        if(taxFieldAreMutuallyExclusive && 
           cifNifAreMutiallyExclusive && 
           netAmountIsWellCalculated ){
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