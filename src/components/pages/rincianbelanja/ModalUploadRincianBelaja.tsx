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
    id?: string;
    onSuccess: () => void;
}
interface FormValue {
    anggaran: number;
    file: File;
}

export const ModalUploadRincianBelanja: React.FC<modal> = ({ isOpen, onClose, id, onSuccess }) => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValue>();

    const [Proses, setProses] = useState<boolean>(false);
    const [LoadingOption, setLoadingOption] = useState<boolean>(false);
    
    const [User, setUser] = useState<any>(null);
    const token = getToken();
    const { branding } = useBrandingContext();

    useEffect(() => {
        const fetchUser = getUser();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
    }, []);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL_PERMASALAHAN;
        const formData = {
            //key : value
            anggaran: data.anggaran,
            file: data.file
        };
        console.log(formData);
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
                            control={control}
                            render={({ field: {onBlur, onChange, ref} }) => (
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
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="anggaran"
                        >
                            Total Anggaran (Rp.):
                        </label>
                        <Controller
                            name="anggaran"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="anggaran"
                                    type="text"
                                    placeholder="masukkan Total Pagu Anggaran di sub kegiatan ini"
                                    onChange={(e) => {
                                        field.onChange(e);
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-2 my-3">
                        <ButtonSky className="w-full" type="submit" disabled={Proses}>
                            {Proses ?
                                <span className="flex">
                                    <LoadingButtonClip2 />
                                    Uploading...
                                </span>
                                :
                                "Upload"
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