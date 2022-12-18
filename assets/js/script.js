let modalQtde = 1;
let cart = [];
let modalKey;

const query = (el) => document.querySelector(el);
const queryAll = (el) => document.querySelectorAll(el);

function mapPizzas(){
    pizzaJson.map((item, index) => {
        let pizzaItem = query('.models .pizza-item').cloneNode(true);

        pizzaItem.setAttribute('data-key', index);
        pizzaItem.querySelector('.pizza-item--img img').src = item.img;
        pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
        pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
        pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

        
        pizzaItem.querySelector('a').addEventListener('click', e =>{
            e.preventDefault();
            
            
            let key = e.target.closest('.pizza-item').getAttribute('data-key');
            modalQtde = 1;
            modalKey = key;

            query('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
            query('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
            query('.pizzaBig img').src = pizzaJson[key].img;
            query('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
            query('.pizzaInfo--size.selected').classList.remove('selected');
            queryAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
                if(sizeIndex == 2){
                    size.classList.add('selected');
                }
                size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
            })
            query('.pizzaInfo--qt').innerHTML = modalQtde;
            query('.pizzaWindowArea').style.opacity = 0;
            query('.pizzaWindowArea').style.display = 'flex';
            setTimeout(() =>{
                query('.pizzaWindowArea').style.opacity = 1;
            },300)
        });
        query('.pizza-area').append( pizzaItem );
    });
};

function closeModal(){
    query('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        query('.pizzaWindowArea').style.display = 'none';
    }, 400)
}
queryAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(item => {
    item.addEventListener('click', closeModal);
});
query('.pizzaInfo--qtmenos').addEventListener('click', () => {
    
    if(modalQtde > 1){
        modalQtde--;
        query('.pizzaInfo--qt').innerHTML = modalQtde;
    } else {
        throw new Error('Não é possível ter 0 ou menos pizzas');
    }
});
query('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQtde++;
    query('.pizzaInfo--qt').innerHTML = modalQtde;
});
queryAll('.pizzaInfo--size').forEach((size) => {
    size.addEventListener('click', (e) => {
        query('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
query('.pizzaInfo--addButton').addEventListener('click', () => {
    let sizePizza = parseInt(query('.pizzaInfo--size.selected').getAttribute('data-key'));
    let namePizza = pizzaJson[modalKey].name;
    let size = pizzaJson[modalKey].sizes[sizePizza];

    let identifier =  pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item) => item.identifier === identifier)
    
    if(key != -1){
        cart[key].qtde += modalQtde;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id, 
            sizePizza,
            qtde:modalQtde
        })
}
    updateCart();
    closeModal();
});

query('.menu-openner').addEventListener('click', () => {

    if(!cart.length) return;
    
    query('aside').style.left = '0';
});
query('.menu-closer').addEventListener('click', () => {
    query('aside').style.left = '100vw';
})

function updateCart(){
    query('.menu-openner span').innerHTML = cart.length;
    
    
    if(cart.length > 0){
        query('aside').classList.add('show');
        
        query('.cart').innerHTML = '';

        let subtotal = 0;
        let discount = 0;
        let overall = 0

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            let cartItem = query('.models .cart--item').cloneNode(true);
            let pizzaSizeName = sizeNamePizza(cart[i].sizePizza);
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            subtotal += pizzaItem.price * cart[i].qtde;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtde;
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () =>{
                cart[i].qtde++;
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{
                try{
                    if(cart[i].qtde > 1){
                        cart[i].qtde--;                    
                    } else {
                        cart.splice(i, 1)
                    }
                    updateCart();
                } catch(e){
                    throw new Error('Não é possível ter 0 ou menos pizzas');
                }
            });

            query('.cart').append(cartItem);
            
        }
        discount = subtotal * 0.10;
        overall = subtotal - discount;

        query('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`; 
        query('.desconto span:last-child').innerHTML = `R$ ${discount.toFixed(2)}`;
        query('.total span:last-child').innerHTML = `R$ ${overall.toFixed(2)}`;

    } else {
        query('aside').classList.remove('show');
        query('aside').style.left = '100vw'
    }
};

function sizeNamePizza(cart){
    switch(cart) {
        case 0:
            return 'P'
        case 1:
            return 'M'
        case 2:
            return 'G'
    };
};

