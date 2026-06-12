import { supabase } from "./supabase.js";

const brandInput = document.getElementById("brandInput");
const addBrandBtn = document.getElementById("addBrandBtn");
const brandSelect = document.getElementById("brandSelect");

async function loadBrands() {

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("name");

  if (error) {
    console.error(error);
    return;
  }

  brandSelect.innerHTML = "";

  data.forEach((brand) => {

    const option = document.createElement("option");

    option.value = brand.id;
    option.textContent = brand.name;

    brandSelect.appendChild(option);

  });

}

addBrandBtn.addEventListener("click", async () => {

  const name = brandInput.value.trim();

  if (!name) {
    alert("กรุณากรอกชื่อแบรนด์");
    return;
  }

  const { error } = await supabase
    .from("brands")
    .insert([
      {
        name
      }
    ]);

  if (error) {
    alert(error.message);
    return;
  }

  brandInput.value = "";

  await loadBrands();

  alert("เพิ่มแบรนด์สำเร็จ");

});

loadBrands();
