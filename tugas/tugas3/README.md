## Tugas Individu 3

1. **Mengapa kita memerlukan data delivery dalam pengimplementasian sebuah platform**
   - Kita memerlukan data delivery dalam sebuah platform karena akan selalu terjadi pertukaran data dalam proses penggunaannya.
   - Data dapat bergerak dari penyimpanan, diproses, dan sampai ke tempat yang ditujui baik itu bisa dari user ke databasenya, maupun dari database ke user atau bahkan pertukaran data antar komponen lainnya.

2. **Mana yang lebih baik antara XML dan JSON? Mengapa JSON lebih populer dibandingkan XML**
   - Banyak yang menganggap bahwa JSON lebih baik daripada XML karena formatnya lebih sederhana.
   - Struktur key-valuenya mudah dibaca dan didukung hampir semua bahasa pemrograman sehingga lebih mudah untuk memparsing data.
   - Sedangkan, XML memiliki format penyajian data yang lebih kompleks, sehingga ukuran datanya lebih panjang dan lebih sulit untuk diparsing.
   - Menurut saya, JSON lebih baik daripada XML karena lebih mudah digunakan dalam banyak aspek, sedangkan XML digunakan untuk beberapa kasus spesifik yang memerlukan struktur dokumen yang kompleks.

3. **Jelaskan fungsi dari method is_valid() pada form Django dan mengapa kita membutuhkan method tersebut**
   - Di dalam Django, method `is_valid()` digunakan untuk validasi data yang dikirim oleh pengguna melalui request.
   - Method ini akan memeriksa apakah semua field dalam form sudah diisi sesuai aturan yang ditentukan atau belum.
   - Misalnya seperti tipe data, wajib diisi atau tidak, panjang minimal/maksimal, dan lainnya.
   - Ketika selesai dicek, akan mengembalikan `True` jika datanya valid dan `False` jika datanya tidak valid.
   - Sebelum diproses di database, harus dicek dulu apakah datanya aman dan memenuhi aturan.

4. **Mengapa kita membutuhkan csrf_token saat membuat form di Django? Apa yang dapat terjadi jika kita tidak menambahkan csrf_token pada form Django? Bagaimana hal tersebut dapat dimanfaatkan oleh penyerang?**
   - Pada Django, `csrf_token` dibutuhkan untuk melindungi aplikasi dari CSRF, yaitu Cross-Site Request Forgery.
   - Ini merupakan token yang disisipkan pada setiap form HTML dan akan diverifikasi ulang saat form dikirim ke server.
   - Jika kita tidak menambahkan `csrf_token`, maka form menjadi rentan terhadap serangan CSRF.
   - Penyerang bisa membuat halaman berbahaya yang berisi form tersembunyi yang mengarah ke aplikasi kita.
   - Jadi ketika user yang sedang login membuka halaman itu, browsernya akan mengirim cookie ke server kita sehingga seolah-olah user mengirim form asli.
   - Akibatnya penyerang bisa memanfaatkan user authentication untuk melakukan tindakan tanpa sepengetahuan user.

5. **Step-by-step implementasi checklist**
   1. **Membuat ProductForm**
      - Membuat file `forms.py` di main
      - Mengimport `ModelForm` dan model `Product` dari `models.py`
      - Membuat class `ProductForm` serta class metanya dan diisi fields yang diperlukan
   2. **Menambahkan function yang diperlukan di views.py untuk display htmlnya dan untuk data delivery**
      - Menambahkan function `create_product`, `show_product`, `show_xml`, `show_json`, `show_xml_by_id`, `show_json_by_id`
      - Memasukkan variabel `ProductForm` pada `create_product` karena ini akan menggunakan form untuk menambahkan produk
      - Memasukkan `product_list` di `show_main` dan `show_product` untuk di-pass ke parameter render agar bisa ditampilkan di file-file html
      - Fungsi `show_xml`, `show_json`, `show_xml_by_id`, `show_json_by_id` untuk menampilkan database dalam format JSON dan XML
   3. **Routing di urls.py**
      - Menambahkan rute url untuk semua fungsi yang telah ditambah pada list `urlpatterns`
      - Saya menambahkan:
        ```python
        path('create-product/', views.create_product, name='create_product'),
        path('product/<uuid:id>/', views.show_product, name='show_product'),
        path('xml/', views.show_xml, name='show_xml'),
        path('json/', views.show_json, name='show_json'),
        path('xml/<str:product_id>/', views.show_xml_by_id, name='show_xml_by_id'),
        path('json/<str:product_id>/', views.show_json_by_id, name='show_json_by_id'),
        ```
   4. **Membuat file-file html**
      - Saya menambahkan file `base.html`, `create_product.html`, `product_detail.html`
   5. **Menguji datanya dengan tes di url nya dan di postman**
      - Menyesuaikan url dengan id barang yang telah di-add, dan paste di postman
   6. **Commit dan push ke github & PWS**

---

### Screenshot Postman

<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/db045210-fd50-420d-b356-30f46d1d732a" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/1e7f5798-092b-4d9a-a0a5-6753a3130ab9" width="400"></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/0dcc2776-4e1c-40d6-b2dd-40267d17d86f" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/fdc7690c-ecde-496d-941f-69a58fc33b09" width="400"></td>
  </tr>
</table>
