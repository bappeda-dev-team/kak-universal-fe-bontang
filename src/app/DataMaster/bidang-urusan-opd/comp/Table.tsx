'use client'

import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { getToken } from "@/components/lib/Cookie";
import { useBrandingContext } from "@/context/BrandingContext";
import { ButtonSkyBorder, ButtonRed } from "@/components/global/Button";
import { ModalBidangUrusanOpd } from "./ModalBidangUrusanOpd";
import { GetBidangUrusanOpd } from "../type";
import { AlertQuestion, AlertNotification } from "@/components/global/Alert";
import { TbCirclePlus, TbTrash } from "react-icons/tb";

const Table = () => {

    const [Data, setData] = useState<GetBidangUrusanOpd[]>([]);
    const [Error, setError] = useState<boolean | null>(null);

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const [Loading, setLoading] = useState<boolean | null>(null);
    const token = getToken();
    const { branding } = useBrandingContext();
    const opd = branding?.user?.roles == "super_admin" ? branding?.opd?.value : branding?.user?.kode_opd;

    useEffect(() => {
        const fetchBidangUrusanOpd = async () => {
            try {
                setLoading(true);
                setError(false);
                const response = await fetch(`${branding?.api_perencanaan}/bidang_urusan_opd/findall/${opd}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                console.log(result);
                if (result.code === 200) {
                    if (result.data === null) {
                        setData([]);
                    } else {
                        setData(result.data);
                    }
                } else if (result.code === 401) {
                    window.location.href = "/login";
                } else {
                    setData([]);
                    setError(true);
                }
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        fetchBidangUrusanOpd();
    }, [branding, opd, FetchTrigger, token]);

    const hapusBidangUrusan = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/bidang_urusan_opd/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            setData(Data.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data Sub Kegiatan OPD Berhasil Di hapus", "success", 1000);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else {
        return (
            <>
                <ButtonSkyBorder
                    className="ml-3 mt-2 flex items-center gap-1"
                    onClick={() => setModalOpen(true)}
                >
                    <TbCirclePlus />
                    Tambah Bidang Urusan
                </ButtonSkyBorder>
                <div className="overflow-auto m-2 rounded-t-xl border w-full">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-blue-500 text-white">
                                <th className="border-r border-b px-6 py-3 text-center w-[50px]">No</th>
                                <th className="border-r border-b px-6 py-3 text-center">Kode Bidang Urusan</th>
                                <th className="border-r border-b px-6 py-3 text-center">Nama Bidang Urusan</th>
                                <th className="border-r border-b px-6 py-3 text-center w-[150px]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!Data || Data.length === 0) ?
                                <tr>
                                    <td className="px-6 py-3" colSpan={30}>
                                        Data Kosong / Belum Ditambahkan
                                    </td>
                                </tr>
                                :
                                Data.map((item: GetBidangUrusanOpd, index: number) => (
                                    <tr key={index}>
                                        <td className="border-x border-b border-blue-500 py-4 px-3 text-center">
                                            {index + 1}
                                        </td>
                                        <td className="border-r border-b border-blue-500 px-6 py-4">
                                            {item.kode_bidang_urusan || "-"}
                                        </td>
                                        <td className="border-r border-b border-blue-500 px-6 py-4">
                                            {item.nama_bidang_urusan || "-"}
                                        </td>
                                        <td className="border-r border-b border-blue-500 px-6 py-4">
                                            <ButtonRed
                                                className="w-full flex items-center gap-1"
                                                onClick={() => {
                                                    AlertQuestion("Hapus?", "Hapus Sub Kegiatan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                        if (result.isConfirmed) {
                                                            hapusBidangUrusan(item.id);
                                                        }
                                                    });
                                                }}
                                            >
                                                <TbTrash />
                                                Hapus
                                            </ButtonRed>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {ModalOpen &&
                    <ModalBidangUrusanOpd
                        kode_opd={opd}
                        tahun={String(branding?.tahun?.value)}
                        isOpen={ModalOpen}
                        onClose={() => setModalOpen(false)}
                        onSuccess={() => setFetchTrigger((prev) => !prev)}
                    />
                }
            </>
        )
    }
}

export default Table;
