let selected_dishes = {
    soup: null,
    main_dishes: null,
    salads: null,
    desserts: null,
    drinks: null
};

function calculate() {
    let price = 0;
    Object.values(selected_dishes).forEach(dish => {
        if (dish !== null) {
            price += dish.price;  
        }
    });
    return price;
}

function updateFormSelects() {
    Object.entries(selected_dishes).forEach(([category, dish]) => {
        const select = document.querySelector(`select[name="${category}"]`);
        if (select && dish) {
            select.value = dish.keyword;
        }
    });
}

function update_order() {
    let textDisplay = document.getElementById('text-order-display');
    
    if (!textDisplay) {
        textDisplay = document.createElement('div');
        textDisplay.id = 'text-order-display';
        textDisplay.className = 'text-order-display';
        
        const formSection = document.querySelector('.form-section h3')?.parentElement;
        if (formSection) {
            const commentsGroup = document.querySelector('#comments')?.closest('.form-group');
            if (commentsGroup) {
                formSection.insertBefore(textDisplay, commentsGroup);
            }
        }
    }
    
    const has_selected_dishes = Object.values(selected_dishes).some(dish => dish !== null);
    const price = calculate();

    if (!has_selected_dishes) {
        textDisplay.innerHTML = '<p class="no-selection">Ничего не выбрано</p>';
        updateOrderPanel();
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
    updateOrderPanel();
}

function backlight(category, dish_keyword) {
    const allDishCards = document.querySelectorAll('.dish-card');
    allDishCards.forEach(card => {
        card.style.border = 'none';
    });
    const selected_card = document.querySelector(`[data-dish="${dish_keyword}"]`);
    if (selected_card) {
        selected_card.style.border = '2px solid tomato';
    }
}

function add_button() {
    const addButtons = document.querySelectorAll('.dish-card button');
    console.log('Найдено кнопок:', addButtons.length);
    
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Кнопка "Добавить" нажата');
            const dish_card = this.closest('.dish-card');
            const dish_keyword = dish_card.getAttribute('data-dish');
            const dish = dishes.find(d => d.keyword === dish_keyword);

            if (dish) {
                console.log('Добавляем блюдо:', dish.name);
                selected_dishes[dish.category] = dish;
                backlight(dish.category, dish_keyword);
                update_order();
                updateHiddenFields();
                saveOrderLocalStorage();
            }
        });
    });
}

function saveOrderLocalStorage() {
    const order_data = {};
    Object.entries(selected_dishes).forEach(([category, dish]) => {
        order_data[category] = dish ? dish.keyword : null;
    });
    localStorage.setItem('currentOrder', JSON.stringify(order_data));
    console.log('Сохранено в localStorage:', order_data);
}

function updateHiddenFields() {
    const form = document.getElementById('order');
    if (!form) {
        return;
    }
    
    clearHiddenFields();
    Object.entries(selected_dishes).forEach(([category, dish]) => {
        if (dish) {
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = category;
            hiddenInput.value = dish.keyword;
            form.appendChild(hiddenInput);
        } else {
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = category;
            hiddenInput.value = '';
            form.appendChild(hiddenInput);
        }
    });
    saveOrderLocalStorage();
}

function loadOrderFromLocalStorage() {
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
        const orderData = JSON.parse(savedOrder);
        Object.entries(orderData).forEach(([category, dishKeyword]) => {
            if (dishKeyword) {
                const dish = dishes.find(d => d.keyword === dishKeyword);
                if (dish) {
                    selected_dishes[category] = dish;
                    backlight(category, dishKeyword);
                }
            }
        });
    }
}

function clearHiddenFields() {
    const form = document.getElementById('order');
    if (!form) {
        console.log('Форма не найдена, пропускаем clearHiddenFields');
        return;
    }
    
    const hiddenFields = form.querySelectorAll('input[type="hidden"]');
    hiddenFields.forEach(field => {
        if (field.name === 'soup' || field.name === 'main_dishes' || field.name === 'salads' || 
            field.name === 'desserts' || field.name === 'drinks') {
            field.remove();
        }
    });
}

function initializeOrderSystem() {
    
    if (document.querySelectorAll('.dish-card').length === 0) {
        setTimeout(initializeOrderSystem, 100);
        return;
    }
    
    loadOrderFromLocalStorage();
    add_button();
    update_order();
    updateHiddenFields();
    setupCheckoutLink();
    
    const resetButton = document.querySelector('.reset-btn');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            selected_dishes = {
                soup: null,
                main_dishes: null,
                salads: null,
                desserts: null,
                drinks: null
            };
            update_order();
            updateHiddenFields();
            const allDishCards = document.querySelectorAll('.dish-card');
            allDishCards.forEach(card => {
                card.style.border = 'none';
            });
        });
    }
}

function updateOrderPanel() {
    const orderPanel = document.getElementById('order-panel');
    const currentTotal = document.getElementById('current-total');
    const checkoutLink = document.getElementById('checkout-link');
    
    if (!orderPanel || !currentTotal || !checkoutLink) return;
    
    const price = calculate();
    const isValidCombo = validate_order_silent();
    
    currentTotal.textContent = price + '\u20BD';
    
    if (price > 0) {
        orderPanel.style.display = 'block';
        
        if (isValidCombo) {
            checkoutLink.classList.remove('disabled');
            checkoutLink.onclick = null;
        } else {
            checkoutLink.classList.add('disabled');
            checkoutLink.onclick = function(e) {
                e.preventDefault();
                DisplayNotification(selected_dishes);
            };
        }
    } else {
        orderPanel.style.display = 'none';
    }
}

function validate_order_silent() {
    const selected = selected_dishes;
    const true_combo = [
        {soup: true, main_dishes: true, salads: true, drinks: true},
        {soup: true, main_dishes: true, drinks: true},
        {soup: true, salads: true, drinks: true},
        {main_dishes: true, salads: true, drinks: true},
        {main_dishes: true, drinks: true}
    ];
    
    return true_combo.some(combo => {
        return Object.keys(combo).every(key => {
            if (combo[key]) {
                return selected[key] !== null;
            }
            return true;
        });
    });
}

function setupCheckoutLink() {
    const checkoutLink = document.getElementById('checkout-link');
    if (checkoutLink) {
        checkoutLink.addEventListener('click', function(e) {
            saveOrderLocalStorage();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, запускаем order.js');
    initializeOrderSystem();
});
