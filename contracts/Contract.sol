// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.11;

contract MainContract{

    MainContract internal parentContract;

    mapping (address => bool) private authorisedContracts;

    function authoriseContract(address newC) public {
        require(has(centralAuthority, msg.sender),"Not Authorised");
        authorisedContracts[newC] = true;
    }

    struct Role {
        mapping (address => bool) bearer;
    }
    //Add a role to an account
    function add(Role storage role, address account) internal {
        require(!has(role, account), "Account has role");
        role.bearer[account] = true;
    }
    //Remove a role from an account
    function remove(Role storage role, address account) internal {
        require(has(role, account), "Account does not have role");
        role.bearer[account] = false;
    }
    //Check if an account has a role
    function has(Role storage role, address account) internal view returns (bool) {
        require(account != address(0), "Account is the zero address");
        return role.bearer[account];
    }

    Role private centralAuthority;
    Role private organisationAdmin;
    Role private practitioner;
    Role private patient;

    modifier onlyAuthorisedContracts {
        require(authorisedContracts[msg.sender],"Not Authorised");
        _;
    }
    modifier onlyCentralAuthority(){
        require(parentContract.onlyCentralAuthorityE(msg.sender), 'Not Organisation Admin');
        _;
    }
    modifier onlyOrganisationAdmin(){
        require(parentContract.onlyOrganisationAdminE(msg.sender), 'Not Organisation Admin');
        _;
    }
    modifier onlyPractitioner(){
        require(parentContract.onlyPractitionerE(msg.sender), 'Not Practitioner');
        _;
    }
    modifier onlyPatient(){
        require(parentContract.onlyPatientE(msg.sender), 'Not Patient');
        _;
    }

    function onlyCentralAuthorityE(address sender) external onlyAuthorisedContracts view returns (bool){
        if(has(centralAuthority,sender)){
            return true;
        }
        return false;
    }
    function onlyOrganisationAdminE(address sender) external onlyAuthorisedContracts view returns (bool){
        if(has(organisationAdmin,sender)){
            return true;
        }
        return false;
    }
    function onlyPractitionerE(address sender) external onlyAuthorisedContracts view returns (bool){
        if(has(practitioner,sender)){
            return true;
        }
        return false;
    }
    function onlyPatientE(address sender) external onlyAuthorisedContracts view returns (bool){
        if(has(patient,sender)){
            return true;
        }
        return false;
    }

    function addRole(uint role, address account) external onlyAuthorisedContracts {
        if(role == 0){
            add(centralAuthority, account);
        }
        else if(role == 1){
            add(organisationAdmin, account);
        }
        else if(role == 2){
            add(practitioner, account);
        }
        else if(role == 3){
            add(patient, account);
        }
    }
    /*
        General Information
    */
    struct HumanName{
        string givenNames;
        string surname;
    }

    struct ContactPoint{
        string phoneNumber;
        string email;
    }
    
    struct PhysicalAddress{
        string use;
        string street;
        string city;
        string state;
        string postalCode;
        string country;
    }

    struct Communication{
        string[] languages;
        string preferred;
    }

    enum Gender{ MALE, FEMALE, OTHER, UNKNOWN }

    address centralAuthorityID;

    constructor() {
        centralAuthorityID = msg.sender;
        add(centralAuthority,centralAuthorityID);
    }

    function getCentralAuthority() external view returns(address){
        return centralAuthorityID;
    }
  
    function isCentralAuthority() external view returns(bool){
        return has(centralAuthority,tx.origin);
    }

}

contract OrganisationContract is MainContract{

    constructor(address _C) {
        parentContract = MainContract(_C);
    }

    struct Organisation{
        address id;
        string name;
        uint dateJoined;
        PhysicalAddress organisationAddress;
    }
   
    mapping(address => Organisation) Organisations;
    address[] public OrganisationList;

    function addOrganisation(Organisation memory data) external onlyCentralAuthority{
        require(parentContract.onlyCentralAuthorityE(msg.sender), "Only for Admins");

        Organisation storage organisationData = Organisations[data.id];
        organisationData.id = data.id;
        organisationData.name = data.name;
        organisationData.dateJoined = data.dateJoined;
        organisationData.organisationAddress = data.organisationAddress;

        OrganisationList.push(data.id);
        parentContract.addRole(1,data.id);
    }

    function getOrganisation(address id) public view returns(Organisation memory){
        return Organisations[id];
    }

    function getAllOrganisation() external onlyCentralAuthority view returns(address[] memory){
        return OrganisationList;
    }

    function isOrganisation() external view returns(bool){
        return parentContract.onlyOrganisationAdminE(msg.sender);
    }
}

