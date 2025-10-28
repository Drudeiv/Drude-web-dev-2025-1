let dishes = [];
async function loadDishes() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Drudeiv/web/main/dishes.json');
        
        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`);
        }
        
        const data = await response.json();
        dishes = data.dishes;
        return dishes;
        
    } catch (error) {
        console.error('Ошибка при загрузке блюд:', error);
        dishes = [];
        return dishes;
    }
}
