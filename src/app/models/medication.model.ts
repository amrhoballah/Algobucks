export class Medication{
    constructor(
        public medicationName: string,
        public dosage: number,
        public unit: string,
        public noOfDays: number,
        public remarks: string = '',
    ){}
}