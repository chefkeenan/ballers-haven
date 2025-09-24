# Tugas Individu 4

---

## 1. Apa itu Django AuthenticationForm? Jelaskan juga kelebihan dan kekurangannya.

Django AuthenticationForm adalah form yang sudah built-in di Djangonya. Dari sananya sudah bisa menangani login dan memvalidasi username dan password.

**Kelebihan**  
- Bawaan dari Django sehingga siap dan mudah dipakai  
- Sudah terimplementasi protection sederhana yang memadai  

**Kekurangan**  
1. Fieldnya hanya terbatas pada username & password  
2. Tidak mendukung fitur ekstra lainnya seperti login dengan OTP, login via social media  

---

## 2. Apa perbedaan antara autentikasi dan otorisasi? Bagaimana Django mengimplementasikan kedua konsep tersebut?

**Autentikasi** adalah proses yang memverifikasi identitas user.  
Misal seperti mengecek apakah passwordnya sesuai dengan usernamenya.  

**Otorisasi** adalah proses yang menentukan hak akses user setelah berhasil diautentikasi.  
Misal seperti suatu user hanya bisa mengedit produknya sendiri tetapi tidak produk user lain.  

**Implementasi di Django**:  
- **Autentikasi**:  
  - Form bawaan seperti `AuthenticationForm`, `UserCreationForm`  
  - Fungsi `login()` / `logout()` untuk mengelola session user  
  - Fungsi `authenticate()` untuk memastikan username dan password valid atau tidak  

- **Otorisasi**:  
  Menggunakan decorators & mixins:  
  - `@login_required`, hanya user yang login bisa akses view  
  - `@permission_required()`, hanya user dengan izin tertentu yang bisa akses  

---

## 3. Apa saja kelebihan dan kekurangan session dan cookies dalam konteks menyimpan state di aplikasi web?

**Session**  
- **Kelebihan**:  
  - Lebih aman karena data utama disimpan di server dan client hanya punya session ID  
  - Dapat menyimpan data besar/kompleks  
- **Kekurangan**:  
  - Dapat membebani server karena semua data session disimpan di database server  

**Cookies**  
- **Kelebihan**:  
  - Mudah digunakan untuk menyimpan preferensi user  
  - Tidak membebani server karena data disimpan di browser  
- **Kekurangan**:  
  - Ukuran terbatas, maksimal 4kb per cookie  
  - Keamanan rendah, tidak cocok untuk data sensitif  

---

## 4. Apakah penggunaan cookies aman secara default dalam pengembangan web, atau apakah ada risiko potensial yang harus diwaspadai? Bagaimana Django menangani hal tersebut?

Penggunaan cookies tidak sepenuhnya aman secara default karena berisiko terhadap seperti XSS, CSRF, atau session hijacking. Oleh karena itu, cookies perlu dilindungi.  

**Django menangani hal ini dengan hal berikut**:  
- Mengaktifkan HttpOnly secara default agar cookie tidak bisa diakses via JavaScript  
- Memberikan proteksi CSRF melalui `csrf_token`  
- Menyimpan data sensitif di server (session), sementara cookie hanya menyimpan session ID  

---

## 5. Jelaskan bagaimana cara kamu mengimplementasikan checklist di atas secara step-by-step

1. **Menambahkan forms bawaan yang diperlukan**  
   - Menambahkan `AuthenticationForm` dan `UserCreationForm`  

2. **Menambahkan fungsi yang diperlukan**  
   - Saya menambahkan fungsi `register()`, `login_user()`, dan `logout_user()` di `views.py`  
   - Fungsi-fungsi tersebut memerlukan untuk membuat file HTML baru untuk register dan login sehingga pada templates ditambahkan `register.html` dan `login.html`  
   - Menambahkan cookie `last_login` untuk menyimpan waktu terakhir user login  

3. **Menghubungkan elemen yang telah dibuat**  
   - Routing di `urls.py`  
   - Menghubungkan model `Product` dengan `User` pada `models.py` sehingga 1 User bisa memiliki banyak Product (relasi one-to-many)  

4. **Commit, push ke GitHub dan ke PWS**  
