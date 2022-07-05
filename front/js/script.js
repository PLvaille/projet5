function createProducts(e) {
        // selection de l'endoit ou inserer
        let items = document.querySelector("#items");

        //création de balises
        let newLink = document.createElement("a");
        let newBaliseArticle = document.createElement("article");
        let newImg = document.createElement("img");
        let newH3 = document.createElement("h3");
        let newP = document.createElement("p");

        //definition des attributs et classes des balises
        newLink.setAttribute("href", "./product.html?id=" + e._id);

        newImg.src = e.imageUrl;
        newImg.alt = e.altTxt;

        newH3.textContent = e.name;
        newH3.classList.add("productName");

        newP.textContent = e.description;
        newP.classList.add("productDescription");

        //ajout à la page web
        items.appendChild(newLink).appendChild(newBaliseArticle).appendChild(newImg);
        newBaliseArticle.appendChild(newH3);
        newBaliseArticle.appendChild(newP);
}

//fonction récupérer l'array des products
function getProducts() {
        fetch(`http://localhost:3000/api/products/`)
                .then(function (res) {
                        // si la promesse est résolue on obtient l'array products de Product.js format JSON
                        if (res.ok) {
                                return res.json();
                        }
                })
                .then(function (value) {
                        //récursivité pour générer les elements sur la page
                        value.forEach(element => {
                                createProducts(element);
                        });
                })
                .catch(err => {
                        console.error(`probleme de fetch ${err}`);
                });
}

//execution de la fonction
getProducts();

//facultatif
function checkCartAndDisplayLogo() {
        //
        if (window.localStorage.length > 0) {
                let panierLogo = document.querySelector("#cartLogo");
                panierLogo.classList.add("panierLogo");
                panierLogo.innerHTML = `Panier <i class="fa-solid fa-cart-shopping">`;
        }
        else {
                let panierLogo = document.querySelector("#cartLogo");
                panierLogo.classList.remove("panierLogo");
        }
}
checkCartAndDisplayLogo();