/**
 * toggleActiveClass
 *
 * Fungsi untuk menambahkan event listener `onclick` pada beberapa tombol yang
 * akan menambah atau menghapus kelas 'active' dari elemen-elemen yang ditentukan.
 * Fungsi callback opsional juga bisa dipanggil setelah toggle selesai.
 *
 * @param {Array<Object>} elements - Array yang berisi objek-objek dengan tombol
 *                                   dan elemen target yang terkait.
 * @param {HTMLElement} elements[].button - Elemen tombol yang akan memicu event `onclick`.
 * @param {HTMLElement} elements[].element - Elemen yang kelas 'active'-nya akan di-toggle.
 * @param {Function} [elements[].callback] - Fungsi opsional yang akan dipanggil setelah toggle selesai.
 */
const toggleActiveClass = (elements) => {
  elements.forEach(({ button, element, callback }) => {
    button.onclick = () => {
      element.classList.toggle("active");
      if (callback) callback();
    };
  });
};

/**
 * removeActiveClass
 *
 * Fungsi ini secara otomatis menambahkan event listener `onclick` pada dokumen
 * untuk memantau klik di luar beberapa elemen. Jika pengguna mengklik di luar
 * elemen atau tombol terkait, kelas 'active' akan dihapus dari elemen tersebut.
 *
 * @param {Array<Object>} elements - Array yang berisi objek-objek dengan tombol
 *                                   dan elemen target yang terkait.
 * @param {HTMLElement} elements[].button - Elemen tombol yang mengontrol elemen target.
 * @param {HTMLElement} elements[].element - Elemen target yang kelas 'active'-nya
 *                                           akan dihapus jika klik terjadi di luar.
 */
const removeActiveClass = (elements) => {
  document.onclick = (e) => {
    elements.forEach(({ button, element }) => {
      if (!button.contains(e.target) && !element.contains(e.target)) {
        element.classList.remove("active");
      }
    });
  };
};

/**
 * toggleModal
 *
 * Fungsi untuk menampilkan atau menyembunyikan modal. Modal akan ditampilkan
 * saat tombol `openButton` diklik dan disembunyikan saat tombol `closeButton`
 * atau area di luar modal diklik.
 *
 * @param {HTMLElement[]} openButtons - Array elemen tombol yang akan membuka modal.
 * @param {HTMLElement} modal - Elemen modal yang akan ditampilkan atau disembunyikan.
 * @param {HTMLElement} closeButton - Tombol yang akan menutup modal.
 */
const toggleModal = (openButtons, modal, closeButton) => {
  openButtons.forEach((btn) => {
    btn.onclick = () => {
      modal.style.display = "flex";
    };
  });

  closeButton.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };
};

/**
 * Mengonversi nilai harga menjadi format mata uang Rupiah (IDR).
 *
 * @param {number} price - Nilai harga yang ingin diformat.
 * @returns {string} - Harga yang diformat dalam bentuk string dengan format mata uang Rupiah.
 */
const formatRupiah = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * Fungsi untuk mengaktifkan atau menonaktifkan tombol berdasarkan
 * apakah semua input di dalam form sudah terisi.
 *
 * @param {HTMLFormElement} form - Form yang berisi elemen input untuk divalidasi.
 * @param {HTMLElement} button - Tombol yang akan diaktifkan atau dinonaktifkan.
 * @param {string} disabledClass - Kelas CSS yang digunakan untuk menonaktifkan tombol.
 */
function toggleButtonOnFormInput(form, button, disabledClass) {
  button.disabled = true;

  form.addEventListener("keyup", () => {
    const allFilled = Array.from(form.elements)
      .filter((element) => element.tagName === "INPUT") // Hanya ambil elemen input
      .every((element) => element.value.trim() !== "");

    // Mengatur status tombol
    button.disabled = !allFilled;
    button.classList.toggle(disabledClass, !allFilled); // Tambah atau hapus kelas disabled
  });
}

/**
 * Fungsi untuk mengonversi data form checkout menjadi URL WhatsApp dengan pesan yang terformat.
 * @param {HTMLFormElement} form - Elemen form yang ingin dikonversi datanya.
 * @param {string} phoneNumber - Nomor WhatsApp tujuan dalam format internasional (contoh: '628988889700').
 * @param {Function} formatMessage - Fungsi untuk memformat pesan yang dikirimkan.
 *
 * @example
 * const checkoutForm = document.getElementById('checkoutForm');
 * handleCheckout(checkoutForm, '6289xxx', formatMessage);
 */
async function handleCheckout(form, phoneNumber, formatMessage) {
  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);

    // Validasi data sebelum mengirim
    if (!objData.name || !objData.alamat || !objData.phone) {
      alert("Silakan lengkapi semua field yang diperlukan.");
      return;
    }

    try {
      const response = await fetch("php/order.php", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const token = await response.text();
      window.snap.pay(token); // Pastikan token valid sebelum memanggil ini
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  // Mencegah penumpukan event listener
  form.removeEventListener("submit", submitHandler);
  form.addEventListener("submit", submitHandler);
}

/**
 * Fungsi untuk memformat pesan checkout dari data form yang diambil.
 * @param {Object} obj - Data dari form checkout yang sudah dikonversi menjadi object.
 * @param {string} obj.name - Nilai input dari field "name" di form.
 * @param {string} obj.alamat - Nilai input dari field "email" di form.
 * @param {string} obj.phone - Nilai input dari field "phone" di form.
 * @param {number} obj.total - Nilai total dari pembelian.
 * @returns {string} - Pesan terformat yang akan dikirimkan ke WhatsApp.
 *
 * @example
 * const message = formatMessage({
 *   name: "John Doe",
 *   email: "johndoe@example.com",
 *   phone: "08123456789",
 *   total: 100000,
 * });
 */
function formatMessage(obj) {
  const formattedTotal = formatRupiah(obj.total); // Mengonversi total ke format Rupiah
  const itemDetails = JSON.parse(obj.items)
    .map((item) => {
      const itemTotal = item.price * item.quantity; // Menghitung total harga per item
      return `${item.name} (x ${item.quantity}) - ${formatRupiah(itemTotal)}`;
    })
    .join("\n");
  return `
Nama: ${obj.name}
Alamat: ${obj.alamat}
No. HP: ${obj.phone}

Halo! Saya ingin membeli produk berikut ini:
${itemDetails}
  
Total Harga: ${formattedTotal}

Mohon informasikan ketersediaan produk!

Terima kasih
`;
}
