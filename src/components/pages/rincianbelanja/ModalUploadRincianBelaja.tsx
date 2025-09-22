'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonSkyBorder, ButtonRed, ButtonRedBorder } from '@/components/global/Button';
import { getToken, getUser, getPeriode } from "@/components/lib/Cookie";
import Select from "react-select";
import { AlertNotification } from "@/components/global/Alert";
import { TbUpload } from "react-icons/tb";
import { useBrandingContext } from "@/context/BrandingContext";
import Modal from "@/components/global/Modal";
import { LoadingButtonClip2 } from "@/components/global/Loading";

interface modal {
    isOpen: boolean;
    onClose: () => void;
    user_id: string;
    kode_opd: string;
    tahun: string;
    kode_subkegiatan: string;
    nama_pegawai: string;
    onSuccess: () => void;
}
interface FormValue {
    file: File[];
    user_id: string;
    tahun: string;
    nama?: string;
    kode_opd: string;
    kode_subkegiatan: string;
}

export const ModalUploadRincianBelanja: React.FC<modal> = ({ isOpen, onClose, user_id, kode_opd, nama_pegawai, tahun, kode_subkegiatan, onSuccess }) => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValue>();

    const [Proses, setProses] = useState<boolean>(false);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const url_pdf = "https://kab-bontang-upload.zeabur.app"
        const formData = new FormData();

        formData.append('file', data.file[0]);
        formData.append('user_id', user_id);
        formData.append('tahun', tahun);
        formData.append('nama', nama_pegawai);
        formData.append('kode_opd', kode_opd);
        formData.append('kode_subkegiatan', kode_subkegiatan);

        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${url_pdf}/upload`, {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (response.ok) {
                // console.log(result);
                AlertNotification("Berhasil", "file berhasil di upload", "success", 2000);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                console.log(result);
                AlertNotification("Gagal", `${result}`, "error", 2000);
            }
        } catch (err) {
            console.error(err);
            AlertNotification("Gagal", "cek koneksi internet, terdapat kesalahan server/backend, jika terus berlanjut hubungi tim developer", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    const handleClose = () => {
        onClose();
        reset();
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <Modal onClose={onClose} isOpen={isOpen} className="w-3/5">
                <div className="w-max-[500px] py-2 border-b">
                    <h1 className="text-xl uppercase text-center">Upload File Rincian Belanja</h1>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="file"
                        >
                            File PDF:
                        </label>
                        <Controller
                            name="file"
                            rules={{ required: "file harus terisi" }}
                            control={control}
                            render={({ field: { onBlur, onChange, ref } }) => (
                                <input
                                    className="border px-4 py-2 rounded-lg"
                                    id="file"
                                    onChange={(e) => onChange(e.target.files)}
                                    type="file"
                                    onBlur={onBlur}
                                    ref={ref}
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-2 my-3">
                        <ButtonSky className="w-full" type="submit" disabled={Proses}>
                            {Proses ?
                                <span className="flex items-center gap-1">
                                    <LoadingButtonClip2 />
                                    Uploading...
                                </span>
                                :
                                <span className="flex items-center gap-1">
                                    <TbUpload />
                                    Upload
                                </span>
                            }
                        </ButtonSky>
                        <ButtonRed className="w-full" onClick={handleClose}>
                            Batal
                        </ButtonRed>
                    </div>
                </form>
            </Modal>
        )
    }
}