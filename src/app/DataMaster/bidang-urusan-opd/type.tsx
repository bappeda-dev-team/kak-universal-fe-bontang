import { OptionTypeString } from "@/types";

export interface GetBidangUrusanOpd {
    id: number;
    kode_bidang_urusan: string;
    nama_bidang_urusan: string;
}

export interface FormValue {
    kode_bidang_urusan: OptionTypeString | null;
    kode_opd: string;
}