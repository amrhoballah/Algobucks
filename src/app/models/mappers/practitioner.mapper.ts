import { Communication } from "../communication.model";
import { ContactPoint } from "../contactPoint.model";
import { HumanName } from "../humanName.model";
import { PhysicalAddress } from "../physicalAddress.model";
import { Practitioner } from "../practitioner.model"

export function toPractitioner(data: any[]):Practitioner {
    return new Practitioner(
        data[0],
        new HumanName(data[1][0], data[1][1]),
        new ContactPoint(data[2][0], data[2][1]),
        new PhysicalAddress(data[3][0], data[3][1], data[3][2], data[3][3], data[3][4], data[3][5]),
        data[4],
        data[5],
        new Communication(data[6][0],data[6][1]),
        data[7]
    );
}