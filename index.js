const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class ProductsList{
    constructor(container = '.products'){
        this.container = container;
        this.goods = [];
        this.allProducts = [];
        this.getProducts()
            .then(data => {
                this.goods = [...data];
                this.render();
                this.addEventListeners()
            });
    }
    getProducts(){
        return fetch(`${API}/catalogData.json`)
        .then(result => result.json())
        .catch(error => {
            console.log(error);
        })
    }
    render() {
        const block = document.querySelector(this.container);
        for(let product of this.goods){
            const productObj = new ProductItem(product);
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend',productObj.render())
        }
    }
    addEventListeners(){
        document.querySelector(this.container).addEventListener('click', e => {
            if (e.target.classList.contains('buy-btn')){
                const idBtnBuy = e.target.dataset.id;
                let product = this.goods.find(product => product.id_product === +idBtnBuy);
                //console.log(product)
                cart.addProduct(product);
            }
        });
    }
}

class ProductItem{
	constructor(product, img = 'https://placehold.it/200x150'){
		this.title = product.product_name;
		this.price = product.price;
		this.id = product.id_product;
		this.img = img;
	}
	
	render(){
		 return `<div class="product-item" data-id="${this.id}">
                <img src="${this.img}" alt="Some img">
                <h3 class="title">${this.title}</h3>
                <p class="content">${this.price}</p>
                <button class="buy-btn" id="buy-btn" data-id="${this.id}" 
                                        data-name="${this.title}"
                                        data-price="${this.price}">Купить</button>
            </div>`
	}
}

class CartList {
    constructor(container = '.cart'){
        this.container = container;
        this.goods = [];
        this.allProducts = [];
        this.getProducts()
            .then(data => {
                this.goods = [...data.contents];
                this.render();
                this.addEventListeners()
            });
    }

    getProducts(){
        return fetch(`${API}/getBasket.json`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            })
    }

    deleteProduct(product){
        const index = this.allProducts.findIndex((item) => item.id === product.id_product);
        if (index === -1) {
            return;
        }
        if (this.allProducts[index].quantity >= 1) {
            --this.allProducts[index].quantity;
            const textCart = document.querySelector(`.cart-item[data-id="${this.allProducts[index].id}"]`);
            textCart.querySelector('.product-quantity').textContent = `Количество: ${this.allProducts[index].quantity}`;
            textCart.querySelector('.product-price').textContent = `${this.allProducts[index].quantity*this.allProducts[index].price}`;
            textCart.querySelector('.title').textContent = `${this.allProducts[index].title}`;
            this.allProducts.splice(this.allProducts.indexOf(product),0);
                if (this.allProducts[index].quantity === 0) {
                    const textCart = document.querySelector(`.cart-item[data-id="${this.allProducts[index].id}"]`);
                    textCart.querySelector('.product-quantity').textContent = `Количество: ${this.allProducts[index].quantity}`;
                    textCart.querySelector('.product-price').textContent = `${this.allProducts[index].quantity*this.allProducts[index].price}`;
                    textCart.querySelector('.title').textContent = `${this.allProducts[index].title}`;
                    this.allProducts.splice(this.allProducts.indexOf(product),0);
                    document.querySelector(`.cart-item[data-id="${this.allProducts[index].id}"]`).remove();
                }
        } else {
            alert('Error');
        }
    }

    render() {
        const block = document.querySelector(this.container);
        //block.innerHTML = "";
        for(const product of this.goods){
            const productObj = new CartItem(product);
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('afterbegin',productObj.render())
        }
    }

    addEventListeners(){
        document.querySelector(this.container).addEventListener('click', e => {
            if (e.target.classList.contains('delete-btn')){
                const idBtnBuy = e.target.dataset.id;
                let product = this.goods.find(product => product.id_product === +idBtnBuy);
                this.deleteProduct(product);
                //console.log(product)
            }
        });
    }

    addProduct(product) {
        // По id продука найти в this.allProducts данный продукт, проверить если его нету, то пушить в this.allProducts и выставлять количество = 1. 
        // Если продукт уже имеется в корзине, найти его индекс в массиве и увеличить у него количество на один.
        const index = this.allProducts.findIndex((item) => item.id === product.id_product);
        if (this.allProducts[index].quantity >= 1) {
            this.allProducts[index].quantity++;
            const textCart = document.querySelector(`.cart-item[data-id="${this.allProducts[index].id}"]`);
            textCart.querySelector('.product-quantity').textContent = `Количество: ${this.allProducts[index].quantity}`;
            textCart.querySelector('.product-price').textContent = `${this.allProducts[index].quantity*this.allProducts[index].price}`;
            console.log(textCart);
         } else {this.allProducts[index].quantity < 1;
                this.allProducts.push(product);
                this.allProducts[index].quantity++;
                const blockCart = `
                <div class="cart-item" data-id="${this.allProducts[index].id}">
                    <h4 class="title">${this.allProducts[index].title}</h4>
                    <p class="product-price">${this.allProducts[index].price}</p>
                    <p class="product-quantity">${this.allProducts[index].quantity}</p>
                    <button class="delete-btn" id="delete-btn" data-id="${this.allProducts[index].id}"
                        data-name="${this.allProducts[index].title}"
                        data-price="${this.allProducts[index].price}"
                    >Удалить</button>
                    </div>
                    `;
                const modalP = document.querySelector('.modal-body');
                console.log(modalP);
                modalP.insertAdjacentHTML('afterbegin',blockCart);
                
            }
    }
}

class CartItem {
    constructor(product){
        this.allProducts = this.allProducts
		this.title = product.product_name;
		this.price = product.price;
		this.id = product.id_product;
        this.quantity = product.quantity;
	}

	render(){
		 return `
            <div class="cart-item" data-id="${this.id}">
                <h4 class="title">${this.title}</h4>
                <p class="product-price">${this.price}</p>
                <p class="product-quantity">${this.quantity}</p>
                <button class="delete-btn" id="delete-btn" data-id="${this.id}"
                    data-name="${this.title}"
                    data-price="${this.price}"
                >Удалить</button>
                `
	}

}


const list = new ProductsList();
list.render();

const cart = new CartList();
cart.render();
