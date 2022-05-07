// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.11;

contract Contract{

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

     /*
        Modifiers
    */

    modifier onlyCentralAuthority(){
        require(has(centralAuthority,msg.sender), 'Not Central Authority');
        _;
    }
    modifier onlyOrganisationAdmin(){
        require(has(organisationAdmin,msg.sender), 'Not Organisation Admin');
        _;
    }
    modifier onlyPractitioner(){
        require(has(practitioner,msg.sender), 'Not Practitioner');
        _;
    }
    modifier onlyPatient(){
        require(has(patient,msg.sender), 'Not Patient');
        _;
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

    struct Organisation{
        address id;
        string name;
        uint dateJoined;
        PhysicalAddress organisationAddress;
    }
    /*
        Practitioner
    */
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
    /*
        Patient
    */
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

    mapping(address => Organisation) Organisations;
    mapping(address => Practitioner) Practitioners;
    mapping(address => Patient) Patients;
    mapping(address => MedicalRecord[]) Records;

    address[] public OrganisationList;
    address[] public PractitionerList;
    address[] public PatientList;

    address centralAuthorityID;

    constructor() {
        centralAuthorityID = msg.sender;
        add(centralAuthority,centralAuthorityID);
    }

    //get Admin

    function getCentralAuthority() external view returns(address){
        return centralAuthorityID;
    }
  
    function isCentralAuthority() external view returns(bool){
        return has(centralAuthority,tx.origin);
    }

    function addOrganisation(Organisation memory data) external onlyCentralAuthority{
        require(has(centralAuthority,msg.sender) == true, "Only for Admins");

        Organisation storage organisationData = Organisations[data.id];
        organisationData.id = data.id;
        organisationData.name = data.name;
        organisationData.dateJoined = data.dateJoined;
        organisationData.organisationAddress = data.organisationAddress;

        OrganisationList.push(data.id);
        add(organisationAdmin,data.id);
    }

    function getOrganisation(address id) public view returns(Organisation memory){
        return Organisations[id];
    }

    function getAllOrganisation() external onlyCentralAuthority view returns(address[] memory){
        return OrganisationList;
    }

    function isOrganisation() external view returns(bool){
        return has(organisationAdmin,msg.sender);
    }

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
        add(practitioner,data.id);
    }

    function getDr(address _id) external view returns(Practitioner memory){
        return (Practitioners[_id]);
    }

    function isPractitioner(address id) external view returns(int){
        if(has(practitioner,id)){
            return 1;
        }
        return 0;
    }

    function getPractitionerCount() external onlyCentralAuthority view returns(uint) {
        return(PractitionerList.length);
    }

    function getPatientCount() external onlyCentralAuthority view returns(uint){
        return(PatientList.length);
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
       if(has(patient,id)){
           return 1;
        }
        return 0;
    }

    function getPatInfo(address iD) external view returns(Patient memory){
        require(has(patient,msg.sender) || has(practitioner,msg.sender), "Not allowed");
        return (Patients[iD]);
    }

    function addPatient(Patient memory data ) external onlyOrganisationAdmin{
        require(has(organisationAdmin,msg.sender) && has(practitioner,data.generalPractitioner), 'Invalid Data');
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
        add(patient,data.id);
    }

    /*
        Medical Records
    */

    function addMedicalRecord(MedicalRecord memory data) external onlyPractitioner{
        MedicalRecord memory recordData;
        recordData.patientId = data.patientId;
        recordData.practitionerId = msg.sender;
        recordData.organisationId = Practitioners[msg.sender].memberOrgaisation;
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

