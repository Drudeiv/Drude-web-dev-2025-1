function create_dish_card(dish) {
    const dishCard = document.createElement('div');
    dishCard.className = 'dish-card';
    dishCard.setAttribute('data-dish', dish.keyword);
    dishCard.setAttribute('data-kind', dish.kind);
    
    dishCard.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}">
        <p class="price">${dish.price}&#8381;</p>
        <h3>${dish.name}</h3>
        <p class="weight">${dish.count}</p>
        <button>Добавить</button>
    `;
    
    return dishCard;
}

function create_filters(category) {
    const filters_container = document.createElement('div');
    filters_container.className = 'filters-container';
    let filters = [];
    if (category === 'soup') {
        filters = [
            {name: 'рыбный', kind: 'fish'},
            {name: 'мясной', kind: 'meat'},
            {name: 'вегетарианский', kind: 'veg'}
        ];
    } else if (category === 'main_dishes') {
        filters = [
            {name: 'рыбное', kind: 'fish'},
            {name: 'мясное', kind: 'meat'},
            {name: 'вегетарианское', kind: 'veg'}
        ];
    } else if (category === 'salads') {
        filters = [
            {name: 'рыбный', kind: 'fish'},
            {name: 'мясной', kind: 'meat'},
            {name: 'вегетарианский', kind: 'veg'}
        ];
    } else if (category === 'desserts') {
        filters = [
            {name: 'маленькая порция', kind: 'small'},
            {name: 'средняя порция', kind: 'medium'},
            {name: 'большая порция', kind: 'large'}
        ];
    } else if (category === 'drinks') {
        filters = [
            {name: 'холодный', kind: 'cold'},
            {name: 'горячий', kind: 'hot'}
        ];
    }

    filters.forEach(filter => {
        const button = document.createElement('button');
        button.className = 'filter-button';
        button.textContent = filter.name;
        button.setAttribute('data-kind', filter.kind);
        button.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            if (isActive) {
                this.classList.remove('active');
                showAllDishes(category);
            } else {
                active_filter(this);
                filter_dishes(category, filter.kind);
            }
        });
        filters_container.appendChild(button);
    });
    
    return filters_container;
}

function active_filter(active_button) {
    const container = active_button.parentElement;
    const all_buttons = container.querySelectorAll('.filter-button');
    all_buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    active_button.classList.add('active');
}

function showAllDishes(category) {
    const section = document.getElementById(category);
    const container = section.querySelector('.dishes-container');
    const all_cards = container.querySelectorAll('.dish-card');
    
    all_cards.forEach(card => {
        card.style.display = 'flex'; 
    });
}

function filter_dishes(category, kind) {
    const section = document.getElementById(category);
    const container = section.querySelector('.dishes-container');
    const all_cards = container.querySelectorAll('.dish-card');
    all_cards.forEach(card => {
        const card_kind = card.getAttribute('data-kind');
        if (card_kind===kind) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function display_dishes(dishesData) {
    const categories = {
        'soup': document.getElementById('soup'),
        'main_dishes': document.getElementById('main_dishes'), 
        'salads': document.getElementById('salads'),
        'desserts': document.getElementById('desserts'),
        'drinks': document.getElementById('drinks')
    };
    
    Object.values(categories).forEach(section => {
        if (section) {
            const container = section.querySelector('.dishes-container');
            if (container) {
                container.innerHTML = '';
            }
        }
    });

    const sorted_dishes = dishesData.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });
    sorted_dishes.forEach(dish => {
        const section = categories[dish.category];
        if (section) {
            const container = section.querySelector('.dishes-container');
            if (container) {
                const dishCard = create_dish_card(dish);
                container.appendChild(dishCard);
            }
        }
    });

    Object.keys(categories).forEach(category => {
        const section = categories[category];
        if (section) {
            const oldFilters = section.querySelector('.filters-container');
            if (oldFilters) {
                oldFilters.remove();
            }
            const filters = create_filters(category);
            const container = section.querySelector('.dishes-container');
            section.insertBefore(filters, container);
        }
    });
}

function showLoadingIndicator() {
    const categories = ['soup', 'main_dishes', 'salads', 'desserts', 'drinks'];
    categories.forEach(category => {
        const section = document.getElementById(category);
        if (section) {
            const container = section.querySelector('.dishes-container');
            if (container) {
                container.innerHTML = '<div class="loading">Загрузка блюд...</div>';
            }
        }
    });
}

async function initializeMenu() {
    showLoadingIndicator();
    try {
        await loadDishes();
        if (dishes.length === 0) {
            throw new Error('Не удалось загрузить блюда');
        }
        display_dishes(dishes);
        setTimeout(() => {
            if (typeof initializeOrderSystem === 'function') {
                initializeOrderSystem();
            }
        }, 100);
    } catch (error) {
        console.error('Ошибка инициализации меню:', error);
        const categories = ['soup', 'main_dishes', 'salads', 'desserts', 'drinks'];
        categories.forEach(category => {
            const section = document.getElementById(category);
            if (section) {
                const container = section.querySelector('.dishes-container');
                if (container) {
                    container.innerHTML = '<div class="error">Ошибка загрузки меню. Пожалуйста, обновите страницу.</div>';
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
});
