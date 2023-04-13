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
        const ivaField = fields[4];
        const igicField = fields[5];
        const regexDecimal = /[0-9]+/;
        const taxFieldAreMutuallyExclusive = (ivaField.match(regexDecimal) && !igicField)|| (!ivaField && igicField.match(regexDecimal));
        
        
        if(taxFieldAreMutuallyExclusive && parseFloat(fields[3]) === parseFloat(fields[2]) - (parseFloat(fields[2]) * parseFloat(ivaField)) / 100){
            result.push(this.lines[1]);
        }

        return result;
    }
}