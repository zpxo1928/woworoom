let OrderData = [];
const orderList = document.querySelector('.js-orderList');
const deleteAllBtn = document.querySelector('.discardAllBtn')
//console.log(deleteAllBtn);

//初始化
function init() {
    getorderList();
}

init();

//取的訂單列表
function getorderList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
        headers: {
            'Authorization': token,
        }
    })
        .then(function (response) {
            OrderData = response.data.orders;

            renderOrderList();
        })

};

getorderList();

//畫面渲染
function renderOrderList() {
    let str = "";
    OrderData.forEach(function (item) {

        //組產品字串
        const timeStamp = new Date(item.createdAt * 1000);
        const orderTime = `${timeStamp.getFullYear()}/${timeStamp.getMonth() + 1}/${timeStamp.getDate()}`;
        let productStr = "";
        item.products.forEach(function (productItem) {
            productStr += `<p>${productItem.title}x${productItem.quantity}</p>`
        })
        let orderStatus = "";
        if (item.paid == true) {
            orderStatus = "已處理"
        } else {
            orderStatus = "未處理"
        }

        //組訂單字串(畫面渲染)
        str += `<tr>
            <td>${item.id}</td>
            <td>
              <p>${item.user.name}</p>
              <p>${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>
              ${productStr}
            </td>
            <td>${orderTime}</td>
            <td>
              <a class="orderStatus" data-status="${item.paid}" href="#" data-id="${item.id}">${orderStatus}</a>
            </td>
            <td>
              <input type="button" data-id="${item.id}" class="delSingleOrder-Btn" value="刪除">
            </td>
        </tr>`
    });

    orderList.innerHTML = str;

};

orderList.addEventListener("click", function (e) {
    e.preventDefault();
    const targetClass = e.target.getAttribute("class");
    //console.log(targetClass);

    let status = e.target.getAttribute("data-status");
    let id = e.target.getAttribute("data-id");

    if (targetClass == "orderStatus") {

        //訂單修改處理
        changeOrderStatus(status, id);

    } else if (targetClass == "delSingleOrder-Btn") {

        //單筆訂單刪除
        deleteOrderItem(id);


    }
});

//訂單修改處理
function changeOrderStatus(status, id) {
    console.log(status);

    let newStatus;

    if (status == "true") {
        newStatus = false;
    } else {
        newStatus = true;
    }
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {

        "data": {
            "id": id,
            "paid": newStatus
        }
    }, {
        headers: {
            'Authorization': token,
        }
    })
        .then(function (response) {
            getorderList();
            alert("訂單修改成功!");

        })

}

function deleteOrderItem(id) {
    console.log(id);

    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`, {
        headers: {
            'Authorization': token,
        }

    }).then(function(response){
        getorderList();
        alert('整筆訂單刪除成功!');
    })

}

//清除全部訂單

deleteAllBtn.addEventListener('click',function(e){
    e.preventDefault();
    
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
        headers: {
            'Authorization': token,
        }

    }).then(function(response){

        getorderList();
        alert("清除全部訂單成功!");

    }).catch(function(response){
        
        alert("目前訂單列表沒有任何東西!");
    })
    
})