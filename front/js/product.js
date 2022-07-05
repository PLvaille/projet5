// ----------   récupérer l'id via URL de la page
// methode 01
//  const urlId = window.location.search;
// // // on slice les 4 premiers charactères : ?id=
//  const productId = urlId.slice(4);

//methode 2
//const productId = (new URL(document.location).search.slice(4));

//meethode 3
const searchParam = (new URL(document.location).searchParams);
let productId = searchParam.get('id');


//fonction de création/insertion des élements HTML
function createProductById(element) {
    // création de balises 
    //selection ou inserer l'image
    let itemImg = document.querySelector(".item__img");
    //creation et insertion de l'image
    let newProductImg = document.createElement("img");
    newProductImg.src = element.imageUrl;
    newProductImg.alt = element.altTxt;
    itemImg.appendChild(newProductImg);

    // nom du produit dans item__content h1
    let newProductH1 = document.querySelector("#title");
    newProductH1.innerText = element.name;
    // et dans head title
    document.querySelector("#pageTitle").innerText = element.name;
    // prix dans item__content p span
    let newProductPrice = document.querySelector("#price");
    newProductPrice.innerText = element.price;
    // description dans l'id description
    let newProductDescription = document.querySelector("#description");
    newProductDescription.innerText = element.description;
    // ajout des options dans l'id colors 
    const colors = element.colors;
    colors.forEach(color => {
        let colorsLocation = document.querySelector("#colors");
        let createOption = document.createElement("option");
        createOption.setAttribute("value", color);
        createOption.innerText = color;
        colorsLocation.appendChild(createOption);
    });
} //fin fonction createProductById();

function getOneProduct(){
fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function (res) {
      if(res.ok){
          return res.json();
      }  
    })
    .then(function (value) {
        createProductById(value);
    })
}

//appel de la fonction principale
getOneProduct();
checkCartAndDisplayLogo();

// envent listener sur le bouton addToCart
const addToCart = document.querySelector("#addToCart").addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    //recuperation des variables 
    const quantity = document.querySelector("#quantity").value;
    const colors = document.querySelector("#colors").value;

    //conditions quantity entre 0 et 100 et colors = true               
        if (colors && (quantity > 0) && (quantity <= 100)) {

        //verif si deja panier avec le nom productId
        let panierExist = JSON.parse(localStorage.getItem(productId));
        if (panierExist) {
            if (panierExist.includes(colors)) {
                let index = panierExist.indexOf(colors);
                    
               
                let ancienneValeur = parseInt(panierExist[index + 1]);
                let valeurAjoute = parseInt(quantity);
                let total = parseInt(ancienneValeur + valeurAjoute);
            
                panierExist[index] = colors;
                panierExist[index + 1] = total;
                localStorage.setItem(productId, JSON.stringify(panierExist))
            }
            else {
                let index = panierExist.length;
                panierExist[index] = colors
                panierExist[index + 1] = parseInt(quantity);
                localStorage.setItem(productId, JSON.stringify(panierExist));
            }

        }
        else {
            cart = [colors, parseInt(quantity)];
            localStorage.setItem(productId, JSON.stringify(cart));
        }
        alert("Article(s) ajouté(s) au panier");
        checkCartAndDisplayLogo();
    }
    //fin if (colors && quantity > 0);
    else {
        alert("Erreure sur votre panier, merci d'indiquer la couleur souhaitée ansi que la quantité (entre 1 et 100)");
        console.error("erreur de panier");
    }
});

// facultatif : ajouter une notif sur le bouton cart si localCart = true
function checkCartAndDisplayLogo() {
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