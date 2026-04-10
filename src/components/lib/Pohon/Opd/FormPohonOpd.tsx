'use client'

import React, { useState, useEffect } from 'react';
import { ButtonSky, ButtonRed, ButtonSkyBorder, ButtonRedBorder } from '@/components/global/Button';
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { getOpdTahun } from '../../Cookie';
import { AlertNotification } from '@/components/global/Alert';
import Select from 'react-select';
import { PohonOpd } from './PohonOpd';
import { getToken, getUser } from '../../Cookie';
import { LoadingButtonClip, LoadingSync } from '@/components/global/Loading';
import { TbCirclePlus, TbCircleX, TbDeviceFloppy } from 'react-icons/tb';

interface OptionTypeString {
    value: string;
    label: string;
}
interface OptionType {
    value: number;
    label: string;
}
interface FormValue {
    id: number;
    parent: string;
    nama_pohon: string;
    jenis_pohon: string;
    keterangan: string;
    tahun: OptionTypeString;
    kode_opd: OptionTypeString;
    pelaksana: OptionTypeString[];
    pohon?: OptionType;
    indikator: indikator[];
}
interface indikator {
    nama_indikator: string;
    targets: target[];
}
type target = {
    target: string;
    satuan: string;
};

export const FormPohonOpd: React.FC<{
    formId: number;
    id: number | null;
    level: number;
    deleteTrigger: () => void;
    fetchTrigger: () => void;
    onCancel?: () => void
}> = ({ id, level, onCancel, deleteTrigger, fetchTrigger }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValue>();
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [Keterangan, setKeterangan] = useState<string>('');
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [DataAdd, setDataAdd] = useState<any>(null);
    const [IsAdded, setIsAdded] = useState<boolean>(false);
    const [Deleted, setDeleted] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const token = getToken();

    useEffect(() => {
        const fetchUser = getUser();
        const data = getOpdTahun();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if (data.tahun) {
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
        if (data.opd) {
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    }, []);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "indikator",
    });

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            nama_pohon: data.nama_pohon,
            Keterangan: data.keterangan,
            jenis_pohon: level === 0 ? "Sub Tematik" :
                level === 1 ? "Sub Sub Tematik" :
                    level === 2 ? "Super Sub Tematik" :
                        level === 3 ? "Strategic" :
                            level === 4 ? "Tactical" :
                                level === 5 ? "Operational" : "Operational N",
            level_pohon: level >= 0 && level <= 20 ? level + 1 : "Unknown",
            parent: id,
            tahun: Tahun?.value?.toString(),
            kode_opd: user?.roles == 'super_admin' ? SelectedOpd?.value : user?.kode_opd,
            ...(data.indikator && {
                indikator: data.indikator.map((ind) => ({
                    indikator: ind.nama_indikator,
                    target: ind.targets.map((t) => ({
                        target: t.target,
                        satuan: t.satuan,
                    })),
                })),
            }),
        };
        // console.log(formData);
        try {
            setProses(true);
            const url = '/pohon_kinerja_opd/create';
            const response = await fetch(`${API_URL}${url}`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                AlertNotification("Berhasil", "Berhasil menambahkan pohon", "success", 1000);
                setIsAdded(true);
                const result = await response.json();
                const data = result.data;
                setDataAdd(data);
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    };

    return (
        <React.Fragment>
            {IsAdded && DataAdd ?
                <PohonOpd
                    tema={DataAdd}
                    deleteTrigger={deleteTrigger}
                    fetchTrigger={fetchTrigger}
                    set_show_all={() => null}
                />
                :
                <li className='form-pohon-opd'>
                    <div className="tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg shadow-slate-500">
                        <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black rounded-lg">
                            {
                                level == 3 ?
                                    <h1>Tambah Strategic Baru </h1>
                                    :
                                    level == 4 ?
                                        <h1>Tambah Tactical Baru </h1>
                                        :
                                        level == 5 ?
                                            <h1>Tambah Operational Baru </h1>
                                            :
                                            <h1>Tambah Operational N Baru </h1>
                            }
                        </div>
                        <div className="flex justify-center my-3 w-full">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className='w-full'
                            >
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="nama_pohon"
                                    >
                                        {level == 0 ?
                                            "Sub Tematik"
                                            :
                                            level == 1 ?
                                                "Sub Sub Tematik"
                                                :
                                                level == 2 ?
                                                    "Super Sub Tematik"
                                                    :
                                                    level == 3 ?
                                                        "Strategic"
                                                        :
                                                        level == 4 ?
                                                            "Tactical"
                                                            :
                                                            level == 5 ?
                                                                "Operational"
                                                                :
                                                                "Operational N"
                                        }
                                    </label>
                                    <Controller
                                        name="nama_pohon"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                className="border px-4 py-2 rounded-lg"
                                                id="nama_pohon"
                                                type="text"
                                                maxLength={255}
                                                placeholder="masukkan Pohon"
                                                value={field.value || NamaPohon}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setNamaPohon(e.target.value);
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <label className="uppercase text-base font-bold text-sky-700 my-2">
                                    {level == 4 ?
                                        <h1>Indikator Tactical :</h1>
                                        :
                                        level == 5 ?
                                            <h1>Indikator Operational :</h1>
                                            :
                                            level >= 5 ?
                                                <h1>Indikator Operational N :</h1>
                                                :
                                                <h1>Indikator Strategic :</h1>
                                    }
                                </label>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex flex-col my-2 py-2 px-5 border border-sky-700 rounded-lg">
                                        <Controller
                                            name={`indikator.${index}.nama_indikator`}
                                            control={control}
                                            defaultValue={field.nama_indikator}
                                            render={({ field }) => (
                                                <div className="flex flex-col py-3">
                                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                        Nama Indikator {index + 1} :
                                                    </label>
                                                    <input
                                                        {...field}
                                                        maxLength={255}
                                                        className="border px-4 py-2 rounded-lg"
                                                        placeholder={`Masukkan nama indikator ${index + 1}`}
                                                    />
                                                </div>
                                            )}
                                        />
                                        {field.targets.map((_, subindex) => (
                                            <>
                                                <Controller
                                                    name={`indikator.${index}.targets.${subindex}.target`}
                                                    control={control}
                                                    defaultValue={_.target}
                                                    render={({ field }) => (
                                                        <div className="flex flex-col py-3">
                                                            <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                                Target :
                                                            </label>
                                                            <input
                                                                {...field}
                                                                type="text"
                                                                className="border px-4 py-2 rounded-lg"
                                                                placeholder="Masukkan target"
                                                            />
                                                        </div>
                                                    )}
                                                />
                                                <Controller
                                                    name={`indikator.${index}.targets.${subindex}.satuan`}
                                                    control={control}
                                                    defaultValue={_.satuan}
                                                    render={({ field }) => (
                                                        <div className="flex flex-col py-3">
                                                            <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                                Satuan :
                                                            </label>
                                                            <input
                                                                {...field}
                                                                className="border px-4 py-2 rounded-lg"
                                                                placeholder="Masukkan satuan"
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            </>
                                        ))}
                                        {index >= 0 && (
                                            <ButtonRedBorder
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="w-[200px] my-3"
                                            >
                                                Hapus
                                            </ButtonRedBorder>
                                        )}
                                    </div>
                                ))}
                                <ButtonSkyBorder
                                    className="flex items-center gap-1 mb-3 mt-2 w-full"
                                    type="button"
                                    onClick={() => append({ nama_indikator: "", targets: [{ target: "", satuan: "" }] })}
                                >
                                    <TbCirclePlus />
                                    Tambah Indikator
                                </ButtonSkyBorder>
                                <div className="flex flex-col pb-3 pt-1 border-t-2">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="keterangan"
                                    >
                                        Keterangan:
                                    </label>
                                    <Controller
                                        name="keterangan"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                className="border px-4 py-2 rounded-lg"
                                                id="keterangan"
                                                placeholder="masukkan keterangan"
                                                value={field.value || Keterangan}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setKeterangan(e.target.value);
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <ButtonSky
                                    type="submit"
                                    className="w-full my-3"
                                    disabled={Proses}
                                >
                                    {Proses ?
                                        <span className="flex items-center gap-1 ">
                                            <LoadingButtonClip />
                                            Menyimpan...
                                        </span>
                                        :
                                        <span className="flex items-center gap-1 ">
                                            <TbDeviceFloppy />
                                            Simpan
                                        </span>
                                    }
                                </ButtonSky>
                                <ButtonRed className="flex items-center gap-1 w-full my-3" onClick={onCancel}>
                                    <TbCircleX />
                                    Batal
                                </ButtonRed>
                            </form>
                        </div>
                    </div>
                </li>
            }
        </React.Fragment>
    );
};

