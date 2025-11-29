let selected_dishes = {
    soup: null,
    main_dishes: null,
    salads: null,
    desserts: null,
    drinks: null
};

async function loadOrderFromLocalStorage() {
    const savedOrder = localStorage.getItem('currentOrder');
    
    if (savedOrder) {
        const orderData = JSON.parse(savedOrder);
        selected_dishes = {
            soup: null,
            main_dishes: null,
            salads: null,
            desserts: null,
            drinks: null
        };
        
        Object.entries(orderData).forEach(([category, dishKeyword]) => {
            if (dishKeyword) {
                const dish = dishes.find(d => d.keyword === dishKeyword);
                if (dish) {
                    selected_dishes[category] = dish;
                }
            }
        });
    }
}

function createCheckDishCard(dish) {
    const dishCard = document.createElement('div');
    dishCard.className = 'dish-card';
    dishCard.setAttribute('data-dish', dish.keyword);
    
    dishCard.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}">
        <p class="price">${dish.price}&#8381;</p>
        <h3>${dish.name}</h3>
        <p class="weight">${dish.count}</p>
        <button class="remove-btn" data-category="${dish.category}">Удалить</button>
    `;
    
    return dishCard;
}

function displayOrderItems() {
    const container = document.getElementById('order-items-container');
    
    if (!container) return;
    
    const hasSelectedDishes = Object.values(selected_dishes).some(dish => dish !== null);
    
    if (!hasSelectedDishes) {
        container.innerHTML = `
            <div class="empty-order">
                <p>Ничего не выбрано. Чтобы добавить блюда в заказ, перейдите на страницу <a href="menu.html">Собрать ланч</a>.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    Object.entries(selected_dishes).forEach(([category, dish]) => {
        if (dish) {
            const dishCard = createCheckDishCard(dish);
            container.appendChild(dishCard);
        }
    });
}

function saveOrderLocalStorage() {
    const orderData = {};
    Object.entries(selected_dishes).forEach(([category, dish]) => {
        orderData[category] = dish ? dish.keyword : null;
    });
    localStorage.setItem('currentOrder', JSON.stringify(orderData));
}

function updateOrderDisplay() {
    let textDisplay = document.getElementById('text-order-display');
    
    if (!textDisplay) return;
    
    const has_selected_dishes = Object.values(selected_dishes).some(dish => dish !== null);
    const price = calculate();

    if (!has_selected_dishes) {
        textDisplay.innerHTML = '<p class="no-selection">Ничего не выбрано</p>';
        return;
    }
    
    textDisplay.innerHTML = `
    <div class="order-category">
        <div class="category-label">Суп</div>
        <div class="dish-info">${selected_dishes.soup ? selected_dishes.soup.name + ' ' + selected_dishes.soup.price + '\u20BD' : 'Блюдо не выбрано'}</div>
    </div>
    <div class="order-category">
        <div class="category-label">Главное блюдо</div>
        <div class="dish-info">${selected_dishes.main_dishes ? selected_dishes.main_dishes.name + ' ' + selected_dishes.main_dishes.price + '\u20BD' : 'Блюдо не выбрано'}</div>
    </div>
    <div class="order-category">
        <div class="category-label">Салат или стартер</div>
        <div class="dish-info">${selected_dishes.salads ? selected_dishes.salads.name + ' ' + selected_dishes.salads.price + '\u20BD' : 'Блюдо не выбрано'}</div>
    </div>
    <div class="order-category">
        <div class="category-label">Десерт</div>
        <div class="dish-info">${selected_dishes.desserts ? selected_dishes.desserts.name + ' ' + selected_dishes.desserts.price + '\u20BD' : 'Блюдо не выбрано'}</div>
    </div>
    <div class="order-category">
        <div class="category-label">Напиток</div>
        <div class="dish-info">${selected_dishes.drinks ? selected_dishes.drinks.name + ' ' + selected_dishes.drinks.price + '\u20BD' : 'Напиток не выбран'}</div>
    </div>
    <div class="total-cost">
        <div class="cost-label">Стоимость заказа</div>
        <div class="cost-value">${price + '\u20BD'}</div>
    </div>
    `;
}

