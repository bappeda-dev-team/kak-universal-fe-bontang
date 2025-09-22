'use client'

import React, { useEffect, useState } from "react";
import { ButtonRedBorder, ButtonSkyBorder } from "@/components/global/Button";
import { TbUpload, TbTrash } from "react-icons/tb";
import { ModalUploadRincianBelanja } from "./ModalUploadRincianBelaja";
import { AlertNotification } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import { OpdTahunNull, TahunNull } from "@/components/global/OpdTahunNull";
import { LoadingClip } from "@/components/global/Loading";
import { AlertQuestion } from "@/components/global/Alert";

interface TableLaporan {
    tahun: string;
    kode_opd: string;
    nama_opd?: string;
    nip?: string;
    role: string;
    user_id: string;
    nama_pegawai: string;
}
interface Target {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}

interface IndikatorSubKegiatan {
    id_indikator: string;
    kode_subkegiatan: string;
    kode_opd: string;
    nama_indikator: string;
    targets: Target[];
}
interface IndikatorRencanaKinerja {
    id_indikator: string;
    rencana_kinerja_id: string;
    nama_indikator: string;
    targets: Target[];
}

interface RencanaAksi {
    renaksi_id: string;
    renaksi: string;
    anggaran: number;
}

interface RincianBelanja {
    index: string;
    rencana_kinerja_id: string;
    rencana_kinerja: string;
    pegawai_id: string | null;
    nama_pegawai: string | null;
    indikator: IndikatorRencanaKinerja[];
    total_anggaran: number;
    rencana_aksi: RencanaAksi[] | null;
}

interface LaporanRincianBelanja {
    kode_opd: string;
    kode_subkegiatan: string;
    nama_subkegiatan: string;
    indikator_subkegiatan: IndikatorSubKegiatan[];
    total_anggaran: number;
    rincian_belanja: RincianBelanja[];
}

interface Document {
    id: number;
    user_id: string;
    nama: string;
    kode_subkegiatan: string;
    kode_opd: string;
    file_name: string;
    file_url: string;
    filesize: number;
    content_type: string;
    tahun: number;
    created_at: string;
}

type GabunganLaporan = LaporanRincianBelanja & Document;

