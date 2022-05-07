import { Communication } from "../communication.model";
import { ContactPoint } from "../contactPoint.model";
import { HumanName } from "../humanName.model";
import { Patient } from "../patient.model";
import { PhysicalAddress } from "../physicalAddress.model";

export function toPatient(data:any): Patient {
    return new Patient(
        data[0],
        new HumanName(data[1][0],data[1][1]),
        new ContactPoint(data[2][0],data[2][1]),
        new PhysicalAddress(data[5][0],data[5][1],data[5][2],data[5][3],data[5][4],data[5][5]),
        data[4],
        data[11],
        data[12],
        new Communication(data[10][0],data[10][1]),
        data[3],
        data[6],
        data[7],
        data[8],
        data[9]
)
}