import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

interface NamaJabatan {
  nama: string | null;
  jabatan: string | null;
}

const styles = StyleSheet.create({
  // Gaya untuk setiap baris (mirip <tr>)
  container: {
    marginBottom: 10,
    marginLeft: 15,
    fontSize: 11,
    lineHeight: 1.5,
  },
  tableRow: {
    flexDirection: 'row', // Mengatur item dalam baris secara horizontal
    marginBottom: 2, // Memberi sedikit spasi antar baris
  },
  // Gaya untuk kolom pertama (mirip <td> dengan className="k-1")
  column1: {
    width: 80, // Sesuaikan lebar sesuai kebutuhan, ini adalah contoh
    paddingRight: 10, // pr-4, disesuaikan
  },
  // Gaya untuk kolom kedua (mirip <td> dengan className="k-2")
  column2: {
    width: 10, // Lebar untuk kolon ":"
    paddingRight: 5, // pr-1, disesuaikan
  },
  // Gaya untuk kolom ketiga (mirip <td> dengan className="k-3")
  column3: {
    flexGrow: 1, // Mengambil sisa ruang yang tersedia
  },
  // Gaya tambahan
  uppercase: {
    textTransform: 'uppercase',
  },
  bold: {
    fontWeight: 'bold',
  },
});

const NamaJabatan: React.FC<NamaJabatan> = ({ nama, jabatan }) => (
  <View style={styles.container}> {/* Menggantikan <tbody> */}
    <View style={styles.tableRow}> {/* Menggantikan <tr> */}
      <Text style={styles.column1}>Nama</Text> {/* Menggantikan <td className="k-1 pr-4"> */}
      <Text style={styles.column2}>:</Text> {/* Menggantikan <td className="k-2 pr-1"> */}
      <Text style={[styles.column3, styles.uppercase, styles.bold]}>{nama || "-"}</Text> {/* Menggantikan <td className="k-3 uppercase font-bold"> */}
    </View>
    <View style={styles.tableRow}> {/* Menggantikan <tr> */}
      <Text style={styles.column1}>Jabatan</Text> {/* Menggantikan <td className="k-1 pr-4"> */}
      <Text style={styles.column2}>:</Text> {/* Menggantikan <td className="k-2 pr-1"> */}
      <Text style={[styles.column3, styles.uppercase]}>{jabatan || "-"}</Text> {/* Menggantikan <td className="k-3 uppercase"> */}
    </View>
  </View>
);

export default NamaJabatan;
