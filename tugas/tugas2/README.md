## Tugas Individu 2

### Step-by-step implementasi checklist
1. **Membuat sebuah proyek Django baru**
   - Membuat virtual environment pada direktori utama proyeknya dengan:
     ```bash
     python -m venv env
     ```
   - Masukkan `requirements.txt` yang ada pada tutorial lalu menginstallnya
   - Lalu jalankan:
     ```bash
     django-admin startproject ballers_haven
     ```

2. **Membuat aplikasi dengan nama main pada proyek tersebut**
   - Jalankan command:
     ```bash
     python manage.py startapp main
     ```
   - Tambahkan `"main"` pada list `INSTALLED_APPS` pada `settings.py`

3. **Melakukan routing pada proyek agar dapat menjalankan aplikasi main**
   - Di `ballers_haven/urls.py` import `include` dan tambahkan `include('main.urls')` di path list `urlpatterns`

4. **Membuat model pada aplikasi main dengan nama Product**
   - Membuat class baru yang bernama `Product` di `main/models.py` lalu tambahkan attribute yang diperlukan
   - Saya menambahkan attribute: `name`, `price`, `description`, `stock`, `thumbnail`, `category`, dan `is_featured`

5. **Membuat sebuah fungsi pada views.py untuk dikembalikan ke dalam sebuah template HTML**
   - Menambahkan fungsi `home(request)` di dalam `main/views.py` yang isinya akan mereturn:
     ```python
     render(request, 'home.html')
     ```
     untuk merender file html yang bernama `home.html` pada `main/templates`

6. **Membuat sebuah routing pada urls.py aplikasi main**
   - Di `main/urls.py` tambahkan path untuk mengeksekusi fungsi di `views.py` di list `urlpatterns`

7. **Melakukan deployment ke PWS**
   - Membuat project baru pada website PWS
   - Menyesuaikan `settings.py` agar bisa deployment PWS (tambah `ALLOWED_HOSTS`, `INSTALLED_APPS`)
   - Push ke PWS

---

### Bagan request client

![HTTP Request](https://github.com/user-attachments/assets/355a3746-f74d-4a3d-9132-b7ec068de692)

- User akan mengirim HTTP request, lalu dalam `urls.py` akan dirouting dengan url yang sesuai.
- Jika ditemukan path url yang sesuai, maka akan dilanjutkan ke fungsi yang sesuai di `views.py`.
- `views.py` akan berintegrasi dengan `models.py` (sebagai representasi database) dan `template.html` (sebagai tampilan front-end).
- `views.py` akan mengambil database yang diperlukan dari `models.py` lalu databasenya akan disesuaikan dengan template html untuk ditampilkan.
- Setelah selesai, Django akan mengirimkan HTTP response kembali ke user.

---

### Peran settings.py dalam proyek Django
- Peran `settings.py` adalah untuk menset up segala hal yang akan dan perlu digunakan untuk projek Django.
- Contoh: menambah `ALLOWED_HOSTS` untuk menambah host, dan `INSTALLED_APPS` untuk menambah aplikasi.

---

## Cara kerja migrasi database di Django
- Migration dalam Django adalah pemetaan class pada `models.py` untuk menjadi key dan value di database.
- Caranya adalah dengan mengeksekusi:
  ```bash
  python manage.py makemigrations
  python manage.py migrate
  ```

### Mengapa framework Django dijadikan permulaan pembelajaran pengembangan perangkat lunak
- Mungkin karena python termasuk salahsatu bahasa pemrograman yang mudah dimengerti.
- Lalu juga Django sudah banyak menyediakan build-in programs yang bisa langsung kita gunakan sehingga tidak perlu menghardcodenya secara manual, contohnya seperti Django admin.

 Asdosnya mantap gacor gercep nilainya