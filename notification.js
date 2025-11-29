function DisplayNotification(selected) {
    let notification_text = '';
    if (!selected.soup && !selected.main_dishes && !selected.salads && !selected.desserts && !selected.drinks) {
    notification_text = 'Ничего не выбрано. Выберите блюдо для заказа';
    }
    else if (((selected.soup && selected.main_dishes && selected.salads) || (selected.soup && selected.main_dishes) || (selected.soup && selected.salads) || (selected.main_dishes && selected.salads) || (selected.main_dishes)) && (!selected.drinks)) {
    notification_text = 'Выберите напиток';
    }
    else if (selected.soup && !selected.salads && !selected.main_dishes) {
    notification_text = 'Выберите главное блюдо/салат/стартер';
    }
    else if (selected.salads && !selected.soup && !selected.main_dishes) {
    notification_text = 'Выберите суп или главное блюдо';
    }
    else if ((selected.drinks || selected.desserts) && !selected.main_dishes) {
    notification_text = 'Выберите главное блюдо';
    }
    create_notification(notification_text);
}

document.addEventListener('DOMContentLoaded', function() {
    const order_form = document.getElementById('order');
    if (order_form) {
        order_form.addEventListener('submit', function(event) {
            if (!validate_order()) {
                event.preventDefault();
            }
        });
    }
});

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
    DisplayNotification(selected);
    return false;
}

function create_notification(text) {
    const old_notification = document.querySelector('.order-notification');
    if (old_notification) {
        old_notification.remove();
    }
    const notification = document.createElement('div');
    notification.className = 'order-notification';
    notification.innerHTML = `
        <div class = "notification-content">
            <div class = "notification-text">${text}</div>
            <button class = "notification-ok-btn">Окей</button>
        </div>
    `;
    document.body.appendChild(notification);
    const ok_button = notification.querySelector('.notification-ok-btn');
    ok_button.addEventListener('click', function() {
        notification.remove();
    });
}
