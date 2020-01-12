let cart = {};

$('document').ready(function(){
    firstLoadGoods();
    checkCart();
    showMiniCart();
});

$("#get-cart-modal").on('click', function () {
    $("#cart-modal").css({"display":"flex"});
    showCart();
});

$("#cart-modal .modal-close").on('click', function () {
    $("#cart-modal").css({"display":"none"});
});

$("#get-login-modal").on('click', function () {
    $("#login-modal").css({"display":"flex"});
});

$("#login-modal .modal-close").on('click', function () {
    $("#login-modal").css({"display":"none"});
});

$("#login-button").on('click', checkLogin);

$("#good-modal .modal-close").on('click', function () {
    $("#good-modal").css({"display":"none"});
    showCart();
});


function loadGoods(elem) { //загрузка товаров
    $.getJSON("data/goods.json", function(data) {
        let out = "";
        let arr = [];
        $("#goods").empty();
        for (let key in data) {
            if (elem.indexOf(data[key].section) !== -1) {
                arr.push(data[key]);
            }
        }

        for (let key in arr) {
            out += "<div class='single-goods'>";
            out += "<div data-art='" + arr[key].index + "'><p class='name'>" + arr[key].name + "</p>";
            out += "<p class='short-description'>" + arr[key].shortDescription +"</p>";
            out += "<img src = '" + arr[key].img[0] + "'>";
            out += "<p class='price'>" + arr[key].price + " &#8381;</p></div>"; 
            out += "<button class = 'add-to-cart' data-art='" + arr[key].index + "'>Добавить в корзину</button></div>";
        }
        if (out === "") {
            out = '<p>Товары отсутствуют</p>';
        }
        $('#goods').html(out);
        $('button.add-to-cart').on('click', addToCart);
        $(".single-goods div").on('click', getDetailedGoodModal);
    });
}

$(".catalog-section").on('click', function(event) {
    let elem = [];
    elem.push(event.target.textContent);
    $("#header").html(event.target.textContent);
    loadGoods(elem);
});

$(".catalog-top-section").on('click', function(event) { //загрузка товаров
    let elem = [];
    switch (event.target.textContent) {
        case "Комплектующие":
            elem = ["Процессоры","Жесткие диски", "Видеокарты"];
            $("#header").html("Комплектующие");
            break;
        case "Компьютерная периферия":
            elem = ["Мыши","Клавиатуры", "Геймпады", "Мониторы", "Принтеры, МФУ, сканеры"];
            $("#header").html("Компьютерная периферия");
            break;
        case "Устройства ввода":
            elem = ["Мыши","Клавиатуры", "Геймпады"];
            $("#header").html("Устройства ввода");
            break;
        case "Аксессуары":
            elem = ["Наушники","Колонки", "Карты памяти"];
            $("#header").html("Аксессуары");
            break;
    }
    loadGoods(elem);
});

$("#catalog").on("click", firstLoadGoods);

function firstLoadGoods() { //загрузка товаров
    $.getJSON("data/goods.json", function(data) {
        let out = "";
        $("#goods").empty();
        for (let key in data) {
            out += "<div class='single-goods'>";
            out += "<div data-art='" + data[key].index + "'><p class='name'>" + data[key].name + "</p>";
            out += "<p class='short-description'>" + data[key].shortDescription +"</p>";
            out += "<img src = '" + data[key].img[0] + "'>";
            out += "<p class='price'>" + data[key].price + " &#8381;</p>";
            out += "</div><button class = 'add-to-cart' data-art='" + data[key].index + "'>Добавить в корзину</button>";
            out += "</div>";
        }
        $("#header").html("Каталог");
        $('#goods').html(out);
        $('button.add-to-cart').on('click', addToCart);
        $(".single-goods div").on('click', getDetailedGoodModal);
    });
}

