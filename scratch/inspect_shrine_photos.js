import fs from 'fs';

const files = [
  'karbala_img_37_Karbala_City_1_jpg.jpg',
  'karbala_img_28_Imam_Hussain_jpg.jpg',
  'karbala_img_30_Karbala__Iraq_jpg.jpg',
  'karbala_img_13_Imam_Husayn_and_abbas_Shrine_in_Kar.jpg',
  'shrine_27.jpg',
  'shrine_22.jpg',
  'shrine_38.jpg',
  'karbala_img_0_Beyn-_l_H_r_meyn__K_rb_la_jpg.jpg'
];

for (const file of files) {
  const p = 'client/assets/images/' + file;
  if (fs.existsSync(p)) {
    const s = fs.statSync(p);
    // Read header to get jpeg dimensions
    const buf = fs.readFileSync(p);
    let width = 0, height = 0;
    for (let i = 0; i < buf.length - 8; i++) {
      if (buf[i] === 0xFF && (buf[i+1] === 0xC0 || buf[i+1] === 0xC2)) {
        height = buf.readUInt16BE(i + 5);
        width = buf.readUInt16BE(i + 7);
        break;
      }
    }
    console.log(`${file}: ${width}x${height} (${(s.size/1024).toFixed(0)} KB)`);
  }
}