export const FormEditPohon: React.FC<{
    formId: number;
    id: number;
    level: number;
    onCancel: () => void
    EditBerhasil: (data: any) => void;
}> = ({ id, level, onCancel, EditBerhasil }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValue>();
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [Keterangan, setKeterangan] = useState<string>('');
    const [Parent, setParent] = useState<number | null>(null);
    const [KodeOpd, setKodeOpd] = useState<number | null>(null);
    const [JenisPohon, setJenisPohon] = useState<string | null>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [Pelaksana, setPelaksana] = useState<OptionTypeString[]>([]);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const [IsEdited, setIsEdited] = useState<boolean>(false);
    const [DataEdit, setDataEdit] = useState<any>(null);
    const [Deleted, setDeleted] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const [ProsesDetail, setProsesDetail] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const token = getToken();

    useEffect(() => {
        const fetchUser = getUser();
        const data = getOpdTahun();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if (data.tahun) {
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
        if (data.opd) {
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    }, []);

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "indikator",
    });

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchDetailPohon = async () => {
            try {
                setProsesDetail(true);
                const response = await fetch(`${API_URL}/pohon_kinerja_opd/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                const data = result.data;
                // console.log(data);
                if (data.parent) {
                    setParent(data.parent);
                }
                if (data.kode_opd) {
                    setKodeOpd(data.kode_opd);
                }
                if (data.jenis_pohon) {
                    setJenisPohon(data.jenis_pohon);
                }
                reset({
                    nama_pohon: data.nama_pohon || '',
                    keterangan: data.keterangan || '',
                    parent: data.parent || '',
                    pelaksana: data.pelaksana?.map((item: any) => ({
                        value: item.pegawai_id,
                        label: item.nama_pegawai,
                    })) || [],
                    indikator: data.indikator?.map((item: indikator) => ({
                        nama_indikator: item.nama_indikator,
                        targets: item.targets.map((t: target) => ({
                            target: t.target,
                            satuan: t.satuan,
                        })),
                    })),
                });
                setPelaksana(
                    data.pelaksana?.map((item: any) => ({
                        value: item.pegawai_id,
                        label: item.nama_pegawai,
                    })) || []
                );
                replace(data.indikator.map((item: indikator) => ({
                    indikator: item.nama_indikator,
                    targets: item.targets,
                })));
            } catch (err) {
                console.error(err, 'gagal mengambil data sesuai id pohon')
            } finally {
                setProsesDetail(false);
            }
        }
        fetchDetailPohon();
    }, [id, reset, token, replace]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const pelaksanaIds = Pelaksana?.map((pelaksana) => ({
            pegawai_id: pelaksana.value, // Ubah `value` menjadi `pegawai_id`
        })) || [];
        const formData = {
            //key : value
            nama_pohon: data.nama_pohon,
            Keterangan: data.keterangan,
            jenis_pohon: JenisPohon,
            level_pohon: level,
            parent: Number(Parent),
            pelaksana: pelaksanaIds,
            tahun: Tahun?.value?.toString(),
            kode_opd: KodeOpd,
            ...(data.indikator && {
                indikator: data.indikator.map((ind) => ({
                    indikator: ind.nama_indikator,
                    target: ind.targets.map((t) => ({
                        target: t.target,
                        satuan: t.satuan,
                    })),
                })),
            }),
        };
        // console.log(formData);
        try {
            setProses(true);
            const url = `/pohon_kinerja_opd/update/${id}`;
            const response = await fetch(`${API_URL}${url}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                AlertNotification("Berhasil", "Berhasil edit pohon", "success", 1000);
                const berhasil = true;
                const data = result.data;
                if (berhasil) {
                    EditBerhasil(data);
                }
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    };

    if (ProsesDetail) {
        return (
            <div className="tf-nc tf flex flex-col w-[600px] min-h-[400px] items-center justify-center rounded-lg shadow-lg shadow-slate-500">
                <LoadingSync />
            </div>
        )
    }

    return (
        <React.Fragment>
                <div className="tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg shadow-slate-500 form-edit-pohon">
                    <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black rounded-lg">
                        {level == 4 ?
                            <h1>Edit Strategic </h1>
                            :
                            level == 5 ?
                                <h1>Edit Tactical </h1>
                                :
                                level == 6 ?
                                    <h1>Edit Operational </h1>
                                    :
                                    <h1>Edit Operational N</h1>
                        }
                    </div>
                    <div className="flex justify-center my-3 w-full">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className='w-full'
                        >
                            <div className="flex flex-col py-3">
                                <label
                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                    htmlFor="nama_pohon"
                                >
                                    {level == 1 &&
                                        "Sub Tematik"
                                    }
                                    {level == 2 &&
                                        "Sub Sub Tematik"
                                    }
                                    {level == 3 &&
                                        "Super Sub Tematik"
                                    }
                                    {level == 4 &&
                                        "Strategic"
                                    }
                                    {level == 5 &&
                                        "Tactical"
                                    }
                                    {level == 6 &&
                                        "Operational"
                                    }
                                </label>
                                <Controller
                                    name="nama_pohon"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="nama_pohon"
                                            type="text"
                                            maxLength={255}
                                            placeholder="masukkan Pohon"
                                            value={field.value || NamaPohon}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setNamaPohon(e.target.value);
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            <label className="uppercase text-base font-bold text-sky-700 my-2">
                                {level == 4 ?
                                    <h1>Indikator Strategic :</h1>
                                    :
                                    level == 5 ?
                                        <h1>Indikator Tactical :</h1>
                                        :
                                        level == 6 ?
                                            <h1>Indikator Operational :</h1>
                                            :
                                            <h1>Indikator Operational N :</h1>
                                }
                            </label>
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex flex-col my-2 py-2 px-5 border border-sky-700 rounded-lg">
                                    <Controller
                                        name={`indikator.${index}.nama_indikator`}
                                        control={control}
                                        defaultValue={field.nama_indikator}
                                        render={({ field }) => (
                                            <div className="flex flex-col py-3">
                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                    Nama Indikator {index + 1} :
                                                </label>
                                                <input
                                                    {...field}
                                                    maxLength={255}
                                                    className="border px-4 py-2 rounded-lg"
                                                    placeholder={`Masukkan nama indikator ${index + 1}`}
                                                />
                                            </div>
                                        )}
                                    />
                                    {field.targets.map((_, subindex) => (
                                        <div key={subindex}>
                                            <Controller
                                                name={`indikator.${index}.targets.${subindex}.target`}
                                                control={control}
                                                defaultValue={_.target}
                                                render={({ field }) => (
                                                    <div className="flex flex-col py-3">
                                                        <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                            Target :
                                                        </label>
                                                        <input
                                                            {...field}
                                                            type="text"
                                                            className="border px-4 py-2 rounded-lg"
                                                            placeholder="Masukkan target"
                                                        />
                                                    </div>
                                                )}
                                            />
                                            <Controller
                                                name={`indikator.${index}.targets.${subindex}.satuan`}
                                                control={control}
                                                defaultValue={_.satuan}
                                                render={({ field }) => (
                                                    <div className="flex flex-col py-3">
                                                        <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                            Satuan :
                                                        </label>
                                                        <input
                                                            {...field}
                                                            className="border px-4 py-2 rounded-lg"
                                                            placeholder="Masukkan satuan"
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    ))}
                                    {index >= 0 && (
                                        <ButtonRedBorder
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="w-[200px] my-3"
                                        >
                                            Hapus
                                        </ButtonRedBorder>
                                    )}
                                </div>
                            ))}
                            <ButtonSkyBorder
                                className="flex items-center gap-1 mb-3 mt-2 w-full"
                                type="button"
                                onClick={() => append({ nama_indikator: "", targets: [{ target: "", satuan: "" }] })}
                            >
                                <TbCirclePlus />
                                Tambah Indikator
                            </ButtonSkyBorder>
                            <div className="flex flex-col pb-3 pt-1 border-t-2">
                                <label
                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                    htmlFor="keterangan"
                                >
                                    Keterangan:
                                </label>
                                <Controller
                                    name="keterangan"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="keterangan"
                                            placeholder="masukkan keterangan"
                                            value={field.value || Keterangan}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setKeterangan(e.target.value);
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            <ButtonSky type="submit" className="w-full my-3" disabled={Proses}>
                                {Proses ?
                                    <span className="flex items-center gap-1 ">
                                        <LoadingButtonClip />
                                        Menyimpan...
                                    </span>
                                    :
                                    <span className="flex items-center gap-1 ">
                                        <TbDeviceFloppy />
                                        Menyimpan...
                                    </span>
                                }
                            </ButtonSky>
                            <ButtonRed className="flex items-center gap-1 w-full my-3" onClick={onCancel}>
                                <TbCircleX />
                                Batal
                            </ButtonRed>
                        </form>
                    </div>
                </div>
            
        </React.Fragment>
    );
};
