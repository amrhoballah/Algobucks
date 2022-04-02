// SPDX-License-Identifier: MIT
pragma solidity >= 0.4.21;

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

    Role private admin;
    Role private doctor;
    Role private patient;

     /*
        Modifiers
    */


    modifier onlyAdmin(){
        require(has(admin,msg.sender) == true, 'Only Admin Can Do That');
        _;
    }
    modifier onlyDoctor(){
        require(has(doctor,msg.sender) == true, 'Only Doctor Can Do That');
        _;
    }
    modifier onlyPatient(){
        require(has(patient,msg.sender) == true, 'Only Admin Can Do That');
        _;
    }

    struct Doctor{
        string firstName;
        string lastName;

    }

    struct Patient{
        string firstName;
        string lastName;
    }

    struct MedicalRecord{
        address patientId;
        string recordType;
        uint timestamp;
        string diagnosis;
        string treatment;
    }

    mapping(address => Doctor) Doctors;
    mapping(address => Patient) Patients;
    mapping(address => MedicalRecord[]) Records;

    address[] public Dr_ids;
    address[] public Patient_ids;
    MedicalRecord[] public MedicalRecords;

    address accountId;
    address admin_id;
    address get_patient_id;
    address get_dr_id;

    constructor() {
        admin_id = msg.sender;
        add(admin,admin_id);
    }

    //get Admin

    function getAdmin() public view returns(address){
        return admin_id;
    }

    /*

        Doctor

    */
    //Add Doctor

    function addDrInfo(address dr_id, string memory firstName, string memory lastName) public{
        require(has(admin,msg.sender), 'Only For Doctor');

        Doctor storage drInfo = Doctors[dr_id];
        drInfo.firstName = firstName;
        drInfo.lastName = lastName;
        Dr_ids.push(dr_id);

        add(doctor,dr_id);
    }

    // function updateInfo(address dr_id, string memory _drInfo_hash) public{
    //     Doctor storage drInfo = Doctors[msg.sender];
    //     drInfo.drHash = _drInfo_hash;
    //     Dr_ids.push(dr_id);
    // }

    function addDoctor(address _newdr) external onlyAdmin() {
        add(doctor,_newdr);
    }

    function delDr(address _accid) external onlyAdmin(){
        remove(doctor,_accid);
    }

    function get_drtid() public view returns(address){
        return get_dr_id;
    }

    function search(address _id)public{
        get_dr_id = _id;
    }

    function getDrInfo() public view returns(Doctor memory){
        return (Doctors[get_dr_id]);
    }

    function getDr(address _id) public view returns(Doctor memory){
        return (Doctors[_id]);
    }

    function isDr(address id) public view returns(string memory){
        require(has(doctor,id), "Only for Doctors");
        return "1";
    }

    function isDoctor(address id) public view returns(int){
        // require(doctor.has(msg.sender), "Only for Doctors");
        for(uint i=0;i<=Dr_ids.length;i++){
            if(Dr_ids[i] == id){
                return 1;
            }
        }
        return 0;
    }

    function getAllDrs() public view returns(address[] memory){
        return(Dr_ids);
    }

    function getDoctorCount() public view returns(uint){
        return(Dr_ids.length);
    }

    // function getAllDrDetails() onlyAdmin() public view returns(string[] memory) {
    //     drIds =
    //     return ['']
    // }
    /*
            Patient

    */
    function isPat(address id) public view returns(string memory){
        require(has(patient,id), "Only for Doctors");
        return "1";
    }
    // Check is patient
    function isPatient(address id) public view returns(int){
        for(uint i = 0 ;i<=Patient_ids.length;i++){
            if(id == Patient_ids[i]){return 1;}
        }
        return 0;
    }


    function addPatient(address _newpatient) external onlyAdmin() {
        add(patient,_newpatient);
    }

    function addRec(address _patid) external onlyDoctor() {
        require(has(patient,_patid) == true, "is not a Patient");
        get_patient_id = _patid;
    }
    function viewPatRec(address _patid) public{
        get_patient_id = _patid;
    }

    function delPat(address _accid) external onlyAdmin(){
        remove(patient,_accid);
    }
    function get() public view  returns(address){
        return msg.sender;
    }
    function get_patid() public view returns(address){
        return get_patient_id;
    }
    function getPatInfo(address iD)public view returns(Patient memory){
        return (Patients[iD]);
    }
    function addPatInfo(address pat_id, string memory firstName, string memory lastName) public {
        require(has(admin,msg.sender) == true, 'Only you Can Add your info ');
        Patient storage patInfo = Patients[pat_id];
        patInfo.firstName = firstName;
        patInfo.lastName = lastName;
        Patient_ids.push(pat_id);

        add(patient,pat_id);
    }

    /*

        Medical Records


    */

    function addMedicalRecord(MedicalRecord memory _record) external onlyDoctor{
        //require(has(doctor,msg.sender) == true, 'Only Doctor Can Do That');
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

