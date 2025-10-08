# Tugas Individu 6

## Apa perbedaan antara synchronous request dan asynchronous request?
- Pada synchronous request, proses komunikasi antara klien dan server berjalan secara berurutan. Artinya, browser akan menunggu respons dari server sebelum dapat melakukan tindakan lain. Hal ini menyebabkan tampilan website tampak terhenti sampai data selesai diterima.

- Sedangkan pada asynchronous request, seperti pada AJAX, browser tidak perlu menunggu respons untuk melanjutkan aktivitas lainnya. Permintaan dikirim di latar belakang, dan ketika server sudah merespons, hasilnya baru ditampilkan melalui JavaScript. Pendekatan ini membuat website lebih responsif dan interaktif.

## Bagaimana AJAX bekerja di Django (alur request–response)?
Alur kerja AJAX di Django dimulai dari sisi frontend (JavaScript).

1. JavaScript menggunakan fetch() atau XMLHttpRequest untuk mengirim permintaan ke URL tertentu di Django.
2. Django menerima permintaan tersebut melalui urls.py dan meneruskannya ke views.py, biasanya menggunakan JsonResponse untuk mengembalikan data dalam format JSON.
3. JavaScript kemudian menerima respons JSON dari server dan memperbarui tampilan halaman (DOM) tanpa melakukan reload

## Apa keuntungan menggunakan AJAX dibandingkan render biasa di Django?
- AJAX dapat memperbarui tampilah halaman tanpa reload full halamannya, bandwidthnya lebih hemat karena hanya data yang diubah saja yang dikirim dan diterima, dan memberikan pengalaman user yang lebih baik melalui live update, notifikasi, atau loading state.

## Bagaimana cara memastikan keamanan saat menggunakan AJAX untuk fitur Login dan Register di Django?
- Gunakan CSRF Protection bawaan Django
- Gunakan HTTPS, supaya data kredensial terenkripsi saat dikirim.
- Validasi input di server, jangan hanya mengandalkan validasi JavaScript.
- Gunakan cookie yang aman dengan atribut HttpOnly, Secure, dan SameSite.

## Bagaimana AJAX mempengaruhi pengalaman pengguna (User Experience) pada website?
- Implementasi AJAX secara signifikan meningkatkan User Experience (UX). Pengguna tidak lagi harus menunggu halaman dimuat ulang untuk setiap aksi seperti menambah, mengedit atau menghapus data. Website terasa lebih cepat, interaktif, dan dinamis karena konten dapat diperbarui secara real time.