function calculate() {
    let price = 0;
    Object.values(selected_dishes).forEach(dish => {
        if (dish !== null) {
            price += dish.price;  
        }
    });
    return price;
}

function removeDishFromOrder(category) {
    selected_dishes[category] = null;
    saveOrderLocalStorage();
    displayOrderItems();
    updateOrderDisplay();
    
    const hasSelectedDishes = Object.values(selected_dishes).some(dish => dish !== null);
    if (!hasSelectedDishes) {
        displayOrderItems();
    }
}

const API_ORDERS = 'https://690ce36ea6d92d83e84fd1af.mockapi.io/api/v1/order';

async function submitOrder(formData) {
    try {
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        
        const orderData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            delivery_time: formData.get('delivery_time'),
            delivery_time_specific: formData.get('delivery_time_specific') || '',
            comments: formData.get('comments') || '',
            promotions: formData.get('promotions') ? 'true' : 'false',
            soup: selected_dishes.soup ? selected_dishes.soup.name : '',
            soup_price: selected_dishes.soup ? selected_dishes.soup.price : 0,
            main_dishes: selected_dishes.main_dishes ? selected_dishes.main_dishes.name : '',
            main_dishes_price: selected_dishes.main_dishes ? selected_dishes.main_dishes.price : 0,
            salads: selected_dishes.salads ? selected_dishes.salads.name : '',
            salads_price: selected_dishes.salads ? selected_dishes.salads.price : 0,
            desserts: selected_dishes.desserts ? selected_dishes.desserts.name : '',
            desserts_price: selected_dishes.desserts ? selected_dishes.desserts.price : 0,
            drinks: selected_dishes.drinks ? selected_dishes.drinks.name : '',
            drinks_price: selected_dishes.drinks ? selected_dishes.drinks.price : 0,
            total: calculate(),
            order_date: new Date().toISOString()
        };

        console.log('Отправка заказа:', orderData);
        
        const response = await fetch(API_ORDERS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
        
        const result = await response.json();

        localStorage.removeItem('currentOrder');
        alert('Заказ успешно оформлен!');
        
        document.getElementById('order').reset();
        selected_dishes = {
            soup: null, main_dishes: null, salads: null,
            desserts: null, drinks: null
        };
        displayOrderItems();
        updateOrderDisplay();
        
    } catch (error) {
        console.error('Ошибка при отправке заказа:', error);
        
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            alert('Ошибка соединения с сервером. Проверьте интернет-соединение и попробуйте еще раз.');
        } else {
            alert('Произошла ошибка при оформлении заказа: ' + error.message);
        }
        
    } finally {
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить';
        }
    }
}

function validate_order() {
    const selected = selected_dishes;
    const true_combo = [
        {soup: true, main_dishes: true, salads: true, drinks: true},
        {soup: true, main_dishes: true, drinks: true},
        {soup: true, salads: true, drinks: true},
        {main_dishes: true, salads: true, drinks: true},
        {main_dishes: true, drinks: true}
    ];
    const isTrue = true_combo.some(combo => {
        return Object.keys(combo).every(key => {
            if (combo[key]) {
                return selected[key] !== null;
            }
            return true;
        });
    });
    if (isTrue) {
        return true;
    }
    alert('Выбранные блюда не соответствуют ни одному из доступных комбо. Пожалуйста, выберите блюда согласно одному из доступных наборов.');
    return false;
}

async function initializeCheckout() {
    await loadDishes();
    await loadOrderFromLocalStorage();
    displayOrderItems();
    updateOrderDisplay();
}

document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-btn')) {
            const category = e.target.getAttribute('data-category');
            removeDishFromOrder(category);
        }
    });
    
    const orderForm = document.getElementById('order');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validate_order()) {
                return;
            }
            
            const formData = new FormData(this);
            submitOrder(formData);
        });
    }
});