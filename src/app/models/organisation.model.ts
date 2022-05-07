import { PhysicalAddress } from "src/app/models/physicalAddress.model";

export class Organisation{
    constructor(
        public id: string,
        public name: string,
        public dateJoined: Number,
        public organisationAddress: PhysicalAddress
    ){}
}
