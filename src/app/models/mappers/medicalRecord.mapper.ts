import { MedicalRecord } from "../medicalRecord.model";

export function toMedicalRecord(data:any[]):MedicalRecord{
    return new MedicalRecord(
        data[0],
        data[1],
        data[2],
        data[3]*1,
        data[4],
        data[5],
        data[6],
        data[7],
        data[8],
        data[9],
        data[10]
    )
}