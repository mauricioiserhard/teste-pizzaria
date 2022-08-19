// Variaveis
const s = (el) => document.querySelector(el);
const all = (el) => document.querySelectorAll(el);
let cart = [];
let modalQt = 1;
let modalKey = 0;
let size = 0;
let priceIndex = 0;
let identifier = '';

// Lista pizzas
pizzaJson.map((item, index)=> {

  // clone modelo estrutura de pizza
  let pizzaItem = s('.models .pizza-item').cloneNode(true);

  // identificando pizza
  pizzaItem.setAttribute('data-key', index);

  // add image, pizza name, description e price
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector('.pizza-item--price').innerHTML = '';
  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.prices[priceIndex].toFixed(2)} ${item.sizes[priceIndex]}`;
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

  // add evento clique
  pizzaItem.querySelector('.pizza-item a').addEventListener('click', (e)=>{
    e.preventDefault();

    // identificando pizza e preenchendo
    let key = e.target.closest('.pizza-item').getAttribute('data-key');
    modalQt = 1;
    modalKey = key; // guarda info do tipo de pizza na variavel modalKey
    priceIndex = 2; // seta preco de acordo com tamanho
    s('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    s('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    s('.pizzaBig img').src = pizzaJson[key].img;
    s('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].prices[priceIndex].toFixed(2)}`;
    s('.pizzaInfo--size.selected').classList.remove('selected');
    all('.pizzaInfo--size').forEach((size, sizeIndex)=> {
      if(sizeIndex==2) {
        size.classList.add('selected');
      }
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    });
    s('.pizzaInfo--qt').innerHTML = modalQt;

    // abrindo janela (modal)
    s('.pizzaWindowArea').style.opacity = 0;
    s('.pizzaWindowArea').style.display = 'flex';
    setTimeout(()=>{ // criando delay para abrir.
      s('.pizzaWindowArea').style.opacity = 1;
    }, 100);
  });

  // preenchendo info (modal)
  s('.pizza-area').append(pizzaItem);
  
  // Pressionar 'esc' para sair da janela (modal)
  s('body').addEventListener('keyup', (event)=> {
    let esc = event.keyCode;
    if(esc==27) closeModal();
  }); 
});


// Acoes modal 
// diminuindo quantidade
s('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
  if(modalQt>1) {
  modalQt--;
  s('.pizzaInfo--qt').innerHTML = modalQt;
  updatePrice();
  } else {
    closeModal()
  }
});

// aumentando quantidade
s('.pizzaInfo--qtmais').addEventListener('click', ()=>{
  modalQt++;
  s('.pizzaInfo--qt').innerHTML = modalQt;
  updatePrice();
});

// selecionando tamanho
all('.pizzaInfo--size').forEach((size, sizeIndex)=> {
  size.addEventListener('click', ()=>{
    s('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
    priceIndex = size.getAttribute('data-key');
    updatePrice();
  });
});

// add ao carrinho
s('.pizzaInfo--addButton').addEventListener('click', ()=>{
  let size = parseInt(s('.pizzaInfo--size.selected').getAttribute('data-key'));
  let identifier = pizzaJson[modalKey].id+'@'+size;
  let key = cart.findIndex((item)=>item.identifier == identifier); // checa se o identifier ja ta no carrinho
  if(key > -1) {
      cart[key].qt += modalQt;
    } else {
      cart.push({
        identifier,
        id:pizzaJson[modalKey].id,
      size,
      price:pizzaJson[modalKey].prices[size],
      qt:modalQt
    });
    }
    updateCart();
    closeModal();
  });

// abre carrinho mobile
s('.menu-openner').addEventListener('click', ()=>{
  if(cart.length > 0) {
    s('aside').style.left = '0';
  }
})
// fecha carrinho mobile
s('.menu-closer').addEventListener('click', ()=> {
  s('aside').style.left = '100vw';
})


// abre janela (order-close)
s('.cart--finalizar').addEventListener('click', ()=>{
  s('.forecast').style.color = 'transparent';
  setTimeout(()=>{
    s('.forecast').innerHTML = 'Previsão de entrega: 30 minutos';
    s('.forecast').style.color = '#000000';
  }, 7000);
  
  s('.endingArea').style.opacity = 0;
  s('.endingArea').style.display = 'flex';
  setTimeout(()=>{ // cria delay para abrir
    s('.endingArea').style.opacity = 1;
  }, 100);
});

function updateCart() {
  s('.menu-openner span').innerHTML = cart.length;
  if(cart.length > 0) {
    s('aside').classList.add('show');
    s('.cart').innerHTML = '';
    let subtotal = 0;
    let discount = 0;
    let total = 0;
    
    for(let i in cart) {
    let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
    
    subtotal += cart[i].price * cart[i].qt;
    
    let cartItem = s('.models .cart--item').cloneNode(true);

    let pizzaName = `${pizzaItem.name} ${pizzaItem.sizes[cart[i].size]}`;
    
    cartItem.querySelector('img').src = pizzaItem.img;
    cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
    cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
    cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
      if(cart[i].qt > 1) {
        cart[i].qt--;
      } else {
        cart.splice(i, 1);
      }
      updateCart();
    });
    cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
      cart[i].qt++;
      updateCart();
    });
    s('.cart').append(cartItem);
  }
  
  discount = subtotal * 0.1;
  total = subtotal - discount;
  
  s('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
  s('.discount span:last-child').innerHTML = `R$ ${discount.toFixed(2)}`;
  s('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    s('aside').classList.remove('show');
    s('aside').style.left = '100vw';
  }
}

function closeEnding() { 
  s('.endingArea').style.opacity = 0;
  setTimeout(()=>{
    s('.endingArea').style.display = 'none';
  }, 500);
}

function closeModal() { 
  s('.pizzaWindowArea').style.opacity = 0;
  setTimeout(()=>{
    s('.pizzaWindowArea').style.display = 'none';
  }, 500);
  window.scrollTo({ // move tela devagar para o topo
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}

function updatePrice() {
  s('.pizzaInfo--actualPrice').innerHTML = `R$ ${(pizzaJson[modalKey].prices[priceIndex]*modalQt).toFixed(2)}`;
} 