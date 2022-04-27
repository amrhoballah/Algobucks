export class HumanName{
    constructor (
        public givenNames: string,
        public surname: string
    ){}
}

export enum Gender{MALE, FEMALE, OTHER, UNKNOWN}