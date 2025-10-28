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
        
        const formSection = document.querySelector('.form-section h3').parentElement;
        const commentsGroup = document.querySelector('#comments').closest('.form-group');
        formSection.insertBefore(textDisplay, commentsGroup);
    }
    
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
    updateFormSelects();
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
     addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const dish_card = this.closest('.dish-card');
            const dish_keyword = dish_card.getAttribute('data-dish');
            const dish = dishes.find(d => d.keyword === dish_keyword);

            if (dish) {
               selected_dishes[dish.category] = dish;
                backlight(dish.category, dish_keyword);
                update_order();
                updateHiddenFields();
            }
        });
     });
}

function updateHiddenFields() {
    const form = document.getElementById('order');
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
}

function clearHiddenFields() {
    const form = document.getElementById('order');
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
    
    add_button();
    update_order();
    updateHiddenFields();
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

document.addEventListener('DOMContentLoaded', function() {
    initializeOrderSystem();
});
