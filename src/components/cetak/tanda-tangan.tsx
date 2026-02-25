import { View, Text, StyleSheet } from '@react-pdf/renderer';

interface TTD {
  nama: string | null;
  nip: string | null;
  pihak: string;
  tanggal: boolean;
}

const styles = StyleSheet.create({
  // Gaya untuk container utama (mirip flex flex-col justify-center text-center)
  container: {
    flexDirection: 'column', // 'flex-col'
    justifyContent: 'center', // 'justify-center' (vertikal karena flexDirection: 'column')
    alignItems: 'center',     // 'text-center' (horizontal karena flexDirection: 'column')
    textAlign: 'center',      // Pastikan teks di dalam Text juga di tengah
  },
  // Gaya untuk tanggal (opacity)
  tanggalText: {
    fontSize: 11, // Atur ukuran font jika diperlukan
  },
  // Gaya untuk spasi kosong (mirip p-12)
  spacer: {
    padding: 35, // 12 unit Tailwind defaultnya 12 * 4 = 48px
  },
  // Gaya untuk teks di bagian bawah (nama dan NIP)
  bottomTextContainer: {
    justifyContent: 'center',
    textAlign: 'center', // Agar teks di dalamnya tetap di tengah
  },
  nameText: {
    textTransform: 'uppercase', // 'uppercase'
    fontSize: 12, // 'text-base' (kira-kira)
    fontWeight: 'bold', // 'font-bold'
    textDecoration: 'underline', // 'underline'
    marginBottom: 2, // Spasi antara nama dan NIP jika diperlukan
  },
  nipText: {
    textTransform: 'uppercase', // 'uppercase'
    fontSize: 11, // 'text-base'
    fontWeight: 'bold', // 'font-bold'
  },
  // Gaya untuk opacity, akan diterapkan secara kondisional
  opacityZero: {
    opacity: 0,
  },
  opacityFull: {
    opacity: 1,
  },
  fontBold: {
    fontWeight: 'bold',
  },
  formatKota: {
    fontSize: 14,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

const TTD: React.FC<TTD> = ({ pihak, nama, nip, tanggal }) => {

  const today = new Date();

  const year = today.getFullYear(); // Contoh: 2025
  const month_number = today.getMonth() + 1; // Contoh: 7 (untuk Juli)
  let month_string = ""
  switch (month_number) {
    case 1:
      month_string = "Januari";
      break;
    case 2:
      month_string = "Februari";
      break;
    case 3:
      month_string = "Maret";
      break;
    case 4:
      month_string = "April";
      break;
    case 5:
      month_string = "Mei";
      break;
    case 6:
      month_string = "Juni";
      break;
    case 7:
      month_string = "Juli";
      break;
    case 8:
      month_string = "Agustus";
      break;
    case 9:
      month_string = "September";
      break;
    case 10:
      month_string = "Oktober";
      break;
    case 11:
      month_string = "November";
      break;
    case 12:
      month_string = "Desember";
      break;
    default:
      month_string = "Bulan tidak valid";
  }
  const day = today.getDate(); // Contoh: 21

  const formattedDate = `${day} ${month_string} ${year}`; // "21/7/2025" (format DD/MM/YYYY)

  const namaKota = process.env.NEXT_PUBLIC_CLIENT_NAME || "";

  return (
    <View style={styles.container}>
      <Text style={[styles.formatKota, styles.tanggalText, tanggal ? styles.opacityFull : styles.opacityZero]}>
        {namaKota.toLowerCase()}, {formattedDate}
      </Text>
      <Text style={[styles.tanggalText, styles.fontBold]}>{pihak || "pihak"},</Text>

      <View style={styles.spacer}></View> {/* Spasi kosong */}

      <View style={styles.container}>
        <Text style={styles.nameText}>{nama || "-"}</Text>
        <Text style={styles.nipText}>NIP {nip || "-"}</Text>
      </View>
    </View>
  );
}


export default TTD;
