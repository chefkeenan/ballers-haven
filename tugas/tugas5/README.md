# Tugas Individu 5

1. Jika terdapat beberapa CSS selector untuk suatu elemen HTML, jelaskan urutan prioritas pengambilan CSS selector tersebut!  

   - Dalam CSS, jika ada value !important maka itu akan selalu menjadi urutan yang paling prioritas, setelah itu berdasarkan selector yang paling specific, lalu selector ID (#id), setelah itu selector class/attribute/pseudo-class (.class, [attr]. :hover), dan yang terakhir dalah element/pseudo-element (h1, ::before).  

---

2. Mengapa responsive design menjadi konsep yang penting dalam pengembangan aplikasi web? Berikan contoh aplikasi yang sudah dan belum menerapkan responsive design, serta jelaskan mengapa!  

   - Responsive design sangat penting karena website/aplikasi harus bisa diakses dengan tampilan yang berbeda-beda tergantung device dan ukuran layer. Contoh aplikasi yang sudah menerapkan design yang responsive adalah Youtube. Youtube dapat diakses dengan display yang berbeda seperti dari handphone, laptop dan dengan ukuran layer yang berbeda. Saat tab youtubenya dikecilkan, aplikasinya uga menyesuaikan sesuai dengan ukurannya. Contoh aplikasi yang belum menerapkan design yang responsive mungkin aplikasi-aplikasi lama yang sudah ditinggal, missal hanya dapat dibuka di ukuran layer desktop tetapi tidak bisa dibuka di ukuran layer mobile.  

---

3. Jelaskan perbedaan antara margin, border, dan padding, serta cara untuk mengimplementasikan ketiga hal tersebut!  

   - Margin merupakan ruang atau jarak antar elemen dan elemen lainnya. border merupakan lapisan paling luar suatu elemen, biasanya dalam bentuk garis jika visible, padding merupakan ruang atau jarak dari konten elemennya dengan bordernya. Cara mengimplementasikannya dapat dengan shorthand, seperti margin/border/padding: 20px (menetapkan 20px untuk sisi atas kanan Bawah dan atas) atau dengan spesifik seperti margin-top/border-top/padding-top : 20px; yang menetapkan 20 px untuk sisi atasnya saja. Ini berlaku untuk margin, border, padding, dan berlaku juga spesifik sisinya.  

---

4. Jelaskan konsep flex box dan grid layout beserta kegunaannya!  

   - Flexbox dan grid merupakan system layout yang saling melengkapi. Flexbox bersifat satu dimensi, mengatur baris atau kolom sedangkan grid bersifat dua dimensi yang bisa mengatur baris dan kolom sekaligus. Flexbox lebih unggul digunakan untuk menyusun elemen di satu arah, sedangkan grid lebih unggul untuk placement element yang kompleks dan repetitive. Keduanya juga digunakan untuk membuat design yang responsif selain dari media query.  

---

5. Jelaskan bagaimana cara kamu mengimplementasikan checklist di atas secara step-by-step!  

   - Pada views.py, menambahkan fungsi edit_product dan delete_product  
   - Melakukan routing fungsi baru pada urls.py  
   - Mengonfigurasikan static files pada app djangonya agar bisa memasukkan foto pada file html  
   - Mengimplementasikan tailwind css pada setiap file html, dan juga ada beberapa css biasa  
   - Styling navbar dilakukan di base.html, styling display dan card product dilakukan di main.html  
