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
        if((fields[4] && !fields[5])|| (!fields[4] && fields[5])){
            result.push(this.lines[1]);
        }

        return result;
    }
}