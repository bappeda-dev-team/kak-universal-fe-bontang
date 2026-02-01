'use client'

import { ButtonGreenBorder, ButtonRedBorder, ButtonSky, ButtonSkyBorder } from "@/components/global/Button";
import { useState, useEffect } from "react";
import { getOpdTahun, getUser, getToken } from "@/components/lib/Cookie";
import { TbCirclePlus, TbPencil, TbPencilDown, TbTrash } from "react-icons/tb";
import { LoadingSync } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { ModalRencanaKinerja } from "./ModalRencanaKinerja";

interface type_rekin {
    id_rencana_kinerja: string;
    id_pohon: number;
    nama_pohon: string;
    nama_rencana_kinerja: string;
    tahun: string;
    status_rencana_kinerja: string;
    catatan: string;
    operational_daerah: opd[];
    pegawai_id: string;
    nama_pegawai: string;
    indikator: indikator[];
}
interface indikator {
    id_indikator: string,
    rencana_kinerja_id: string,
    nama_indikator: string,
    targets: target[]
}
interface target {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}
interface opd {
    kode_opd: string;
    nama_opd: string;
}

export const TablePerencanaan = () => {

    const [Tahun, setTahun] = useState<any>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [rekin, setRekin] = useState<type_rekin[]>([]);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);

    const [ModalNew, setModalNew] = useState<boolean>(false);
    const [ModalEdit, setModalEdit] = useState<boolean>(false);
    const [IdRekin, setIdRekin] = useState<string | null>(null);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const token = getToken();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = getUser();
        const data = getOpdTahun();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if (data) {
            if (data.tahun) {
                const tahun_value = {
                    value: data.tahun.value,
                    label: data.tahun.label,
                }
                setTahun(tahun_value);
            }
        }
    }, []);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        // let url = '';
        // if (user?.roles == 'level_1') {
        //     url = `rencana_kinerja_sasaran_opd/pegawai_level1/${user?.nip}/tahun/${Tahun?.value}`
        // } else {
        //     url = `get_rencana_kinerja/pegawai/${user?.nip}?tahun=${Tahun?.value}`
        // }
        const fetchRekin = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/get_rencana_kinerja/pegawai/${user?.nip}?tahun=${Tahun?.value}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.rencana_kinerja;
                if (data == null) {
                    setDataNull(true);
                    setRekin([]);
                } else {
                    setDataNull(false);
                    setRekin(data);
                }
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        if (user?.pegawai_id != undefined) {
            fetchRekin();
        }
    }, [user, token, Tahun, FetchTrigger]);

    const handleEditRekin = (id: string) => {
        if (ModalEdit) {
            setIdRekin(null);
            setModalEdit(false);
        } else {
            setIdRekin(id);
            setModalEdit(true);
        }
    }

    const hapusRekin = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/rencana_kinerja/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("cant fetch data")
            }
            setRekin(rekin.filter((data) => (data.id_rencana_kinerja !== id)))
            AlertNotification("Berhasil", "Rencana Kinerja Berhasil Dihapus", "success", 1000);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    if (loading) {
        return <LoadingSync />
    } else if (Error) {
        return <h1 className="text-red-500 py-3 px-5 text-center">Gagal mendapatkan data Rencana Kinerja KAK, periksa koneksi internet atau database server</h1>
    }

    return (
        <>
            <div className="flex items-center justify-between border-b px-5 py-5">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <h1 className="font-bold text-2xl uppercase">Rencana Kinerja</h1>
                        <h1 className="font-bold text-2xl uppercase text-green-500">{Tahun?.label}</h1>
                    </div>
                    <ButtonSkyBorder
                        className="flex items-center justify-center"
                        onClick={() => setModalNew(true)}
                    >
                        <TbCirclePlus className="mr-1" />
                        Tambah Rencana kinerja
                    </ButtonSkyBorder>
                </div>
                {/* {(User?.roles == 'eselon_1' || User?.roles == 'eselon_2' || User?.roles == 'eselon_3' || User?.roles == 'eselon_4') && */}
                <div className="flex flex-col items-end">
                    <p>{user?.nama_pegawai || "-"}</p>
                    <p>{user?.nip || "-"}</p>
                    <p>Roles: {user?.roles || "-"}</p>
                </div>
                {/* } */}
            </div>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-700 text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Pohon Kinerja</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Rencana Kinerja</th>
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Tahun</th>
                            <th className="border-r border-b px-6 py-3 min-w-[400px]">Indikator Rencana Kinerja</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">target / Satuan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Status</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Catatan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ?
                            <tr>
                                <td className="px-6 py-3 uppercase" colSpan={13}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            rekin.map((data, index) => (
                                <tr key={data.id_rencana_kinerja}>
                                    <td className="border-r border-b px-6 py-4">{index + 1}</td>
                                    <td className="border-r border-b px-6 py-4">{data.nama_pohon ? data.nama_pohon : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{data.nama_rencana_kinerja ? data.nama_rencana_kinerja : "-"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{data.tahun ? data.tahun : "-"}</td>
                                    {data.indikator != null ?
                                        <>
                                            {data.indikator.length > 1 ?
                                                <td className="border-r border-b text-center">
                                                    {data.indikator.map((item: any, index: number) => (
                                                        <div key={index}>
                                                            {item.nama_indikator ?
                                                                <div className={`flex items-center justify-between gap-2 py-4 px-6 ${index !== data.indikator.length - 1 && 'border-b'}`}>
                                                                    <p className="text-start">{item.nama_indikator}</p>
                                                                    <ButtonGreenBorder
                                                                        halaman_url={`rencanakinerja/manual_ik/${item.id_indikator}`}
                                                                        className="min-w-[110px]"
                                                                    >
                                                                        Manual IK
                                                                    </ButtonGreenBorder>
                                                                </div>
                                                                :
                                                                "-"
                                                            }
                                                        </div>
                                                    ))}
                                                </td>
                                                :
                                                <td className="border-r border-b text-center">
                                                    {data.indikator.map((item: any, index: number) => (
                                                        <div key={index}>
                                                            {item.nama_indikator ?
                                                                <div className={`flex items-center justify-between gap-2 py-4 px-6`}>
                                                                    <p className="text-start">{item.nama_indikator}</p>
                                                                    <ButtonGreenBorder
                                                                        halaman_url={`rencanakinerja/manual_ik/${item.id_indikator}`}
                                                                        className="min-w-[110px]"
                                                                    >
                                                                        Manual IK
                                                                    </ButtonGreenBorder>
                                                                </div>
                                                                :
                                                                "-"
                                                            }
                                                        </div>
                                                    ))}
                                                </td>
                                            }
                                            {data.indikator.length > 1 ?
                                                <td className="border-r border-b text-center">
                                                    {data.indikator.map((item: any, index: number) => (
                                                        item.targets.map((t: any) => (
                                                            <p key={t.id_target} className={`${index !== data.indikator.length - 1 && "border-b"} py-4 px-6`}>
                                                                {t.target ? t.target : "-"} / {t.satuan ? t.satuan : "-"}
                                                            </p>
                                                        ))
                                                    ))}
                                                </td>
                                                :
                                                <td className="border-r border-b px-6 py-4 text-center">
                                                    {data.indikator.map((item: any) => (
                                                        item.targets.map((t: any) => (
                                                            <p key={t.id_target}>
                                                                {t.target ? t.target : "-"} / {t.satuan ? t.satuan : "-"}
                                                            </p>
                                                        ))
                                                    ))}
                                                </td>
                                            }
                                        </>
                                        :
                                        <>
                                            <td className="border-r border-b px-6 py-4 text-center">-</td>
                                            <td className="border-r border-b px-6 py-4 text-center">-</td>
                                        </>
                                    }
                                    <td className="border-r border-b px-6 py-4 text-center">{data.status_rencana_kinerja ? data.status_rencana_kinerja : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{data.catatan ? data.catatan : "-"}</td>
                                    {/* <td className="border-r border-b px-6 py-4">
                            <div className="flex flex-col justify-center items-center gap-2">
                                <button className="w-full rounded-lg bg-green-600 py-1 font-semibold">SIAP DITARIK SKP</button>
                                <button className="w-full rounded-lg bg-green-600 py-1 font-semibold">MANRISK SIAP DIVERIFIKASI</button>
                            </div>
                        </td> */}
                                    <td className="border-r border-b px-6 py-4">
                                        <div className="flex flex-col justify-center items-center gap-2">
                                            <ButtonSkyBorder
                                                className="w-full"
                                                onClick={() => handleEditRekin(data.id_rencana_kinerja)}
                                            >
                                                <TbPencil className="mr-1" />
                                                Edit Rekin
                                            </ButtonSkyBorder>
                                            {(user?.roles == 'level_2' || user?.roles == 'level_3' || user?.roles == 'level_4') &&
                                                <ButtonGreenBorder
                                                    className="w-full"
                                                    halaman_url={`/rencanakinerja/${data.id_rencana_kinerja}`}
                                                >
                                                    <TbPencilDown className="mr-1" />
                                                    {user?.roles == "level_2" || user?.roles == 'level_4' ?
                                                        "Renaksi"
                                                        :
                                                        "Rincian"
                                                    }
                                                </ButtonGreenBorder>
                                            }
                                            <ButtonRedBorder className="w-full"
                                                onClick={() => {
                                                    AlertQuestion("Hapus?", "Hapus Rencana Kinerja yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                        if (result.isConfirmed) {
                                                            hapusRekin(data.id_rencana_kinerja);
                                                        }
                                                    });
                                                }}
                                            >
                                                <TbTrash className="mr-1" />
                                                Hapus
                                            </ButtonRedBorder>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <ModalRencanaKinerja
                    metode="baru"
                    tahun={Tahun?.value}
                    kode_opd={user?.kode_opd}
                    nip={user?.nip}
                    pegawai_id={user?.pegawai_id}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                    isOpen={ModalNew}
                    onClose={() => setModalNew(false)}
                    roles={user?.roles}
                />
                <ModalRencanaKinerja
                    id={IdRekin || ''}
                    metode="lama"
                    tahun={Tahun?.value}
                    kode_opd={user?.kode_opd}
                    nip={user?.nip}
                    pegawai_id={user?.pegawai_id}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                    isOpen={ModalEdit}
                    onClose={() => handleEditRekin('')}
                    roles={user?.roles}
                />
            </div>
        </>
    )
}

export const TableLaporan = () => {

    const [Tahun, setTahun] = useState<any>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [rekin, setRekin] = useState<type_rekin[]>([]);

    // useEffect(() => {
    //     const fetchRekin = async() => {
    //         setLoading(true)
    //         try{
    //             const response = await fetch("localhost:3000/data");
    //             const data = await response.json();
    //             setRekin(data);
    //         } catch(err){
    //             alert("gagal lur")
    //             console.error(err)
    //         } finally{
    //             setLoading(false);
    //         }
    //     }
    //     fetchRekin();
    // }, [])

    useEffect(() => {
        const data = getOpdTahun();
        if (data) {
            if (data.tahun) {
                const tahun_value = {
                    value: data.tahun.value,
                    label: data.tahun.label,
                }
                setTahun(tahun_value);
            }
        }
    }, [])

    if (loading) {
        return <h1>Loading</h1>
    }

    return (
        <div className="mt-3 rounded-xl shadow-lg border">
            <div className="flex items-center justify-between border-b px-5 py-5">
                <div className="flex flex-col">
                    <h1 className="font-bold text-2xl uppercase">rencana kinerja {Tahun?.label}</h1>
                    <ButtonSky className="flex items-center justify-center">
                        <TbCirclePlus className="mr-1" />
                        Rencana kinerja baru
                    </ButtonSky>
                </div>
                <div className="flex flex-col items-end">
                    <p>Nama Lengkap Pegawai</p>
                    <p>192730187240817204</p>
                    <p>Roles: Eselon 3</p>
                </div>
            </div>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#99CEF5] text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Pohon Kinerja</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Rencana Kinerja</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Tahun</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Indikator Rencana Kinerja</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Target</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Satuan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Status</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border-r border-b px-6 py-4">1</td>
                            <td className="border-r border-b px-6 py-4">Penyusunan dokumen perencanaan sesuai SOP</td>
                            <td className="border-r border-b px-6 py-4">Tersusunya dokumen rancangan aplikasi rencana kinerja terintegrasi</td>
                            <td className="border-r border-b px-6 py-4">2024</td>
                            <td className="border-r border-b px-6 py-4">Dokumen rancangan aplikasi</td>
                            <td className="border-r border-b px-6 py-4 text-center">1</td>
                            <td className="border-r border-b px-6 py-4">dokumen</td>
                            <td className="border-r border-b px-6 py-4">
                                <div className="flex flex-col justify-center items-center gap-2">
                                    <button className="w-full rounded-lg bg-green-600 py-1 font-semibold">SIAP DITARIK SKP</button>
                                    <button className="w-full rounded-lg bg-green-600 py-1 font-semibold">MANRISK SIAP DIVERIFIKASI</button>
                                </div>
                            </td>
                            <td className="border-r border-b px-6 py-4">
                                <div className="flex flex-col justify-center items-center gap-2">
                                    <ButtonGreenBorder className="w-full">
                                        <TbPencilDown className="mr-1" />
                                        Input Rincian
                                    </ButtonGreenBorder>
                                    <ButtonSkyBorder className="w-full">
                                        <TbPencil className="mr-1" />
                                        Edit Rekin
                                    </ButtonSkyBorder>
                                    <ButtonRedBorder className="w-full">
                                        <TbTrash className="mr-1" />
                                        Hapus
                                    </ButtonRedBorder>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}