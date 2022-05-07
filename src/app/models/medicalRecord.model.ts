export class MedicalRecord{
    constructor(
        public patientId: string,
        public practitionerId: string,
        public organisationId: string,
        public timestamp: number,
        public diagnosis: string,
        public medicationName: string[],
        public dosage: number[],
        public unit: string[],
        public noOfDays: number[],
        public remarks: string[],        
        public clinicalTests: string[],
    ){}
}