contract PractitionerContract is MainContract{

    constructor(address _C) {
        parentContract = MainContract(_C);
    }

    struct Practitioner{
        address id;
        HumanName name;
        ContactPoint telecom;
        PhysicalAddress homeAddress;
        Gender gender;
        uint birthDate;
        Communication communication;
        address memberOrgaisation;
    }

    mapping(address => Practitioner) Practitioners;
    address[] public PractitionerList;

    function addPractitioner(Practitioner memory data) external onlyOrganisationAdmin{
        Practitioner storage practitionerData = Practitioners[data.id];
        practitionerData.id = data.id;
        practitionerData.name = data.name;
        practitionerData.telecom = data.telecom;
        practitionerData.birthDate = data.birthDate;
        practitionerData.gender = data.gender;
        practitionerData.homeAddress = data.homeAddress;
        practitionerData.communication = data.communication;
        practitionerData.memberOrgaisation = data.memberOrgaisation;

        PractitionerList.push(data.id);
        parentContract.addRole(2,data.id);
    }

    function getDr(address _id) external view returns(Practitioner memory){
        if(parentContract.onlyPractitionerE(msg.sender) || parentContract.onlyOrganisationAdminE(msg.sender) || parentContract.onlyPatientE(msg.sender)){
            return Practitioners[_id];
        }
        else{
            revert("Not Authorised");
        }
    }

    function isPractitioner(address id) external view returns(int){
        if(parentContract.onlyPractitionerE(id)){
            return 1;
        }
        return 0;
    }

    function getPractitionerCount() external onlyCentralAuthority view returns(uint) {
        return(PractitionerList.length);
    }

    function getPractitionersPerOrg() external onlyOrganisationAdmin view returns(Practitioner[] memory){
        uint count = 0;
        Practitioner[] memory practitionerList = new Practitioner[](PractitionerList.length);
        for(uint i=0;i<PractitionerList.length;i++){
            Practitioner storage pracData = Practitioners[PractitionerList[i]];
            if(pracData.memberOrgaisation == msg.sender){
                practitionerList[count++] = pracData;
            }
        }
        return(practitionerList);
    }
}

contract PatientContract is MainContract{

    constructor(address _C) {
        parentContract = MainContract(_C);
    }

    struct Patient{
        address id;
        HumanName name;
        ContactPoint telecom;       
        Gender gender;
        uint birthDate;
        PhysicalAddress homeAddress; 
        bool deceasedBoolean;
        uint deceasedDateTime;
        bool multipleBirthBoolean;
        uint multipleBirthInteger;
        Communication communication;     
        address generalPractitioner;
        address managingOrganisation;
    }

    // Start of Medical Records
    struct MedicalRecord{
        address patientId;
        address practitionerId;
        address organisationId;
        uint timestamp;
        string diagnosis;
        string[] medicationName;
        uint[] dosage;
        string[] unit;
        uint[] noOfDays;
        string[] remarks;
        string[] clinicalTests;
    }
    // End of Medical Records

    // mapping(address => Organisation) Organisations;
    // mapping(address => Practitioner) Practitioners;
    mapping(address => Patient) Patients;
    mapping(address => MedicalRecord[]) Records;

    // address[] public OrganisationList;
    // address[] public PractitionerList;
    address[] public PatientList;

    function getPatientCount() external onlyCentralAuthority view returns(uint){
        return(PatientList.length);
    }

    function getPatientsPerDoc() external onlyPractitioner view returns(Patient[] memory){
        uint count = 0;
        Patient[] memory patientList = new Patient[](PatientList.length);
        for(uint i=0;i<PatientList.length;i++){
            Patient storage patientData = Patients[PatientList[i]];
            if(patientData.generalPractitioner == msg.sender){
                patientList[count++] = patientData;
            }
        }
        return(patientList);
    }

    function getPatientsPerOrg() external onlyOrganisationAdmin view returns(Patient[] memory){
        uint count = 0;
        Patient[] memory patientList = new Patient[](PatientList.length);
        for(uint i=0;i<PatientList.length;i++){
            Patient storage patientData = Patients[PatientList[i]];
            if(patientData.managingOrganisation == msg.sender){
                patientList[count++] = patientData;
            }
        }
        return(patientList);
    }

    /*
            Patient
    */
    function isPatient(address id) external view returns(int){
       if(parentContract.onlyPatientE(id)){
           return 1;
        }
        return 0;
    }

    function getPatInfo(address iD) external view returns(Patient memory){
        require((parentContract.onlyPatientE(msg.sender) && iD==msg.sender) || parentContract.onlyPractitionerE(msg.sender), "Not allowed");
        return (Patients[iD]);
    }

    function addPatient(Patient memory data ) external onlyOrganisationAdmin{
        require(parentContract.onlyOrganisationAdminE(msg.sender) && parentContract.onlyPractitionerE(data.generalPractitioner), 'Invalid Data');
        Patient storage patientData = Patients[data.id];
        patientData.id = data.id;
        patientData.name = data.name;
        patientData.telecom = data.telecom;
        patientData.birthDate = data.birthDate;
        patientData.communication = data.communication;
        patientData.gender = data.gender;
        patientData.homeAddress = data.homeAddress;
        patientData.deceasedBoolean = data.deceasedBoolean;
        patientData.deceasedDateTime = data.deceasedDateTime;
        patientData.multipleBirthBoolean = data.multipleBirthBoolean;
        patientData.multipleBirthInteger = data.multipleBirthInteger;
        patientData.generalPractitioner = data.generalPractitioner;
        patientData.managingOrganisation = msg.sender;

        PatientList.push(data.id);
        parentContract.addRole(3,data.id);
    }

    /*
        Medical Records
    */

    function addMedicalRecord(MedicalRecord memory data) external onlyPractitioner{
        MedicalRecord memory recordData;
        recordData.patientId = data.patientId;
        recordData.practitionerId = msg.sender;
        recordData.organisationId = data.organisationId;
        recordData.timestamp = data.timestamp;
        recordData.diagnosis = data.diagnosis;
        recordData.medicationName = data.medicationName;
        recordData.dosage = data.dosage;
        recordData.unit = data.unit;
        recordData.noOfDays = data.noOfDays;
        recordData.remarks = data.remarks;
        recordData.clinicalTests = data.clinicalTests;
        Records[data.patientId].push(recordData);
    }

    function viewMedicalRecord(address id) external onlyPractitioner view returns(MedicalRecord[] memory){
        return (Records[id]);
    }

    function viewMedicalRecord() external onlyPatient view returns(MedicalRecord[] memory){
        return (Records[msg.sender]);
    }
}