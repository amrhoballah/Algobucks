import { Communication } from "./communication.model";
import { ContactPoint } from "./contactPoint.model";
import { Gender, HumanName } from "./humanName.model";
import { PhysicalAddress } from "./physicalAddress.model";

export class Practitioner{
    constructor( 
        public id: string,
        public name: HumanName,
        public telecom: ContactPoint,
        public homeAddress: PhysicalAddress,
        public gender:Gender,
        public birthDate: number,
        public communication: Communication,
        public memberOrgaisation: string
        ){
    }
}