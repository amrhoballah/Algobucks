const Contract = artifacts.require("Contract")
const PatientContract = artifacts.require("PatientContract")
const PractitionerContract = artifacts.require("PractitionerContract")
const OrganisationContract = artifacts.require("OrganisationContract")

module.exports = function(deployer){
	deployer.deploy(Contract)
	.then(()=>{
		return deployer.deploy(PatientContract,Contract.address);
	})
	.then(()=>{
		return deployer.deploy(PractitionerContract,Contract.address);
	})
  .then(()=>{
		return deployer.deploy(OrganisationContract,Contract.address);
	})
	.then(()=>{
   		return Contract.deployed();
    }).then(async function(instance){
		await instance.authoriseContract(PatientContract.address); 
		await instance.authoriseContract(PractitionerContract.address);
    await instance.authoriseContract(OrganisationContract.address);
		return instance;
	})
	.catch(function(error)
	{
		console.log(error);
	});
};
