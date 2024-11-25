/* script.js */

let menuData = JSON.parse(localStorage.getItem('menuData')) || [];
let restaurantInfo = JSON.parse(localStorage.getItem('restaurantInfo')) || {
    name: 'مطعمك',
    address: '',
    phone: '',
    location: '',
    logo: ''
};

// دالة لعرض المنيو على صفحة index.html
function displayMenu() {
    const sections = {};

    // تجميع الأطباق حسب الفئة
    menuData.forEach(dish => {
        if (!sections[dish.category]) {
            sections[dish.category] = [];
        }
        sections[dish.category].push(dish);
    });

    // تحديث معلومات المطعم
    document.getElementById('restaurant-name').textContent = restaurantInfo.name;
    document.getElementById('restaurant-address').textContent = restaurantInfo.address;
    document.getElementById('restaurant-phone').textContent = 'الهاتف: ' + restaurantInfo.phone;
    if (restaurantInfo.logo) {
        document.getElementById('restaurant-logo').src = restaurantInfo.logo;
    }

    const main = document.querySelector('main');
    main.innerHTML = '';

    for (let category in sections) {
        // إنشاء قسم الفئة
        const section = document.createElement('section');
        section.id = category;
        const h2 = document.createElement('h2');
        h2.className = 'section-title';
        h2.textContent = category;
        section.appendChild(h2);

        // إضافة الأطباق
        sections[category].forEach(dish => {
            const dishDiv = document.createElement('div');
            dishDiv.className = 'dish';

            const img = document.createElement('img');
            img.src = dish.image || 'images/placeholder.png';
            img.alt = dish.name;

            const infoDiv = document.createElement('div');
            infoDiv.className = 'dish-info';

            const name = document.createElement('h3');
            name.className = 'dish-name';
            name.textContent = dish.name;

            const description = document.createElement('p');
            description.className = 'dish-description';
            description.textContent = dish.description;

            const price = document.createElement('p');
            price.className = 'dish-price';
            price.textContent = dish.price + ' جنيه';

            infoDiv.appendChild(name);
            infoDiv.appendChild(description);
            infoDiv.appendChild(price);

            dishDiv.appendChild(img);
            dishDiv.appendChild(infoDiv);

            section.appendChild(dishDiv);
        });

        main.appendChild(section);
    }

    // إضافة توقيع باسمك ورقم هاتفك
    document.getElementById('signature').textContent = 'برمجة محمد الجنيرال 01022116620';
}

// دالة لإضافة طبق جديد من صفحة admin.html
function addDish(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;
    const image = document.getElementById('image').value;

    const dish = { name, description, price, category, image };
    menuData.push(dish);
    localStorage.setItem('menuData', JSON.stringify(menuData));

    document.getElementById('dish-form').reset();
    alert('تم إضافة الطبق بنجاح');
    displayDishesInAdmin();
}

// دالة لإعداد معلومات المطعم من صفحة admin.html
function setRestaurantInfo(event) {
    event.preventDefault();

    const name = document.getElementById('restaurant-name-input').value;
    const address = document.getElementById('restaurant-address-input').value;
    const phone = document.getElementById('restaurant-phone-input').value;
    const location = document.getElementById('restaurant-location-input').value;
    const logo = document.getElementById('restaurant-logo-input').value;

    restaurantInfo = { name, address, phone, location, logo };
    localStorage.setItem('restaurantInfo', JSON.stringify(restaurantInfo));

    alert('تم تحديث معلومات المطعم');
    displayRestaurantInfoInAdmin();
}

// دالة لعرض معلومات المطعم في صفحة التحكم
function displayRestaurantInfoInAdmin() {
    document.getElementById('restaurant-name-input').value = restaurantInfo.name;
    document.getElementById('restaurant-address-input').value = restaurantInfo.address;
    document.getElementById('restaurant-phone-input').value = restaurantInfo.phone;
    document.getElementById('restaurant-location-input').value = restaurantInfo.location;
    document.getElementById('restaurant-logo-input').value = restaurantInfo.logo;
}

// دالة لعرض الأطباق في صفحة التحكم
function displayDishesInAdmin() {
    const tbody = document.getElementById('dishes-table-body');
    tbody.innerHTML = '';

    menuData.forEach((dish, index) => {
        const tr = document.createElement('tr');

        const tdName = document.createElement('td');
        tdName.textContent = dish.name;

        const tdCategory = document.createElement('td');
        tdCategory.textContent = dish.category;

        const tdActions = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'حذف';
        deleteBtn.onclick = () => deleteDish(index);
        tdActions.appendChild(deleteBtn);

        tr.appendChild(tdName);
        tr.appendChild(tdCategory);
        tr.appendChild(tdActions);

        tbody.appendChild(tr);
    });
}

// دالة لحذف طبق
function deleteDish(index) {
    if (confirm('هل أنت متأكد من حذف هذا الطبق؟')) {
        menuData.splice(index, 1);
        localStorage.setItem('menuData', JSON.stringify(menuData));
        displayDishesInAdmin();
    }
}

// التأكد من تحميل المنيو عند فتح index.html
if (document.body.classList.contains('index-page')) {
    displayMenu();
}

// إضافة الأحداث عند فتح admin.html
if (document.body.classList.contains('admin-page')) {
    document.getElementById('dish-form').addEventListener('submit', addDish);
    document.getElementById('restaurant-form').addEventListener('submit', setRestaurantInfo);
    displayRestaurantInfoInAdmin();
    displayDishesInAdmin();
}