export const TableLaporan: React.FC<TableLaporan> = ({ tahun, kode_opd, nama_opd, nama_pegawai, user_id, nip, role }) => {

    const [Laporan, setLaporan] = useState<LaporanRincianBelanja[]>([]);
    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [Bt, setBt] = useState<boolean>(false);

    const [DataPDF, setDataPDF] = useState<Document[]>([]);
    const [SessionId, setSessionId] = useState<string>("");
    const [FetchLaporan, setFetchLaporan] = useState<boolean>(false);
    const [LoadingLaporanPDF, setLoadingLaporanPDF] = useState<boolean>(false);
    const [SubKegiatan, setSubKegiatan] = useState<string>("");

    const [Loading, setLoading] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean>(false);

    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchLaporan = async (url: string) => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/${url}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                const result = await response.json();
                const data = result.data;
                if (result.code === 200 || result.code === 201) {
                    if (data === null) {
                        setLaporan([]);
                        setDataNull(true);
                        setError(false);
                        setFetchLaporan(true);
                    } else {
                        setLaporan(data);
                        setDataNull(false);
                        setError(false);
                        setFetchLaporan(true);
                    }
                } else {
                    setDataNull(false);
                    setError(true);
                    setFetchLaporan(false);
                }
            } catch (err) {
                setDataNull(false);
                setError(true);
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (role != undefined) {
            if (role == 'super_admin' || role == 'admin_opd' || role == 'reviewer') {
                fetchLaporan(`rincian_belanja/laporan?kode_opd=${kode_opd}&tahun=${tahun}`)
            } else {
                fetchLaporan(`rincian_belanja/pegawai/${nip}/${tahun}`)
            }
        } else {
            setError(true);
        }
    }, [role, kode_opd, nip, tahun, token, FetchTrigger]);

    useEffect(() => {
        const url = 'https://testapi.kertaskerja.cc';
        const payload = {
            username: "admin_test",
            password: "TEST_ONLY"
        }
        const login = async () => {
            try {
                setLoadingLaporanPDF(true);
                const response = await fetch(`${url}/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                const result = await response.json();
                if (response.ok) {
                    setSessionId(result.sessionId);
                }
            } catch (err) {
                console.error(err);
                setLoadingLaporanPDF(false);
            } finally {
                const getFilePDF = async () => {
                    const url_pdf = "https://kab-bontang-upload.zeabur.app"
                    try {
                        setLoadingLaporanPDF(true);
                        const response = await fetch(`${url_pdf}/files?kode_opd=${kode_opd}&tahun=${tahun}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });
                        const result = await response.json();
                        if (response.ok) {
                            if(result === null){
                                setDataPDF([]);
                            } else {
                                setDataPDF(result);
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    } finally {
                        setLoadingLaporanPDF(false);
                    }
                }
                getFilePDF();
            }
        }
        if (FetchLaporan === true) {
            login();
        }
    }, [kode_opd, tahun, FetchLaporan]);

    const hasilGabungan = Laporan.map((itemPertama) => {
        const itemKedua = DataPDF.find(
            (item) => item.kode_subkegiatan === itemPertama.kode_subkegiatan
        );

        if (itemKedua) {
            return {
                ...itemPertama,
                ...itemKedua,
            };
        }

        return itemPertama;
    });

    const gabunganLaporanFinal = hasilGabungan as GabunganLaporan[];

    function formatRupiah(angka: number) {
        if (typeof angka !== 'number') {
            return String(angka); // Jika bukan angka, kembalikan sebagai string
        }
        return angka.toLocaleString('id-ID'); // 'id-ID' untuk format Indonesia
    }

    const handleModal = (kode: string) => {
        if (ModalOpen) {
            setModalOpen(false);
            setSubKegiatan("");
        } else {
            setModalOpen(true);
            setSubKegiatan(kode);
        }
    }

    const hapusPdf = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL_CSF;
        try {
            const response = await fetch(`${API_URL}/csf/${id}`, {
                method: "DELETE",
                headers: {
                    // Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (!response.ok) {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
                console.error(result);
            } else {
                AlertNotification("Berhasil", "Data CSF Berhasil dihapus", "success", 1000);
                setFetchTrigger((prev) => !prev);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    if (Loading || LoadingLaporanPDF) {
        return (
            <div className="w-full border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="w-full border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else if (tahun == undefined) {
        return <TahunNull />
    } else if (role == 'super_admin' || role == 'reviewer') {
        if (kode_opd == undefined) {
            return (
                <>
                    <div className="w-full flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                        <OpdTahunNull />
                    </div>
                </>
            )
        }
    }

    return (
        <div className="overflow-auto m-3 rounded-t-xl border w-full">
            <table className="w-full">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                        <th className="border-r border-b px-6 py-3 min-w-[200px]">Pemilik</th>
                        <th className="border-r border-b px-6 py-3 min-w-[300px]">Rencana Kinerja</th>
                        <th className="border-r border-b px-6 py-3 min-w-[300px]">Indikator Kinerja</th>
                        <th className="border-r border-b px-6 py-3 min-w-[100px]">Target/Satuan</th>
                        <th className="border-r border-b px-6 py-3 min-w-[170px]">Anggaran</th>
                        <th className="border-r border-b px-6 py-3 min-w-[200px]">Dokumen Anggaran</th>
                    </tr>
                </thead>
                {DataNull ?
                    <tbody>
                        <tr>
                            <td className="px-6 py-3" colSpan={30}>
                                Data Kosong / Belum Ditambahkan
                            </td>
                        </tr>
                    </tbody>
                    :
                    gabunganLaporanFinal.map((data: GabunganLaporan, index: number) => (
                        <tbody key={index}>
                            <tr className="bg-emerald-50 text">
                                <td className="border-r border-b px-6 py-4">{index + 1}</td>
                                <td colSpan={2} className="border-r border-b px-6 py-4">Sub Kegiatan: {data.nama_subkegiatan || "-"} ({data.kode_subkegiatan || "tanpa kode"})</td>
                                {data.indikator_subkegiatan === null ?
                                    <React.Fragment>
                                        <td className="border-r border-b px-6 py-4 text-center">-</td>
                                        <td className="border-r border-b px-6 py-4 text-center">-</td>
                                    </React.Fragment>
                                    :
                                    data.indikator_subkegiatan.map((i: IndikatorSubKegiatan, index_isk: number) => (
                                        <React.Fragment key={index_isk}>
                                            <td className="border-r border-b px-6 py-4">{i.nama_indikator || "-"}</td>
                                            {i.targets.map((t: Target, index_target: number) => (
                                                <React.Fragment key={index_target}>
                                                    <td className="border-r border-b px-6 py-4 text-center">{t.target || "-"} {t.satuan || "-"}</td>
                                                </React.Fragment>
                                            ))}
                                        </React.Fragment>
                                    ))
                                }
                                <td className="border-r border-b px-6 py-4">Rp.{formatRupiah(data.total_anggaran)}</td>
                                <td className="border-r border-b px-6 py-4">
                                    <div className="flex flex-col justify-center items-center gap-2">
                                        {!data.file_name ?
                                            ((role == 'level_3' || role == 'super_admin') ?
                                                <ButtonSkyBorder
                                                    className="flex items-center gap-1 w-full"
                                                    onClick={() => handleModal(data.kode_subkegiatan)}
                                                >
                                                    <TbUpload />
                                                    Upload
                                                </ButtonSkyBorder>
                                                :
                                                "dokumen belum di tambahkan oleh pemilik"
                                            )
                                            :
                                            <>
                                                <a
                                                    className={`border rounded-lg px-2 py-1 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white cursor-pointer`}
                                                    href={data.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <p className="text-sm cursor-pointer italic">{data.file_name || "-"}</p>
                                                </a>
                                                    <p className="border-b">uploader : {data.nama || "-"}</p>
                                                {/* {(role == 'level_3' || role == 'super_admin') ?
                                                    <ButtonRedBorder
                                                        className="flex items-center gap-1 w-full"
                                                        onClick={() => {
                                                            AlertQuestion("Hapus", "Hapus data anggaran dan file rincian belanja?", "question", "Hapus", "Batal").then((result) => {
                                                                if (result.isConfirmed) {
                                                                    AlertNotification("Pengembangan", "fitur masih dalam pengembangan developer", "info", 3000);
                                                                }
                                                            })
                                                        }}
                                                    >
                                                        <TbTrash />
                                                        Hapus
                                                    </ButtonRedBorder>
                                                    :
                                                    <></>
                                                } */}
                                            </>
                                        }
                                    </div>
                                </td>
                            </tr>
                            {data.rincian_belanja.map((rekin: RincianBelanja, index_rb: number) => (
                                <React.Fragment key={index_rb}>
                                    <tr>
                                        <td rowSpan={rekin.indikator ? rekin.indikator.length : 2} className="border-r border-b px-6 py-4">{index + 1}.{index_rb + 1}</td>
                                        <td rowSpan={rekin.indikator ? rekin.indikator.length : 2} className="border-r border-b px-6 py-4">{rekin.nama_pegawai || "-"}</td>
                                        <td rowSpan={rekin.indikator ? rekin.indikator.length : 2} className="border-r border-b px-6 py-4">{rekin.rencana_kinerja || "-"}</td>
                                        {/* Kolom indikator pertama */}
                                        {rekin.indikator === null ? (
                                            <React.Fragment>
                                                <td className="border-r border-b px-6 py-4">-</td>
                                                <td className="border-r border-b px-6 py-4 text-center">-</td>
                                                <td className="border-r border-b px-6 py-4 text-center">-</td>
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <td className="border-r border-b px-6 py-4">{rekin.indikator[0].nama_indikator || "-"}</td>
                                                {rekin.indikator[0].targets.length === 0 || rekin.indikator[0].targets === null ? (
                                                    <td className="border-r border-b px-6 py-4 text-center">-</td>
                                                ) : (
                                                    rekin.indikator[0].targets.map((t: Target, index_t: number) => (
                                                        <td key={index_t} className="border-r border-b px-6 py-4 text-center">{t.target || "-"} {t.satuan || "-"}</td>
                                                    ))
                                                )}
                                            </React.Fragment>
                                        )}
                                        <td rowSpan={rekin.indikator ? rekin.indikator.length : 2} className="border-r border-b px-6 py-4">Rp.{formatRupiah(rekin.total_anggaran || 0)}</td>
                                        <td rowSpan={rekin.indikator ? rekin.indikator.length : 2} className="border-r border-b px-6 py-4">-</td>
                                    </tr>
                                    {/* Baris-baris untuk indikator selanjutnya */}
                                    {rekin.indikator ?
                                        rekin.indikator.slice(1).map((i: IndikatorRencanaKinerja, index_i) => (
                                            <tr key={index_i}>
                                                <td className="border-r border-b px-6 py-4">{i.nama_indikator || "-"}</td>
                                                {i.targets.length === 0 || i.targets === null ? (
                                                    <td className="border-r border-b px-6 py-4 text-center">-</td>
                                                ) : (
                                                    i.targets.map((t: Target, index_t: number) => (
                                                        <td key={index_t} className="border-r border-b px-6 py-4 text-center">{t.target || "-"} {t.satuan || "-"}</td>
                                                    ))
                                                )}
                                            </tr>
                                        ))
                                        :
                                        <tr>
                                            <td className="border-r border-b px-6 py-4">-</td>
                                            <td className="border-r border-b px-6 py-4 text-center">-</td>
                                        </tr>
                                    }
                                    {rekin.rencana_aksi === null ?
                                        <tr>
                                            <td colSpan={5} className="border-r border-b px-6 py-4 text-red-500">Renaksi Belum di tambahkan di rencana kinerja</td>
                                            <td className="border-r border-b px-6 py-4">Rp.0</td>
                                            <td className="border-r border-b px-6 py-4">-</td>
                                        </tr>
                                        :
                                        rekin.rencana_aksi.map((renaksi: RencanaAksi, index_renaksi: number) => (
                                            <tr key={index_renaksi}>
                                                <td colSpan={5} className="border-r border-b px-6 py-4">Renaksi {index_renaksi + 1}: {renaksi.renaksi}</td>
                                                <td className="border-r border-b px-6 py-4">Rp.{formatRupiah(renaksi.anggaran || 0)}</td>
                                                <td className="border-r border-b px-6 py-4">-</td>
                                            </tr>
                                        ))
                                    }
                                </React.Fragment>
                            ))}
                        </tbody>
                    ))
                }
            </table>
            <ModalUploadRincianBelanja
                isOpen={ModalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={() => setFetchTrigger((prev) => !prev)}
                tahun={tahun}
                user_id={user_id}
                kode_opd={kode_opd}
                kode_subkegiatan={SubKegiatan}
                nama_pegawai={nama_pegawai}
            />
        </div>
    )
}