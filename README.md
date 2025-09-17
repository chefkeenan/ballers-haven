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


## Tugas Individu 3

1. **Mengapa kita memerlukan data delivery dalam pengimplementasian sebuah platform**
   - Kita memerlukan data delivery dalam sebuah platform karena akan selalu terjadi pertukaran data dalam proses penggunaannya. Data dapat bergerak dari penyimpanan, diproses, dan sampai ke tempat yang ditujui baik itu bisa dari user ke databasenya, maupun dari database ke user atau bahkan pertukaran data antar komponen lainnya.

2. **Mana yang lebih baik antara XML dan JSON? Mengapa JSON lebih populer dibandingkan XML**
   - Banyak yang menganggap bahwa JSON lebih baik daripada XML karena formatnya lebih sederhana. Struktur key-valuenya mudah dibaca dan didukung hampir semua bahasa pemrograman sehingga lebih mudah untuk memparsing data. Sedangkan, XML memiliki format penyajian data yang lebih kompleks, sehingga ukuran datanya lebih panjang daj lebih sulit untuk diparsing. Menurut saya, JSON lebih baik daripada XML karena lebih mudah digunakan dalam banyak aspek, sedangkan XML digunakan untuk beberapa kasus spesifik yang memerlukan struktur dokumen yang kompleks.

3. **Jelaskan fungsi dari method is_valid() pada form Django dan mengapa kita membutuhkan method tersebut**
   - Di dalam Django, method `is_valid()` digunakan untuk validasi data yang dikirim oleh pengguna melalui request. Method ini akan memeriksa apakah semua field dalam form sudah diisi sesuai aturan yang ditentukan atau belum. Misalnya seperti tipe data, wajib diisi atau tidak, panjang minimal/maksimal dan lainnya. Ketika selesai dicek, akan mengembalikan True jika datanya valid dan False jika datanya tidak valid.
     Sebelum diproses di database, harus dicek dulu apakah datanya aman dan memenuhi aturan.

4. **Mengapa kita membutuhkan csrf_token saat membuat form di Django? Apa yang dapat terjadi jika kita tidak menambahkan csrf_token pada form Django? Bagaimana hal tersebut dapat dimanfaatkan oleh penyerang?**
   - Pada Django, csrf_token dibuthkan untuk melindungi aplikasi dari CSRF, yaitu Cross-Site Request Forgeri. Ini merupakan token yang disisipkan pada setiap form HTML dan akan diverifikasi ulang saat form dikirim ke server.
  
   - Jika kita tidak menambahkan csrf_token, maka form menjadi rentan terhadap serangan CSRF. Penyerang bisa membuat halaman berbahaya, yang berisi form tersembunyi yang mengarah ke aplikasi tika. Jadi ketika user yang sedang login membuka halaman itu, browsernya akan mengirim cookie ke server kita sehingga seolah-olah user mengirim form asli. Akibatnya adalah penyerang bisa memanfaatkan user authentication untuk melakukan tindakan tanpa sepengetahuan usernya.
  
5. ## #Step-by-step implementasi checklist
   1. **Membuat ProductForm**
      - Membuat file `forms.py` di main
      - Mengimport Modelform dan model Product dari models.py
      - Membuat class Productform serta class metanya dan diisi fields yang diperlukan
   2. **Menambahkan function yang diperlukan di views.py untuk display htmlnya dan untuk data delivery**
      - Menambahkan function create_product, show_product, show_xml, show_json, show_xml_by_id, show_json_by_id
      - Memasukkan variabel Productform pada create_product karena ini akan menggunakan form untuk menambahkan produk
      - Memasukkan product_list di show_main dan show_product untuk di pass ke parameter render agar bisa di display datanya pada file-file html.
      - fungsi show_xml, show_json, show_xml_by_id, show_json_by_id untuk menambilkan database dalam format JSON dan XML
   3. **Routing di urls.py**
      - Menambahkan rute url untuk semua fungsi yang telah ditambah pada list urlspattern.
      - Saya menambahkan `path('create-product/', views.create_product, name='create_product'),
    path('product/<uuid:id>/', views.show_product, name='show_product'),
    path('xml/', views.show_xml, name='show_xml'),
    path('json/', views.show_json, name='show_json'),
    path('xml/<str:product_id>/', views.show_xml_by_id, name='show_xml_by_id'),
    path('json/<str:product_id>/', views.show_json_by_id, name='show_json_by_id'),`

4. **Membuat file-file html**
   - Saya menambahkan file `base.html`, `create_product.html`, `product_detail.html`

5. **Menguji datanya dengan tes di url nya dan di postman**
   - Menyesuaikan url dengan id barang yang telah di add, dan paste di postman

6. **Commit dan push ke github & PWS**


**Screenshot postman**

<img width="1919" height="1079" alt="Screenshot 2025-09-17 115738" src="https://github.com/user-attachments/assets/db045210-fd50-420d-b356-30f46d1d732a" />
<img width="1919" height="1079" alt="Screenshot 2025-09-17 115811" src="https://github.com/user-attachments/assets/1e7f5798-092b-4d9a-a0a5-6753a3130ab9" />
<img width="1918" height="1079" alt="Screenshot 2025-09-17 120027" src="https://github.com/user-attachments/assets/0dcc2776-4e1c-40d6-b2dd-40267d17d86f" />
<img width="1917" height="1079" alt="Screenshot 2025-09-17 120041" src="https://github.com/user-attachments/assets/fdc7690c-ecde-496d-941f-69a58fc33b09" />






