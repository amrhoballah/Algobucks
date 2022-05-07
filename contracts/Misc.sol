pragma solidity >= 0.8.11;

contract Misc{
    enum PatientContactRelationship {GUARDIAN, PARTNER, FRIEND, FAMILY, CAREGIVER}

    // struct Contact{
    //     PatientContactRelationship relationship;
    //     HumanName name;
    //     ContactPoint telecom;
    //     PhysicalAddress homeAddress;
    //     Gender gender;
    // }

    // function getPatientCountPerDoc() public onlyPractitioner view returns(uint){
    //     uint count = 0;
    //     for(uint i=0;i<PatientList.length;i++){
    //         Patient storage patientData = Patients[PatientList[i]];
    //         if(patientData.generalPractitioner == msg.sender){
    //             count++;
    //         }
    //     }
    //     return(count);
    // }

     // function getCountPerOrg() external onlyOrganisationAdmin view returns(string memory){
    //     uint count = 0;
    //     uint count1 = 0;
    //     for(uint i=0;i<PractitionerList.length;i++){
    //         Practitioner storage practitionerData = Practitioners[PractitionerList[i]];
    //         if(practitionerData.memberOrgaisation == msg.sender){
    //             count++;
    //         }
    //     }
    //     for(uint i=0;i<PatientList.length;i++){
    //         Patient storage patientData = Patients[PatientList[i]];
    //         if(patientData.managingOrganisation == msg.sender){
    //             count1++;
    //         }
    //     }
    //     return string(abi.encodePacked(count, ":", count1));
    // }
    

    // function getPatientCountPerOrg() external onlyOrganisationAdmin view returns(uint){
    //     uint count = 0;
    //     for(uint i=0;i<PatientList.length;i++){
    //         Patient storage patientData = Patients[PatientList[i]];
    //         if(patientData.managingOrganisation == msg.sender){
    //             count++;
    //         }
    //     }
    //     return(count);
    // }
}
