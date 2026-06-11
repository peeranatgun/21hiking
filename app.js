import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBsE_Nw03Zd7CM8qWGAbxKBehi1mJKuy20",
  authDomain: "hikingstore-5161c.firebaseapp.com",
  projectId: "hikingstore-5161c",
  storageBucket: "hikingstore-5161c.firebasestorage.app",
  messagingSenderId: "126052119584",
  appId: "1:126052119584:web:450d71f4dedd1837853845",
  measurementId: "G-FSPT2JM2T7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const brandInput = document.getElementById("brandName");
const addBrandBtn = document.getElementById("addBrandBtn");
const brandSelect = document.getElementById("brandSelect");

async function loadBrands() {

  brandSelect.innerHTML =
    '<option value="">เลือกแบรนด์</option>';

  const querySnapshot =
    await getDocs(collection(db, "brands"));

  querySnapshot.forEach((doc) => {

    const brand = doc.data();

    const option =
      document.createElement("option");

    option.value = brand.name;
    option.textContent = brand.name;

    brandSelect.appendChild(option);

  });

}

addBrandBtn.addEventListener(
  "click",
  async () => {

    const name = brandInput.value.trim();

    if (!name) {
      alert("กรุณากรอกชื่อแบรนด์");
      return;
    }

    await addDoc(
      collection(db, "brands"),
      {
        name
      }
    );

    brandInput.value = "";

    await loadBrands();

    alert("เพิ่มแบรนด์สำเร็จ");

  }
);

loadBrands();