function addToCart() { //добавляем товар в корзину
    let articul = $(this).attr("data-art");
    if (cart[articul] !== undefined) {
        cart[articul]++;
    } else {
        cart[articul] = 1;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    showMiniCart();
}

function checkCart() { //проверяю наличие товаров в localStorage
    if (localStorage.getItem('cart') !== null) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
}

function showMiniCart() { //показываю количество товаров в корзине
    let count = 0;
    for (let i in cart) {
        count += cart[i];
    }
    if (count > 0 && count < 10) {
        $('#mini-cart').html(count);
    } else if (count > 9) {
        $('#mini-cart').html('9+');
    } else {
        $('#mini-cart').html('');
    } 
}


function getDetailedGoodModal() {
    let articul = $(this).attr("data-art");
    $.getJSON('data/goods.json', function (data) {
        let good,
            out = '';
        $("#detailed-good").empty();
        for (let key in data) {
            if (key === articul) {
                good = data[key];
            }
        }
        let images = good.img;
        out += "<p class='detailed-good-item-name'>" + good.name + "</p>";
        out += "<div class='detailed-good-item'><div id='slider'><ul class='slider'>";
        for (let i = 0; i < images.length; i++) {
            out += "<li class='slider-item'><img src=" + images[i] + "></li>";
        }
        out += "</ul><ul class='dots'>";
        for (let i = 0; i < images.length; i++) {
            out += "<li class='dots-item'></li>";
        }
        out += "</ul></div>";
        out+= "<div><p>" + good.price + " &#8381;</p>";
        out += "<button class = 'inside-add-to-cart' data-art='" + good.index + "'>Добавить в корзину</button></div></div>";
        out += "<p class='description'>" + good.description + "</p>";
        $('#detailed-good').html(out);
        $("#good-modal").css({"display":"flex"});
        getSlider();
        $('button.inside-add-to-cart').on('click', addToCart);
    });
}


function showCart() {
    $.getJSON('data/goods.json', function (data) { //отображение корзины
        let goods = data;
        if ($.isEmptyObject(cart)) {
            $("#cart").css({"display":"none"});
            $("#summary").css({"display":"none"});
            $("#cart-modal-buttons").css({"display":"none"});
            let out = "Корзина пуста";
            $('#empty-cart').html(out);
        } else {
            let empty = '<tr><th>№</th><th colspan="2">Товар</th><th>Цена</th><th colspan="2">Количество</th></tr>',
                out = '',
                summary = 0;
            $('#empty-cart').html("");    
            $('#cart-table').html(empty);
            $("#cart").css({"display":"table"});
            $("#summary").css({"display":"block"});
            $("#cart-modal-buttons").css({"display":"flex"});
            for (let key in cart) {
                let index = Object.keys(cart).indexOf(key) + 1;
                out += "<tr>";
                out += "<td>" + index + "</td>";
                out += "<td><img class = 'cartImage' src='" + goods[key].img[0] + "'></td>";
                out += "<td><span class ='goodsName' data-art = '" + key + "'>" + goods[key].name + "</span></td>";
                out += "<td>" + cart[key] * goods[key].price + " &#8381;</td>";
                out += "<td><button class = 'minus' data-art = '" + key + "'>-</button> ";
                out += cart[key];
                out += " <button class = 'plus' data-art = '" + key + "'>+</button></td>";
                out += "<td><input type = 'checkbox' data-art = '" + key + "'></td></tr>";
                summary += cart[key] * goods[key].price;
            }
            $('#cart-table').append(out);
            $('#summary').html("Общая сумма заказа: " + summary + " &#8381;");
            $('.plus').on('click', plusGoods);
            $('.minus').on('click', minusGoods);
            $("#clearCart").on('click', clearCart);
            $("#deleteSelected").on('click', deleteSelected);
            $(".goodsName").on("click", getDetailedGoodModal);
        }
    });
}

function plusGoods() { //плюс в корзине
    let articul = $(this).attr('data-art');
    cart[articul]++;
    saveCartToLS();
    showCart();
    showMiniCart();
}

function minusGoods() { //минус в корзине
    let articul = $(this).attr('data-art');
    if (cart[articul] > 1) {
        cart[articul]--;
    } else {
        delete cart[articul];
    }
    saveCartToLS();
    showCart();
    showMiniCart();
}


function clearCart() { //очистка корзины
    cart = {};
    saveCartToLS();
    showCart();
    showMiniCart();
}

function deleteSelected() { //удаление выбранных
    $('#cart-table input:checkbox:checked').each(function(){
        let articul = $(this).attr("data-art");
        delete cart[articul];
    });
    saveCartToLS();
    showCart();
    showMiniCart();
}


function saveCartToLS() { //сохраняю корзину в LS
    localStorage.setItem('cart', JSON.stringify(cart));
}

function checkLogin(event) {
    event.preventDefault();
    let loginStatus = false;
    $.getJSON("data/users.json", function(data) {
        let str = '';
        for (let key in data) {
            if (data[key].email === $('#login-email').val() && data[key].password === $('#login-password').val()) {
                loginStatus = true;
                str = data[key].login;
                break;
            }   
        }
        if (loginStatus) {
            $("#login-modal").css({"display":"none"});
            $("#get-login-modal").html(str);
        } else {
            $("#errorLogin").css({"visibility":"visible"});
        }
    });
}


////SLIDER
function getSlider() {
    let slides = $(".slider-item"),
        dots = $(".dots-item"),
        curSlide = 0;
    slides[0].classList.add("active");
    dots[0].style.backgroundColor = '#03a7df';
    for (let i = 0; i < dots.length; i++) {
        dots[i].addEventListener('click', function() {
            if (i !== curSlide) {
                slides[curSlide].classList.remove("active");
                dots[curSlide].style.backgroundColor = 'lightgray';
                curSlide = i;
                slides[curSlide].classList.add("active");
                dots[curSlide].style.backgroundColor = '#03a7df';
            }
        });
    }
}