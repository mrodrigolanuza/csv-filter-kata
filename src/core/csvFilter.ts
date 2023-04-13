export class CSVFilter{
    
    constructor(private lines:string[]){

    }

    get filteredLines(){
        return this.lines;
    }
}