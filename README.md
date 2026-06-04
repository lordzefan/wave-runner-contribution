# 🌌 Wave Runner

> Visualizer SVG bertema cyberpunk untuk GitHub Profile README dengan animasi parallax wave, stereo equalizer, dan glitch effect.

## Deskripsi Proyek

**Wave Runner** adalah generator animasi SVG yang dirancang sebagai alternatif dari animasi GitHub Snake yang populer. Proyek ini menghasilkan visualisasi bergaya audio spectrum dengan nuansa cyberpunk yang dapat digunakan pada GitHub Profile maupun repository README.

Animasi dibuat sepenuhnya menggunakan **SVG native animation**, sehingga tidak memerlukan JavaScript saat ditampilkan di GitHub dan tetap ringan untuk di-render.

Wave Runner menggabungkan:
- 🌊 Parallax Wave Animation
- 🎚 Stereo Equalizer (Bass & Treble Behavior)
- ⚡ Random Glitch Spike Effect
- 🎨 Cyberpunk Gradient Theme
- 💡 Neon Glow Visual
- 📺 CRT Scanline Overlay
- 🔄 GitHub Actions Automation

## Fitur Utama

### 🌊 Parallax Wave

Terdiri dari beberapa layer gelombang yang bergerak dengan kecepatan berbeda sehingga menciptakan efek kedalaman (depth) seperti visualizer musik modern.

### 🎚 Stereo Equalizer

Equalizer dibagi menjadi tiga area:

- **Left Channel (Bass)** → Gerakan lebih lambat dan tinggi.
- **Center Channel** → Kombinasi bass dan treble.
- **Right Channel (Treble)** → Gerakan lebih cepat dan dinamis.

Setiap bar memiliki pola animasi dan kecepatan yang berbeda sehingga tidak terlihat monoton.

### ⚡ Random Glitch System

Efek glitch dibuat menggunakan animasi SVG independen pada setiap bar, menghasilkan spike dan flicker acak yang memperkuat nuansa cyberpunk.

### 🎨 Cyberpunk Style

Menggunakan palet warna neon dengan kombinasi:

- Neon Pink
- Electric Purple
- Cyan Blue

ditambah efek glow dan scanline untuk menghasilkan tampilan futuristik.

## Teknologi yang Digunakan

- Node.js
- JavaScript
- SVG Animation
- GitHub Actions

## Struktur Project

```text
wave-runner-contribution/
│
├── .github/
│   └── workflows/
│       └── build.yml
│
├── generate.js
├── output.svg
└── README.md
```

## Cara Menjalankan

Clone repository:

```bash
git clone https://github.com/lordzefan/wave-runner-contribution.git
cd wave-runner-contribution
```

Generate animasi SVG:

```bash
node generate.js
```

Hasil animasi akan dibuat pada file:

```text
output.svg
```

## Tujuan Proyek

Wave Runner dibuat untuk memberikan alternatif visual yang lebih artistik dibanding animasi contribution snake tradisional, dengan fokus pada:

- Tampilan modern dan futuristik
- Animasi yang ringan
- Mudah dikustomisasi
- Kompatibel dengan GitHub Profile README

## Pengembangan Selanjutnya

Beberapa fitur yang direncanakan untuk versi berikutnya:

- RGB Split Effect
- VHS Distortion Mode
- Multiple Theme Presets
- Custom Logo Support
- Dynamic Background Mode
- Advanced Cyberpunk HUD Elements

---

**Dibuat oleh:** LORDZEFAN
