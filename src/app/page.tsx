'use client'

import React, { useState, useEffect } from "react";
import { getUser } from "@/components/lib/Cookie";
import Link from "next/link";
import { TbDownload, TbBook2 } from "react-icons/tb";
import { ButtonSky } from "@/components/global/Button";

const Dashboard = () => {

  const [User, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = getUser();
    if (fetchUser) {
      setUser(fetchUser.user);
    }
  }, [])

  const manual_user = process.env.NEXT_PUBLIC_LINK_MANUAL_USER;

  return (
    <div className="flex flex-col gap-2">
      <h1 className="p-5 rounded-xl border border-emerald-500">Selamat Datang, {User?.nama_pegawai ? User?.nama_pegawai : 'di halaman dashboard'}</h1>
      <div className="flex items-center justify-between gap-2 p-5 rounded-xl border border-sky-500">
        <h1 className="flex items-center gap-2">
          <TbBook2 className="font-bold text-4xl rounded-full p-1 border border-black" />
          Download Panduan Website (Manual User)
        </h1>
        <Link
          href={manual_user || "https://drive.google.com/drive/folders/1xFqVRchn8eCRtMLhWvqSb78qDxTXB9Y1?usp=sharing"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ButtonSky className="flex items-center gap-2">
            <TbDownload />
            Download
          </ButtonSky>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard;