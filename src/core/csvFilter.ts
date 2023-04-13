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
        const taxFieldAreMutuallyExclusive = (ivaField && !igicField)|| (!ivaField && igicField);
        if(taxFieldAreMutuallyExclusive){
            result.push(this.lines[1]);
        }

        return result;
    }
}