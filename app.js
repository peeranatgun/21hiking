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
${
  product.status !== "sold"
    ? `
      <button
        onclick="markAsSold(
          '${product.id}',
          ${product.cost},
          ${product.sell_price}
        )"
      >
        ✅ ขายแล้ว
      </button>
    `
    : ""
}

<button
  onclick="deleteProduct('${product.id}')"
>
  🗑️ ลบสินค้า
</button>
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
    await loadDashboard();

    alert("เพิ่มสินค้าสำเร็จ");

  });

loadProducts();
window.markAsSold = async (
  productId,
  cost,
  sellPrice
) => {

  const profit =
    sellPrice - cost;

  const { error: saleError } =
    await supabase
      .from("sales")
      .insert([
        {
          product_id: productId,
          cost,
          sell_price: sellPrice,
          profit
        }
      ]);

  if (saleError) {
    alert(saleError.message);
    return;
  }

  const { error: productError } =
    await supabase
      .from("products")
      .update({
        status: "sold"
      })
      .eq("id", productId);

  if (productError) {
    alert(productError.message);
    return;
  }

  await loadProducts();

  await loadDashboard();

  alert("ขายสินค้าแล้ว");

};
const incomeTotal =
  document.getElementById(
    "incomeTotal"
  );

const expenseTotal =
  document.getElementById(
    "expenseTotal"
  );

const profitTotal =
  document.getElementById(
    "profitTotal"
  );

async function loadDashboard() {

  const sales =
    await supabase
      .from("sales")
      .select("*");

  const expenses =
    await supabase
      .from("expenses")
      .select("*");

  const totalIncome =
    sales.data?.reduce(
      (sum, item) =>
        sum + item.sell_price,
      0
    ) || 0;

  const totalProfit =
    sales.data?.reduce(
      (sum, item) =>
        sum + item.profit,
      0
    ) || 0;

  const totalExpense =
    expenses.data?.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    ) || 0;

  incomeTotal.textContent =
    totalIncome.toLocaleString() +
    " ฿";

  expenseTotal.textContent =
    totalExpense.toLocaleString() +
    " ฿";

  profitTotal.textContent =
    (
      totalProfit -
      totalExpense
    ).toLocaleString() + " ฿";

}

loadDashboard();
const expenseTitle =
  document.getElementById("expenseTitle");

const expenseAmount =
  document.getElementById("expenseAmount");

document
  .getElementById("addExpenseBtn")
  .addEventListener("click", async () => {

    const title =
      expenseTitle.value.trim();

    const amount =
      Number(expenseAmount.value);

    if (!title || !amount) {
      alert("กรอกข้อมูลให้ครบ");
      return;
    }

    const { error } =
      await supabase
        .from("expenses")
        .insert([
          {
            title,
            amount
          }
        ]);

    if (error) {
      alert(error.message);
      return;
    }

    expenseTitle.value = "";
    expenseAmount.value = "";

    await loadDashboard();

    alert("เพิ่มรายจ่ายสำเร็จ");

  });
window.deleteProduct = async (id) => {

  const confirmDelete =
    confirm("ต้องการลบสินค้านี้หรือไม่?");

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  await loadProducts();

  alert("ลบสินค้าเรียบร้อย");
};
