'use client'

import { FiHome } from "react-icons/fi";
import Table from "./comp/Table";
import { OpdNull, OpdTahunNull } from "@/components/global/OpdTahunNull";
import { useBrandingContext } from "@/context/BrandingContext";
import { IsLoadingBranding } from "@/components/global/Loading";

const SubKegiatanOpd = () => {

    const { branding, LoadingBranding } = useBrandingContext();
    const opd = branding?.user?.roles == "super_admin" ? branding?.opd?.value : branding?.user?.kode_opd;
    const nama_opd = branding?.user?.roles == "super_admin" ? branding?.opd?.label : branding?.user?.nama_opd;

    if (LoadingBranding) {
        return <IsLoadingBranding />
    } else {
        if (branding?.user?.roles == "super_admin" && (opd === null || opd === undefined)) {
            return <OpdTahunNull />
        } else {
            return (
                <>
                    <div className="flex items-center">
                        <a href="/" className="mr-1"><FiHome /></a>
                        <p className="mr-1">/ Data Master OPD</p>
                        <p className="mr-1">/ Bidang Urusan OPD</p>
                    </div>
                    <div className="mt-3 rounded-xl shadow-lg border">
                        <div className="flex items-center justify-between border-b px-5 py-5">
                            <div className="flex flex-wrap items-end">
                                <h1 className="uppercase font-bold">Bidang Urusan OPD</h1>
                                <h1 className="uppercase font-bold ml-1 text-blue-500">{nama_opd}</h1>
                            </div>
                        </div>
                        <div className="m-1">
                            <Table />
                        </div>
                    </div>
                </>
            )
        }
    }
}

export default SubKegiatanOpd;