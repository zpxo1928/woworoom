//console.log("hi");
//console.log(api_path,token);
const productList = document.querySelector('.productWrap');
const cartList = document.querySelector('.shoppingCart-table');
const productSelect = document.querySelector('.productSelect');
const deleteBtn = document.querySelector('.shoppingCart-table');
//console.log(deleteBtn);

//取得產品列表
function getProductList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
        .then(function (response) {
            //console.log(response);
            productData = response.data.products;
            //console.log(productData);
            renderProductList();
        })
}

getProductList();


//取得購物車列表
function getCartList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
        .then(function (response) {
            //console.log(response);            
            cartData = response.data.carts;
            //console.log(cartData);
            renderCartList();
            document.querySelector(".totalPrice").textContent = response.data.finalTotal;



        })
}

getCartList();

//產品列表畫面渲染
function renderProductList() {
    let str = "";
    productData.forEach(function (item) {
        str += `<li class="productCard">
                  <h4 class="productType">新品</h4>s
                  <img src="${item.images}" alt="">
                  <a href="#" data-id="${item.id}" class="addCartBtn">加入購物車</a>
                  <h3>${item.title}</h3>
                  <del class="originPrice">NT$${item.origin_price}</del>
                  <p class="nowPrice">NT$${item.price}</p>
              </li>`
    })
    productList.innerHTML = str;
}

//產品品項篩選
productSelect.addEventListener("change", function (e) {
    //console.log(e.target.value);

    const category = e.target.value;
    //console.log(category);
    if (category == "全部") {
        renderProductList();
        return;
    }

    let str = "";

    const newproductData = productData.filter(function (item) {
        //console.log(item);
        if (item.category == category) {
            return item;
        }

    })

    newproductData.forEach(function (item) {
        str += `<li class="productCard">
                  <h4 class="productType">新品</h4>s
                  <img src="${item.images}" alt="">
                  <a href="#" data-id="${item.id}" class="addCartBtn">加入購物車</a>
                  <h3>${item.title}</h3>
                  <del class="originPrice">NT$${item.origin_price}</del>
                  <p class="nowPrice">NT$${item.price}</p>
              </li>`

        productList.innerHTML = str;

    })


})




//購物車列表畫面渲染
function renderCartList() {
    let str = "";
    cartData.forEach(function (item) {
        str += `<tr>
                    <td>
                        <div class="cardItem-title">
                            <img src="${item.product.images}" alt="">
                            <p>${item.product.title}</p>
                        </div>
                    </td>
                    <td>NT$${item.product.price}</td>
                    <td>${item.quantity}</td>
                    <td>NT$${item.product.price * item.quantity}</td>
                    <td class="discardBtn">
                        <a href="#" class="material-icons" data-id="${item.id}">
                            clear
                        </a>
                    </td>
                </tr>                
        `
    })

    cartList.innerHTML = `<tr>
    <th width="40%">品項</th>
    <th width="15%">單價</th>
    <th width="15%">數量</th>
    <th width="15%">金額</th>
    <th width="15%"></th>
</tr>`
        + str +
        `<tr>
    <td>
        <a href="#" class="discardAllBtn">刪除所有品項</a>
    </td>
    <td></td>
    <td></td>
    <td>
        <p>總金額</p>
    </td>
    <td>NT$<span class="totalPrice">計算中</span></td>
</tr> ` ;

}

//新增購物車品項
productList.addEventListener('click', function (e) {
    //console.log(e);
    e.preventDefault();

    let addCartClass = e.target.getAttribute("class");
    //console.log(addCartClass);

    if (addCartClass !== "addCartBtn") {
        return;
    }

    let productId = e.target.getAttribute("data-id");
    let numCheck = 1;

    cartData.forEach(function (item) {
        if (item.product.id === productId) {
            numCheck = item.quantity += 1;
        }
        //console.log(cartData);

    });

    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {

        data: {
            "productId": productId,
            "quantity": numCheck
        }

    }).then(function (response) {
        getCartList();
    })

});

//刪除購物車特定品項
cartList.addEventListener('click', function (e) {
    e.preventDefault();
    const cartId = e.target.getAttribute("data-id");
    if (cartId == null) {
        return;
    }
    //console.log(cartId);

    axios.delete(`
    https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
        .then(function (response) {
            getCartList();
        })

});



//清除整個購物車

deleteBtn.addEventListener('click', function (e) {
    e.preventDefault();

    let deleteCartClass = e.target.getAttribute("class");
    //console.log(deleteCartClass);


    if (deleteCartClass == "discardAllBtn") {

        axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
            .then(function (response) {
                getCartList();
                alert("購物車已清除!");
            }).catch(function (response) {
                alert("購物車已經是空的!");
            })

    }

})


//送出訂單

const addOrderBtn = document.querySelector('.orderInfo-btn');
//console.log(addOrderBtn);

addOrderBtn.addEventListener("click",function(e){
    e.preventDefault();
  if(cartData.length==0){
    alert("請先將商品加入購物車");
    return;
  }
  const customerName = document.querySelector("#customerName").value;
  const customerPhone = document.querySelector("#customerPhone").value;
  const customerEmail = document.querySelector("#customerEmail").value;
  const customerAddress = document.querySelector("#customerAddress").value;
  const customerTradeWay = document.querySelector("#tradeWay").value;
  
  if (customerName==""||customerPhone==""||customerEmail==""||customerAddress==""||customerTradeWay==""){
    alert("請輸入資料");
    return;
  }
  
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
    {
      "data": {
        "user": {
          "name": customerName,
          "tel": customerPhone,
          "email": customerEmail,
          "address": customerAddress,
          "payment": customerTradeWay
        }
      }
    }
  ).
    then(function (response) {
      alert("訂單送出成功!");
      document.querySelector("#customerName").value="";
      document.querySelector("#customerPhone").value="";
      document.querySelector("#customerEmail").value="";
      document.querySelector("#customerAddress").value="";
      document.querySelector("#tradeWay").value="ATM";
      getCartList();
    })
    .catch(function(error){
      alert("訂單送出失敗");
    })
});




