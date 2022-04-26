// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.11;

contract Contract{

    struct Role {
        mapping (address => bool) bearer;
    }
    //Add a role to an account
    function add(Role storage role, address account) internal {
        require(!has(role, account), "Roles: account already has role");
        role.bearer[account] = true;
    }
    //Remove a role from an account
    function remove(Role storage role, address account) internal {
        require(has(role, account), "Roles: account does not have role");
        role.bearer[account] = false;
    }
    //Check if an account has a role
    function has(Role storage role, address account) internal view returns (bool) {
        require(account != address(0), "Roles: account is the zero address");
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
        require(has(centralAuthority,msg.sender) == true, 'Only Central Authority Can Do That');
        _;
    }
    modifier onlyOrganisationAdmin(){
        require(has(organisationAdmin,msg.sender) == true, 'Only Organisation Admin Can Do That');
        _;
    }
    modifier onlyPractitioner(){
        require(has(practitioner,msg.sender) == true, 'Only Practitioner Can Do That');
        _;
    }
    modifier onlyPatient(){
        require(has(patient,msg.sender) == true, 'Only Patient Can Do That');
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
        Communication Communication;
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
        bool exists;
    }

    enum PatientContactRelationship {GUARDIAN, PARTNER, FRIEND, FAMILY, CAREGIVER}

    struct Contact{
        PatientContactRelationship relationship;
        HumanName name;
        ContactPoint telecom;
        PhysicalAddress homeAddress;
        Gender gender;
    }

    // Start of Medical Records
    struct MedicalRecord{
        address patientId;
        string recordType;
        uint timestamp;
        string diagnosis;
        string treatment;
    }

    mapping(address => Organisation) Organisations;
    mapping(address => Practitioner) Practitioners;
    mapping(address => Patient) Patients;
    mapping(address => MedicalRecord[]) Records;

    address[] public OrganisationList;
    address[] public PractitionerList;
    address[] public PatientList;
    MedicalRecord[] public MedicalRecords;

    address accountId;
    address centralAuthorityID;
    address get_patient_id;
    address get_dr_id;

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

    function getAllOrganisation() external view returns(address[] memory){
        require(has(centralAuthority,msg.sender) == true, "Only for Central Authority");
        return OrganisationList;
    }
    /*

        Practitioner

    */
    //Add Practitioner
    function addPractitioner(Practitioner memory data) external onlyOrganisationAdmin{
        require(has(organisationAdmin,msg.sender) == true, "Only for Admins");
        Practitioner storage practitionerData = Practitioners[data.id];
        practitionerData.id = data.id;
        practitionerData.name = data.name;
        practitionerData.telecom = data.telecom;
        practitionerData.birthDate = data.birthDate;
        practitionerData.gender = data.gender;
        practitionerData.homeAddress = data.homeAddress;
        practitionerData.Communication = data.Communication;
        practitionerData.memberOrgaisation = data.memberOrgaisation;

        PractitionerList.push(data.id);
        add(practitioner,data.id);
    }

    // function updateInfo(address dr_id, string memory _drInfo_hash) public{
    //     Practitioner storage drInfo = Practitioners[msg.sender];
    //     drInfo.drHash = _drInfo_hash;
    //     PractitionerList.push(dr_id);
    // }

    // function addPractitioner(address _newdr) external onlyAdmin() {
    //     add(practitioner,_newdr);
    // }

    // function delDr(address _accid) external onlyAdmin(){
    //     remove(practitioner,_accid);
    // }

    function get_drtid() public view returns(address){
        return get_dr_id;
    }

    function search(address _id)public{
        get_dr_id = _id;
    }

    function getDrInfo() public view returns(Practitioner memory){
        return (Practitioners[get_dr_id]);
    }

    function getDr(address _id) public view returns(Practitioner memory){
        return (Practitioners[_id]);
    }

    function isDr(address id) public view returns(string memory){
        require(has(practitioner,id), "Only for Practitioners");
        return "1";
    }

    function isPractitioner(address id) public view returns(int){
        // require(practitioner.has(msg.sender), "Only for Practitioners");
        for(uint i=0;i<=PractitionerList.length;i++){
            if(PractitionerList[i] == id){
                return 1;
            }
        }
        return 0;
    }

    function getAllPractitioners() public view returns(address[] memory){
        return(PractitionerList);
    }

    function getPractitionerCount() public view returns(uint){
        return(PractitionerList.length);
    }

    function getOrganisationCount() public view returns(uint){
        return(OrganisationList.length);
    }

    // function getAllDrDetails() onlyAdmin() public view returns(string[] memory) {
    //     drIds =
    //     return ['']
    // }
    /*
            Patient

    */
    function isPat(address id) public view returns(string memory){
        require(has(patient,id), "Only for Practitioners");
        return "1";
    }
    // Check is patient
    function isPatient(address id) public view returns(int){
        for(uint i = 0 ;i<=PatientList.length;i++){
            if(id == PatientList[i]){return 1;}
        }
        return 0;
    }


    // function addPatient(address _newpatient) external onl() {
    //     add(patient,_newpatient);
    // }

    function addRec(address _patid) external onlyPractitioner{
        require(has(patient,_patid) == true, "is not a Patient");
        get_patient_id = _patid;
    }
    function viewPatRec(address _patid) public{
        get_patient_id = _patid;
    }

    // function delPat(address _accid) external onlyAdmin(){
    //     remove(patient,_accid);
    // }

    function get() public view  returns(address){
        return msg.sender;
    }

    function get_patid() public view returns(address){
        return get_patient_id;
    }

    function getPatInfo(address iD)public view returns(Patient memory){
        return (Patients[iD]);
    }

    function addPatient(Patient memory data ) external onlyOrganisationAdmin{
        require(has(organisationAdmin,msg.sender) == true, 'Only for Organisation Admins');
        require(Patients[data.id].exists == true, "Patient already exists");  
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
        patientData.managingOrganisation = data.managingOrganisation;
        patientData.exists = true;

        PatientList.push(data.id);
        add(patient,data.id);
    }

    /*
        Medical Records
    */

    function addMedicalRecord(MedicalRecord memory _record) external onlyPractitioner{
        //require(has(practitioner,msg.sender) == true, 'Only Practitioner Can Do That');
        _record.timestamp=block.timestamp;
        Records[_record.patientId].push(_record);
        // record.recordType = _record.recordType;
        // record.diagnosis = _record.diagnosis;
        // record.treatment = _record.treatment;
        // record.timestamp = block.timestamp;
        MedicalRecords.push(_record);
    }

    function viewMedicalRecord(address id)public view returns(MedicalRecord[] memory){
        return (Records[id]);
    }

   

}

