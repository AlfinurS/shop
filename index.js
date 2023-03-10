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

    deleteProduct(id){
        this.goods.filter(item => item.id === id);
    }

    render() {
        const block = document.querySelector(this.container);
        for(let product of this.goods){
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
                //this.deleteProduct(product);
                console.log(product)
            }
        });
    }

    addProduct(product) {
        // По id продука найти в this.allProducts данный продукт, проверить если его нету, то пушить в this.allProducts и выставлять количество = 1. 
        // Если продукт уже имеется в корзине, найти его индекс в массиве и увеличить у него количество на один.
        console.log(product, this.allProducts);
    }

}


class CartItem {
    constructor(product, img = 'https://placehold.it/200x150'){
		this.title = product.product_name;
		this.price = product.price;
		this.id = product.id_product;
        this.quantity = product.quantity;
	}

	render(){
		 return `
                <h4 class="title">${this.title}</h4>
                <p class="content">${this.price}</p>
                <p class="content">${this.quantity}</p>
                <button class="delete-btn" id="delete-btn" data-id="${this.id}"
                    data-name="${this.title}"
                    data-price="${this.price}"
                >Удалить</button>
                `
	}

}

//const cart = [];
const list = new ProductsList();
list.render();

const cart = new CartList();
cart.render();
