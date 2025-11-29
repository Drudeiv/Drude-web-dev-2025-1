const API_ORDERS = 'https://690ce36ea6d92d83e84fd1af.mockapi.io/api/v1/order';

let currentOrderId = null;
let orders = [];
async function loadOrders() {
    try {
        const response = await fetch(API_ORDERS);
        if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
        return [];
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return `${day}.${month}.${year} ${time}`;
}

function getOrderComposition(order) {
    const dishes = [];
    if (order.soup) dishes.push(order.soup);
    if (order.main_dishes) dishes.push(order.main_dishes);
    if (order.salads) dishes.push(order.salads);
    if (order.desserts) dishes.push(order.desserts);
    if (order.drinks) dishes.push(order.drinks);
    return dishes.join(', ');
}

function getDeliveryTime(order) {
    if (order.delivery_time === 'specific' && order.delivery_time_specific) {
        return order.delivery_time_specific;
    }
    return 'Как можно скорее (с 7:00 до 23:00)';
}

function displayOrders(orders) {
    const ordersList = document.getElementById('orders-list');
    const emptyOrders = document.getElementById('empty-orders');
    const ordersTable = document.querySelector('.orders-table');
    
    if (!ordersList || !emptyOrders || !ordersTable) return;

    if (orders.length === 0) {
        ordersList.innerHTML = '';
        ordersTable.style.display = 'none';
        emptyOrders.style.display = 'flex';
        return;
    }
    
    ordersTable.style.display = 'table'; 
    emptyOrders.style.display = 'none';

    const sortedOrders = orders.sort((a, b) => {
        const dateA = new Date(a.order_date || a.createdAt);
        const dateB = new Date(b.order_date || b.createdAt);
        return dateB - dateA;
    });

    ordersList.innerHTML = sortedOrders.map((order, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${formatDate(order.order_date)}</td>
            <td>${getOrderComposition(order)}</td>
            <td>${order.total || 0}₽</td>
            <td>${getDeliveryTime(order)}</td>
            <td class="actions">
                <button class="btn btn-details" onclick="showOrderDetails('${order.id}')">Подробнее</button>
                <button class="btn btn-edit" onclick="editOrder('${order.id}')">Редактировать</button>
                <button class="btn btn-delete" onclick="deleteOrder('${order.id}')">Удалить</button>
            </td>
        </tr>
    `).join('');
}

function showOrderDetails(orderId) {
    currentOrderId = orderId;
    const order = getOrderById(orderId);
    
    if (!order) {
        showNotification('Заказ не найден', 'error');
        return;
    }
    
    const modal = document.getElementById('orderDetailsModal');
    const content = document.getElementById('orderDetailsContent');
    
    const deliveryTypeText = order.delivery_time === 'specific' ? 'Ко времени' : 'Как можно скорее';
    
    content.innerHTML = `
        <div class="order-info">
            <div class="order-info-section">
                <div class="order-info-grid">
                    <div class="info-label">Дата оформления</div>
                    <div class="info-value">${formatDate(order.order_date || order.createdAt)}</div>
                </div>
            </div>
            
            <div class="order-info-section">
                <h3>Доставка</h3>
                <div class="order-info-grid">
                    <div class="info-label">Имя получателя</div>
                    <div class="info-value">${order.name || 'Не указано'}</div>
                    
                    <div class="info-label">Адрес доставки</div>
                    <div class="info-value">${order.address || 'Не указан'}</div>
                    
                    <div class="info-label">Тип доставки</div>
                    <div class="info-value">${deliveryTypeText}</div>
                    
                    ${order.delivery_time === 'specific' && order.delivery_time_specific ? `
                    <div class="info-label">Время доставки</div>
                    <div class="info-value">${order.delivery_time_specific}</div>
                    ` : ''}
                    
                    <div class="info-label">Телефон</div>
                    <div class="info-value">${order.phone || 'Не указан'}</div>
                    
                    <div class="info-label">Email</div>
                    <div class="info-value">${order.email || 'Не указан'}</div>
                </div>
            </div>
            
            ${order.comments ? `
            <div class="order-info-section comment-full-width">
                <h3>Комментарий</h3>
                <div class="comment-text">${order.comments}</div>
            </div>
            ` : ''}
            
            <div class="order-composition-section">
                <h3>Состав заказа</h3>
                ${order.soup ? `
                <div class="composition-item">
                    <span class="item-name">Суп</span>
                    <span class="item-price">${order.soup}${order.soup_price ? ` (${order.soup_price}₽)` : ''}</span>
                </div>
                ` : ''}
                ${order.main_dishes ? `
                <div class="composition-item">
                    <span class="item-name">Основное блюдо</span>
                    <span class="item-price">${order.main_dishes}${order.main_dishes_price ? ` (${order.main_dishes_price}₽)` : ''}</span>
                </div>
                ` : ''}
                ${order.salads ? `
                <div class="composition-item">
                    <span class="item-name">Салат</span>
                    <span class="item-price">${order.salads}${order.salads_price ? ` (${order.salads_price}₽)` : ''}</span>
                </div>
                ` : ''}
                ${order.desserts ? `
                <div class="composition-item">
                    <span class="item-name">Десерт</span>
                    <span class="item-price">${order.desserts}${order.desserts_price ? ` (${order.desserts_price}₽)` : ''}</span>
                </div>
                ` : ''}
                ${order.drinks ? `
                <div class="composition-item">
                    <span class="item-name">Напиток</span>
                    <span class="item-price">${order.drinks}${order.drinks_price ? ` (${order.drinks_price}₽)` : ''}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="order-total-section">
                <h3>Стоимость: <span class="modal-total-value">${order.total || 0}₽</span></h3>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}


function editOrder(orderId) {
    currentOrderId = orderId;
    const order = getOrderById(orderId);
    
    if (!order) {
        showNotification('Заказ не найден', 'error');
        return;
    }
    
    const modal = document.getElementById('editOrderModal');
    
    document.getElementById('editOrderDate').textContent = formatDate(order.order_date || order.createdAt);
    document.getElementById('editFullName').value = order.name || order.full_name || '';
    document.getElementById('editEmail').value = order.email || '';
    document.getElementById('editPhone').value = order.phone || '';
    document.getElementById('editAddress').value = order.address || order.delivery_address || '';
    
    const deliveryType = order.delivery_time || 'asap';
    document.getElementById('deliveryAsap').checked = deliveryType === 'asap';
    document.getElementById('deliverySpecific').checked = deliveryType === 'specific';
    let deliveryTime = order.delivery_time_specific || '';
    if (deliveryTime && (deliveryTime < '07:00' || deliveryTime > '23:00')) {
        deliveryTime = '07:00';
    }
    document.getElementById('editDeliveryTime').value = deliveryTime;
    
    document.getElementById('editComment').value = order.comments || '';
    document.getElementById('editOrderTotal').textContent = `${order.total || 0}₽`;
    
    const compositionContainer = document.getElementById('editOrderComposition');
    compositionContainer.innerHTML = '<h3>Состав заказа</h3>';

    const dishes = [];
    if (order.soup) dishes.push({name: 'Суп', value: order.soup, price: order.soup_price});
    if (order.main_dishes) dishes.push({name: 'Основное блюдо', value: order.main_dishes, price: order.main_dishes_price});
    if (order.salads) dishes.push({name: 'Салат', value: order.salads, price: order.salads_price});
    if (order.desserts) dishes.push({name: 'Десерт', value: order.desserts, price: order.desserts_price});
    if (order.drinks) dishes.push({name: 'Напиток', value: order.drinks, price: order.drinks_price});
    
    dishes.forEach(dish => {
        const dishElement = document.createElement('div');
        dishElement.className = 'composition-item';
        const priceText = dish.price ? ` (${dish.price}₽)` : '';
        dishElement.innerHTML = `<span class="item-name">${dish.name}</span><span class="item-price">${dish.value}${priceText}</span>`;
        compositionContainer.appendChild(dishElement);
    });
    
    toggleSpecificTimeField();
    modal.style.display = 'block';
}

function deleteOrder(orderId) {
    currentOrderId = orderId;
    document.getElementById('deleteOrderModal').style.display = 'block';
}

function getOrderById(orderId) {
    return orders.find(order => order.id === orderId);
}

function toggleSpecificTimeField() {
    const isSpecific = document.getElementById('deliverySpecific').checked;
    document.getElementById('deliveryTimeLabel').style.display = isSpecific ? 'block' : 'none';
    document.getElementById('deliveryTimeInput').style.display = isSpecific ? 'block' : 'none';
}

async function updateOrder(orderId, orderData) {
    const response = await fetch(`${API_ORDERS}/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    
    if (!response.ok) throw new Error('Ошибка при обновлении заказа');
    return await response.json();
}

async function deleteOrderFromServer(orderId) {
    const response = await fetch(`${API_ORDERS}/${orderId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Ошибка при удалении заказа');
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 700);
}

async function initializeOrdersPage() {
    try {
        orders = await loadOrders();
        displayOrders(orders);
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        document.getElementById('empty-orders').style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeOrdersPage();
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });
    
    document.getElementById('closeDetailsBtn').addEventListener('click', function() {
        document.getElementById('orderDetailsModal').style.display = 'none';
    });
    
    document.getElementById('cancelEditBtn').addEventListener('click', function() {
        document.getElementById('editOrderModal').style.display = 'none';
    });
    
    document.getElementById('saveEditBtn').addEventListener('click', async function() {
        const deliveryType = document.getElementById('deliverySpecific').checked ? 'specific' : 'asap';
        const formData = {
            name: document.getElementById('editFullName').value,
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            address: document.getElementById('editAddress').value,
            delivery_time: deliveryType,
            comments: document.getElementById('editComment').value
        };
        
        if (deliveryType === 'specific') {
             const deliveryTime = document.getElementById('editDeliveryTime').value;
            if (!deliveryTime) {
                showNotification('Пожалуйста, укажите время доставки', 'error');
                return;
            }
            if (deliveryTime < '07:00' || deliveryTime > '23:00') {
                showNotification('Время доставки должно быть с 7:00 до 23:00', 'error');
                return;
            }
            formData.delivery_time_specific = deliveryTime;
        }
        try {
            await updateOrder(currentOrderId, formData);
            document.getElementById('editOrderModal').style.display = 'none';
            showNotification('Заказ успешно изменён');
            initializeOrdersPage();
        } catch (error) {
            showNotification('Ошибка при изменении заказа', 'error');
        }
    });
    
    document.getElementById('cancelDeleteBtn').addEventListener('click', function() {
        document.getElementById('deleteOrderModal').style.display = 'none';
    });
    
    document.getElementById('confirmDeleteBtn').addEventListener('click', async function() {
        try {
            await deleteOrderFromServer(currentOrderId);
            document.getElementById('deleteOrderModal').style.display = 'none';
            showNotification('Заказ успешно удален');
            initializeOrdersPage();
        } catch (error) {
            showNotification('Ошибка при удалении заказа', 'error');
        }
    });
    
    document.getElementById('deliveryAsap').addEventListener('change', toggleSpecificTimeField);
    document.getElementById('deliverySpecific').addEventListener('change', toggleSpecificTimeField);
});