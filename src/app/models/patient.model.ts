import { Communication } from "./communication.model";
import { ContactPoint } from "./contactPoint.model";
import { Gender, HumanName } from "./humanName.model";
import { PhysicalAddress } from "./physicalAddress.model";

export class Patient{
    constructor(
        public id: string,
        public name: HumanName,
        public telecom: ContactPoint,
        public homeAddress: PhysicalAddress,
        public birthDate: number,
        public generalPractitioner: string,
        public managingOrganisation: string,
        public communication: Communication,
        public gender : Gender,
        public deceasedBoolean : boolean,
        public deceasedDateTime : number,
        public multipleBirthBoolean : boolean,
        public multipleBirthInteger : number
    ){}
}

// struct Patient{
//     address id;
//     HumanName name;
//     ContactPoint telecom;       
//     Gender gender;
//     uint birthDate;
//     PhysicalAddress homeAddress; 
//     bool deceasedBoolean;
//     uint deceasedDateTime;
//     bool multipleBirthBoolean;
//     uint multipleBirthInteger;
//     Communication communication;     
//     address generalPractitioner;
//     address managingOrganisation;
//     bool exists;
// }

// enum PatientContactRelationship {GUARDIAN, PARTNER, FRIEND, FAMILY, CAREGIVER}

// struct Contact{
//     PatientContactRelationship relationship;
//     HumanName name;
//     ContactPoint telecom;
//     PhysicalAddress homeAddress;
//     Gender gender;
// }