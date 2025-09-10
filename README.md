# Baller's Haven
Deployment link: https://ahmad-keenan-ballershaven.pbp.cs.ui.ac.id/

## Tugas Individu 2
### Step-by-step implementasi checklist
1. **Membuat sebuah proyek Django baru**  
   - Membuat virtual environment pada direktori utama proyeknya dengan `python -m venv env`
   - Masukkan requirements.txt yang ada pada tutorial lalu menginstallnya
   - Lalu jalankan `django-admin startproject ballers_haven

2. **Membuat aplikasi dengan nama main pada proyek tersebut**
   - Jalancan command `python manage.py startapp main`
   - Tambahkan "main" pada list INSTALLED APPS pada settings.py

3. **Melakukan routing pada proyek agar dapat menjalankan aplikasi main**
   - Di ballers_haven/urls.py import include dan tambahkan include('main.urls) di path list urlpatternsnya


4. **Membuat model pada aplikasi main dengan nama Product**
   - Membuat class baru yang bernama Product di main/models.py lalu tambahkan attribute yang diperlukan
   - Saya menambahkan attribute name, price, description, stock, thumbnail, category, dan is_featured

5. **Membuat sebuah fungsi pada views.py untuk dikembalikan ke dalam sebuah template HTML**
   - Menambahkan fungsi home(request) di dalam main/views.py yang isinya akan mereturn `render(request, 'home.html')` untuk merender file html yang bernama home pada main/template

6. **Membuat sebuah routing pada urls.py aplikasi main**
   - Di main/urls.py tambahkan path untuk mengeksekusi fungsi di views.py di list urlpatterns

7. **Melakukan deployment ke PWS**
   - Membuat project baru pada website PWSnya
   - Menyesuaikan settings.py agar bisa deployment PWS (tambah allowedhost, installedapps)
   - Push ke PWSnya

### Bagan request client

![HTTP Request](https://github.com/user-attachments/assets/355a3746-f74d-4a3d-9132-b7ec068de692)<img width="1919" height="1079" />

  - User akan mengirim HTTP request, lalu dalam urls.py akan di routing request dengan url yang sesuai. Jika ditemukan path url yang sesuai, maka akan dilanjutkan ke fungsi yang sesuai di views.py. Disini views akan berintegrasi dengan models.py dan template.html, models.py akan berfungsi sebagai representasi database dan template.html ini sebagai tampilan front-end. Views.py akan mengambil database yang diperlukan dari models.py lalu databasenya akan disesuaikan dengan template html untuk ditampilkan. Setelah selesai pekerjaan model-view-template, Django akan mengirimkan HTTP response kembali ke user.

### Peran settings.py dalam proyek Django
  - Peran settings.py adalah untuk menset up segala hal yang akan dan perlu digunakan untuk projek Djangonya nanti. Seperti menambah allowedhost untuk menambah host, dan installedapps untuk menambah aplikasi sendiri.

## Cara kerja migrasi database di Django
  - Migration dalam Django adalah pemetaan class pada models.py untuk menjadi key dan value di database
  - Caranya adalah dengan `mengeksekusi python manage.py makemigrations` dan `python manage.py migrate`

### Mengapa framework Django dijadikan permulaan pembelajaran pengembangan perangkat lunak
  - Mungkin karena python termasuk salahsatu bahasa pemrograman yang mudah dimengerti, lalu juga Django sudah banyak menyediakan build-in programs yang bisa langsung kita gunakan sehingga tidak perlu menghardcodenya secara manual, contohnya seperti Django admin.

Asdosnya mantap gacor gercep nilainya
