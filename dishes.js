const dishes = [
    {
        keyword: 'borsch',
        name: 'Борщ',
        price: 250,
        category: 'soup',
        count: '300 г',
        image: 'images/soup1.png',
        kind: 'meat'
    },
    {
        keyword: 'chicken-soup',
        name: 'Куриный суп',
        price: 220,
        category: 'soup',
        count: '300 г',
        image: 'images/soup2.jpg',
        kind: 'meat'
    },
    {
        keyword: 'fish-soup',
        name: 'Уха',
        price: 300,
        category: 'soup',
        count: '300 г',
        image: 'images/soup3.jpg',
        kind: 'fish'
    },
    {
        keyword: 'cheese-cream-soup',
        name: 'Сырный крем-суп',
        price: 280,
        category: 'soup',
        count: '300 г',
        image: 'images/soup4.jpg',
        kind: 'veg'
    },
    {
        keyword: 'pumpkin-cream-soup',
        name: 'Тыквенный крем-суп',
        price: 300,
        category: 'soup',
        count: '300 г',
        image: 'images/soup5.jpg',
        kind: 'veg'
    },
    {
        keyword: 'buabes',
        name: 'Буйабес',
        price: 350,
        category: 'soup',
        count: '320 г',
        image: 'images/soup6.jpg',
        kind: 'fish'
    },
    {
        keyword: 'fish-cakes-with-mashed-potatoes',
        name: 'Рыбные котлеты с картофельным пюре',
        price: 360,
        category: 'main_dishes',
        count: '280 г',
        image: 'images/dish2.jpg',
        kind: 'fish' 
    },
    {
        keyword: 'shawarma-with-falafel',
        name: 'Шаурма с фалафелем',
        price: 380,
        category: 'main_dishes',
        count: '350 г',
        image: 'images/dish3.jpg',
        kind: 'veg'
    },
    {
        keyword: 'bolognese',
        name: 'Болоньезе',
        price: 360,
        category: 'main_dishes',
        count: '300 г',
        image: 'images/dish4.jpg', 
        kind: 'meat' 
    },
    {
        keyword: 'potato-pancakes',
        name: 'Драники',
        price: 300,
        category: 'main_dishes',
        count: '260 г',
        image: 'images/dish7.jpg',
        kind: 'veg'
    },
    {
        keyword: 'pilaf-with-chicken',
        name: 'Плов с курицей',
        price: 350,
        category: 'main_dishes',
        count: '290 г',
        image: 'images/dish8.jpg',
        kind: 'meat' 
    },
    {
        keyword: 'salmon-steak-with-salad',
        name: 'Стейк из сёмги с салатом',
        price: 430,
        category: 'main_dishes',
        count: '320 г',
        image: 'images/dish9.jpg',
        kind: 'fish' 
    },
    {
        keyword: 'nisuaz',
        name: 'Нисуаз',
        price: 310,
        category: 'salads',
        count: '270 г',
        image: 'images/salad1.jpg',
        kind: 'fish' 
    },
    {
        keyword: 'cezar',
        name: 'Цезарь с курицей',
        price: 300,
        category: 'salads',
        count: '260 г',
        image: 'images/salad2.jpg',
        kind: 'meat' 
    },
    {
        keyword: 'beetroot-salad',
        name: 'Салат со свеклой и творожным сыром',
        price: 270,
        category: 'salads',
        count: '260 г',
        image: 'images/salad4.jpg',
        kind: 'veg' 
    },
    {
        keyword: 'caprese',
        name: 'Капрезе',
        price: 270,
        category: 'salads',
        count: '250 г',
        image: 'images/salad5.jpg',
        kind: 'veg' 
    },
    {
        keyword: 'cheese-plate',
        name: 'Сырная тарелка',
        price: 390,
        category: 'salads',
        count: '280 г',
        image: 'images/starter1.jpg',
        kind: 'veg' 
    },
    {
        keyword: 'hummus',
        name: 'Хумус',
        price: 280,
        category: 'salads',
        count: '250 г',
        image: 'images/starter2.jpg',
        kind: 'veg' 
    },
    {
        keyword: 'meringue-roll',
        name: 'Меренговый рулет',
        price: 260,
        category: 'desserts',
        count: '140 г',
        image: 'images/dessert1.jpg',
        kind: 'small' 
    },
    {
        keyword: 'cheesecake',
        name: 'Чизкейк',
        price: 240,
        category: 'desserts',
        count: '125 г',
        image: 'images/dessert2.jpg',
        kind: 'small' 
    },
    {
        keyword: 'chocolate-cake',
        name: 'Шоколадный торт',
        price: 270,
        category: 'desserts',
        count: '140 г',
        image: 'images/dessert3.jpg',
        kind: 'small' 
    },
    {
        keyword: 'baklava',
        name: 'Пахлава',
        price: 250,
        category: 'desserts',
        count: '300 г',
        image: 'images/dessert6.jpg',
        kind: 'medium' 
    },
    {
        keyword: 'belgian-waffles',
        name: 'Бельгийские вафли',
        price: 410,
        category: 'desserts',
        count: '350 г',
        image: 'images/dessert5.jpg',
        kind: 'medium' 
    },
    {
        keyword: 'donuts',
        name: 'Пончики (5 штук)',
        price: 600,
        category: 'desserts',
        count: '620 г',
        image: 'images/dessert4.jpg',
        kind: 'large' 
    },
    {
        keyword: 'cranberry-juice',
        name: 'Клюквенный морс',
        price: 120,
        category: 'drinks',
        count: '250 мл',
        image: 'images/drink1.jpg',
        kind: 'cold'
    },
    {
        keyword: 'mineral-water',
        name: 'Минеральная вода',
        price: 120,
        category: 'drinks',
        count: '500 мл',
        image: 'images/drink2.jpg',
        kind: 'cold' 
    },
    {
        keyword: 'orange-juice',
        name: 'Апельсиновый сок',
        price: 130,
        category: 'drinks',
        count: '250 мл',
        image: 'images/drink3.jpg',
        kind: 'cold' 
    },
    {
        keyword: 'hot-chocolate',
        name: 'Горячий шоколад',
        price: 220,
        category: 'drinks',
        count: '250 мл',
        image: 'images/drink4.jpg',
        kind: 'hot' 
    },
    {
        keyword: 'green-tea',
        name: 'Зелёный чай',
        price: 120,
        category: 'drinks',
        count: '300 мл',
        image: 'images/drink5.jpg',
        kind: 'hot' 
    },
    {
        keyword: 'black-tea',
        name: 'Чёрный чай',
        price: 120,
        category: 'drinks',
        count: '300 мл',
        image: 'images/drink6.jpg',
        kind: 'hot' 
    }
]