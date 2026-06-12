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
const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");
const productCost = document.getElementById("productCost");
const productPrice = document.getElementById("productPrice");
const productList = document.getElementById("productList");

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

async function loadProducts() {

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  productList.innerHTML = "";

  data.forEach((product) => {

    productList.innerHTML += `
      <div class="product-card">

        <img src="${product.image_url}" />

        <div class="product-info">

          <h3>${product.name}</h3>

          <p>ต้นทุน: ${product.cost} ฿</p>

          <p>ราคาขาย: ${product.sell_price} ฿</p>

          <p class="${
            product.status === "sold"
              ? "sold"
              : "instock"
          }">

            ${
              product.status === "sold"
                ? "✅ ขายแล้ว"
                : "📦 อยู่ในสต็อก"
            }

          </p>

        </div>

      </div>
    `;

  });

  document.getElementById("stockCount").textContent =
    data.filter(p => p.status !== "sold").length;

}

document
  .getElementById("addProductBtn")
  .addEventListener("click", async () => {

    const file = productImage.files[0];

    const name = productName.value.trim();

    const brand_id = brandSelect.value;

    const cost = Number(productCost.value);

    const sell_price = Number(productPrice.value);

    if (
      !file ||
      !name ||
      !brand_id
    ) {
      alert("กรอกข้อมูลให้ครบ");
      return;
    }

    const imageBase64 =
      await fileToBase64(file);

    const { error } = await supabase
      .from("products")
      .insert([
        {
          brand_id,
          name,
          cost,
          sell_price,
          image_url: imageBase64,
          status: "instock"
        }
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    productImage.value = "";
    productName.value = "";
    productCost.value = "";
    productPrice.value = "";

    await loadProducts();

    alert("เพิ่มสินค้าสำเร็จ");

  });

loadProducts();
