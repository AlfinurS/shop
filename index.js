const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class ProductsList{
    constructor(container = '.products'){
        this.container = container;
        this.goods = [];
        this.allProducts = [];
        this.getProducts()
                .then(data => {
                    this.goods = [...data];
                    this.render()
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
            //console.log(productObj);
            block.insertAdjacentHTML('beforeend',productObj.render())
        }
    }

}

class ProductItem{
	constructor(product, img = 'https://placehold.it/200x150'){
		this.title = product.product_name;
		this.price = product.price;
		this.id = product.id_product;
		this.img = img;
        this.quantity = product.quantity;
	}
	
	render(){
		 return `<div class="product-item" data-id="${this.id}">
                <img src="${this.img}" alt="Some img">
                <h3 class="title">${this.title}</h3>
                <p class="content">${this.price}</p>
                <button class="buy-btn" data-id="${this.id}" 
                                        data-name="${this.title}"
                                        data-price="${this.price}">Купить</button>
            </div>`
	}
}

class CartList {
    constructor(container = '.cart'){
        this.container = container;
        this.goods = [];
        this.getCartProducts()
            .then(data => {
                this.goods = [...data.contents];
                this.render()
            });
        }

    getCartProducts(){
        return fetch(`${API}/getBasket.json`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            })
    }

    deleteProduct(id){
        this.goods.filter(item => item.id === id);
    }

    render() {
        const block = document.querySelector(this.container);
        for(let product of this.goods){
            const productObjCart = new CartItem(product);
            block.insertAdjacentHTML('afterbegin',productObjCart.render())
        }
    }

}


class CartItem {
    constructor(product, img = 'https://placehold.it/200x150'){
		this.title = product.product_name;
		this.price = product.price;
		this.id = product.id_product;
		this.img = img;
        this.quantity = product.quantity;
	}

	render(){
		 return `
                <h4 class="title">${this.title}</h4>
                <p class="content">${this.price}</p>
                <p class="content">${this.quantity}</p>`
	}

}

//const cart = [];
const list = new ProductsList();
list.render();

const cart = new CartList();
cart.render();
