//fonction pour afficher la page prendra 2 param :
//param 1 : l'objet retourné par le fetch
//param 2 : l'objet  "cart" d'un tour de boucle du localstorage
function createProducts(objet, cart) {
    // selection de l'endoit ou inserer
    let items = document.querySelector("#cart__items");

    //création de balises
    let newBaliseArticle = document.createElement("article");
    let imgDiv = document.createElement("div");
    let newImg = document.createElement("img");
    let contentDiv = document.createElement("div");
    let pastilleDiv = document.createElement("div");
    let descriptionDiv = document.createElement("div");
    let newName = document.createElement("h2");
    let newParagraphName = document.createElement("p");
    let newParagraphPrice = document.createElement("p");
    let settingsDiv = document.createElement("div");
    let qtyDiv = document.createElement("div");
    let newParagraphQty = document.createElement("p");
    let newInput = document.createElement("input");
    let deletDiv = document.createElement("div");
    let newParagraphDelet = document.createElement("p");

    //definition des attributs et classes des balises
    //pour la balise article
    newBaliseArticle.classList.add("cart__item");
    newBaliseArticle.setAttribute("data-id", objet._id);
    newBaliseArticle.setAttribute("data-color", cart.color);

    //pour la div container de l'image
    imgDiv.classList.add("cart__item__img");

    //pour l'image il faut récupere le product imgUrl et altTxt
    newImg.src = objet.imageUrl;
    newImg.alt = objet.altTxt;

    //pour la div content
    contentDiv.classList.add("cart__item__content");

    //pour la div description
    descriptionDiv.classList.add("cart__item__content__description");

    // //pour le h2 il faut recuperer le product name
    newName.textContent = objet.name;

    // //pour le nom du produit
    newParagraphName.innerText = `color : ${cart.color}`;
    newParagraphPrice.innerText = `${objet.price}  € /unit.`;

    //pour la div settings
    settingsDiv.classList.add("cart__item__content__settings");

    //pour la div quantity
    qtyDiv.classList.add("cart__item__content__settings__quantity");

    // //pour la quantité
    newParagraphQty.innerText = "Qté : ";

    // //pour l'input
    newInput.setAttribute("type", "number");
    newInput.classList.add("itemQuantity");
    newInput.setAttribute("name", "itemQquantity");
    newInput.setAttribute("min", "1");
    newInput.setAttribute("max", "100");
    newInput.setAttribute("value", `${cart.quantity}`);
    //besoin de required??

    //div delete
    deletDiv.classList.add("cart__item__content__settings__delete");

    //le p supprimer
    newParagraphDelet.classList.add("deleteItem");
    newParagraphDelet.setAttribute("id", objet._id);
    newParagraphDelet.setAttribute("color", cart.color);
    newParagraphDelet.innerText = "Supprimer";

    //injecter le tout dans le html
    items.appendChild(newBaliseArticle).appendChild(imgDiv).appendChild(newImg);
    newBaliseArticle.appendChild(contentDiv).appendChild(descriptionDiv)
    descriptionDiv.appendChild(newName);
    descriptionDiv.appendChild(newParagraphName);
    descriptionDiv.appendChild(newParagraphPrice);
    contentDiv.appendChild(settingsDiv).appendChild(qtyDiv).appendChild(newParagraphQty);
    qtyDiv.appendChild(newInput);
    settingsDiv.appendChild(deletDiv).appendChild(newParagraphDelet);



    //facultatif mettre une pastille coloré sur chaque image
    imgDiv.appendChild(pastilleDiv);

    if (cart.color == 'Black/Yellow') {
        pastilleDiv.setAttribute("style", "background-color: yellow; border : solid 6px black ; left-border:8px; width:10px;height:10px ")

    }
    else if (cart.color == 'Black/Red') {
        pastilleDiv.setAttribute("style", "background-color: red ; border : solid 6px black ; left-border:8px; width:10px;height:10px ")

    }
    else {
        pastilleDiv.setAttribute("style", `background-color: ${cart.color}`)
    }

}

//calcul du prix total et du nombre d'articles
// param1 : un objet du fetch
// param2 : un objet cart créé avec les valeurs du local storage
// param3 : un array pour stocker les prix pour chaque article 
// param4 : un array pour stocker les quantités pour chaque article
function createPrices(objet, cart, prix, articles) {
    let sousTotalPrix, totalPrix, totalArticles;
    //recupere le prixtotal et le nb article qu'on stock dans les array
    sousTotalPrix = objet.price * cart.quantity;
    prix.push(sousTotalPrix);
    articles.push(parseInt(cart.quantity));

    //calcul et affichage des prix/quantité total
    totalArticles = articles.reduce((partialSum, a) => partialSum + a, 0);
    totalPrix = prix.reduce((partialSum, a) => partialSum + a, 0);
    document.querySelector("#totalQuantity").innerText = totalArticles;
    document.querySelector("#totalPrice").innerText = totalPrix;
}

//en cas de modification des inputs quantité, d'apres l'array objets
function modifValue(objets) {
    //selection de tous les input
    valueInput = document.querySelectorAll(".itemQuantity");
    //declaration d'un tableau pour enregistrer les valeurs de base
    let valeurAvantChange = [];
    //pour chaque input
    valueInput.forEach(function (input, index) {
        //ajout d'un addeventlistener 'change'
        valeurAvantChange.push(input.value);
        input.addEventListener('change', function () {
            //pour chaque objet de l'array objets
            if (input.value >= 1) {
                valeurAvantChange.splice(index, 1, input.value)
                objets.forEach(objet => {
                    //on prend l'id de l'input qui 'change'            
                    let inputId = input.parentNode.parentNode.parentNode.parentNode.dataset.id;
                    //couleur de l'article de l'input concerné 
                    let inputColor = input.parentNode.parentNode.parentNode.parentNode.dataset.color;
                    //itemId = chaque key de l'array objets = l'id de l'objet
                    itemId = JSON.parse(localStorage.getItem(objet));
                    //item = contenu de l'array correspondant à l'id recherché dans le localsotrage
                    item = JSON.parse(localStorage.getItem(objet._id));

                    //pour chaque couleur de l'array, de 2 en 2 car item = [couleur/quantité]
                    for (i = 0; i <= item.length; i += 2) {
                        if ((item[i] === inputColor) && (inputId === objet._id)) {
                            //mise à jour de la quantity à l'index i+1 où item[i] = couleur
                            item.splice([i + 1], 1, input.value);
                            //mise à jor du local storage
                            localStorage.setItem(objet._id, JSON.stringify(item))

                            //fonction pour calculer le nouveaux prixTotal
                            newPrice(objets);
                        }
                    }
                })
            }
            else {
                //en cas d'erreur d'input NaN
                alert("veuillez saisir un nombre entier");
                //on redefinie la valeur de l'input par son ancienne valeur
                input.value = valeurAvantChange[index];
            }
        })
    });

}

//calcul du nouveau prix et quantité de façon dynamique
function newPrice(objets) {
    let valueInput = document.querySelectorAll(".itemQuantity");
    let totalPrice, totalQ;
    let prix = [];
    let quantites = [];
    let totalPrixParArticle = [];
    //pour chaque objet de l'array objets on push le price dans l'array prix
    objets.forEach(objet => {
        prix.push(parseInt(objet.price));

    });
    //pour chaque input on push la value dans les quantités
    valueInput.forEach(input => {
        quantites.push(parseInt(input.value));
    });

    //calculs des totaux
    for (i = 0; i < quantites.length; i++) {
        totalPrixParArticle.push((parseInt(prix[i]) * parseInt(quantites[i])));
    }
    totalPrice = totalPrixParArticle.reduce((partialSum, a) => partialSum + a, 0);
    totalQ = quantites.reduce((partialSum, a) => partialSum + a, 0);

    //mise à jour du document html
    document.querySelector("#totalQuantity").innerText = totalQ;
    document.querySelector("#totalPrice").innerText = totalPrice;
}

//timer de 1sec
function resolveAfter1Second() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, 1000);
    });
}

//bouton supprimer article
async function deleteArticle(objets) {
    //attendre 1 seconde que la page soit générée, pour éviter les erreurs
    const timer = await resolveAfter1Second();
    //on prend tous les boutons dans un tableau
    let deleteBtns = document.querySelectorAll("p.deleteItem");
    //pour chaque bouton du tableau
    deleteBtns.forEach(function (btn, index) {
        //on écoute le clic du bouton
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            //selecteur de la balise <article> qui contient notre btn
            articleDel = btn.parentNode.parentNode.parentNode.parentNode;
            //recuperation des valeurs id, color, qty
            delId = btn.id;
            delColor = articleDel.dataset.color;
            //selecteur de l'input.value
            delQty = btn.parentNode.parentNode.firstChild.lastChild.value;

            //récupération de l'array du localStorage de l'id de l'obj qu'on va supprimer
            localCart = JSON.parse(localStorage.getItem(delId));

            if (localCart) {
                //on parcourt l'array à l'id du localstrge de 2 en 2 pour regarder chaque couleur
                if (localCart.length > 2) {
                    for (k = 0; k < localCart.length; k = k + 2) {
                        if (localCart[k] === delColor) {
                            localCart.splice(k, 2);
                            //mise à jour de l'array objets
                            objets.splice(index, 1);
                            //mise à jour du local storage                    
                            localStorage.setItem(delId, JSON.stringify(localCart));
                        }
                    }
                }
                else {
                    //si qu'une seul option couleur on suprime l'id du local sotrage
                    localStorage.removeItem(delId);

                };
                //on efface le bloc html
                articleDel.remove();
                // mise à jour du nombre d'article et du prix
                newPrice(objets);
            }
            if (localStorage.length == 0) {
                displayEmpty();
            }
        });
    });
}

//fonction totale pour récupérer l'array des products & comparer & afficher
function getProducts() {
    let prix = [];
    let articles = [];
    let objets = [];
    let totalCart = [];

    if (localStorage.length > 0) {
        //facultatif : mettre une pastille de la couleur optionnelle sur l'image
        let notaBene = document.createElement("p");
        notaBene.innerText = "* pastille de couleur à titre indicatif, non-contractuelle, non représentative de la vraie couleur du produit.";
        document.querySelector(".cart__price").append(notaBene);

        //boucle dans tous le localstorage pour avoir id et array (color, qty)
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).length == 32) {
                let id = localStorage.key(i);
                //avec array = colors, quantity
                let array = JSON.parse(localStorage.getItem(id));

                //pour chaque ID on boucle dans l'array de 2 en 2
                for (let j = 0; j < array.length; j += 2) {
                    let optionColor = array[j];
                    let quantity = array[j + 1];

                    //création d'un objet cart avec l'id la couleur, la qty
                    let cart = { id: id, color: optionColor, quantity: quantity };
                    totalCart.push(cart)
                }
            }
        }

        totalCart.forEach(cart => {
            //method get avec id product
            fetch(`http://localhost:3000/api/products/${cart.id}`)
                .then(function (res) {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .then(function (objet) {
                    objets.push(objet);
                    //fonction pour créer les produit
                    createProducts(objet, cart);
                    //affichage du prix total
                    createPrices(objet, cart, prix, articles);
                })
                .then(function () {
                    //event listener pour supprimer
                    deleteArticle(objets);
                    //event listener sur les input.value
                    modifValue(objets);
                })
                .catch(err => {
                    console.error(`probleme de fetch ${err}`);
                });
        }); // fin for each
    } //fin if localstorage
    if (localStorage.length == 0) {
        displayEmpty();
    }
}

//verification et mise en style des champs du formulaire
function formVerif() {
    let champs = document.querySelectorAll(".cart__order__form__question input");
    //let compteur = 0;
    champs.forEach(champ => {
        champ.addEventListener('focus', function () {
            champ.setAttribute("style", "outline: solid 2px #2c3e50 !important");
        });

        champ.addEventListener('focusout', function (e) {
            e.preventDefault();
            e.stopPropagation();

            //s'il sagit du firstname, lastName
            if ((champ.id === "firstName") ||
                (champ.id === "lastName")) {
                //si input a des digit-s
                if (/\d/.test(champ.value)) {
                    champ.setAttribute("style", "outline: solid 2px red !important");
                    champ.setCustomValidity('Ce champ ne doit contenir aucun chiffre');
                    champ.nextElementSibling.innerText = "Ce champ ne doit contenir aucun chiffre";
                }
                //si input plus petit que 2 character
                else if (champ.value.length < 2) {
                    champ.setCustomValidity('Ce champ doit contenir deux lettres minimum');
                    champ.setAttribute("style", "outline: solid 2px red !important");
                    champ.nextElementSibling.innerText = "Ce champ doit contenir deux lettres minimum";
                }
                //sinon pas de message d'erreur
                else {
                    champ.setAttribute("style", "outline: solid 2px green !important");
                    champ.nextElementSibling.innerText = "";
                    champ.setCustomValidity('');
                }
            }
            // pour le champ email
            if (champ.id === "email") {
                let reg = /\S+@\S+\.\S+/;
                if (reg.test(champ.value)) {
                    champ.setCustomValidity('');
                    champ.nextElementSibling.innerText = "";
                    champ.setAttribute("style", "outline: solid 2px green");
                }
                else {
                    champ.setAttribute("style", "outline: solid 2px red !important");
                    champ.nextElementSibling.innerText = "Adresse e-mail invalide";
                    champ.setCustomValidity('Adresse e-mail invalide !');
                }
            }
            //pour le champ address
            if (champ.id === "address") {
                let reg = /\d+\s+[\s\S]+/;
                // si value matches test
                if (reg.test(champ.value)) {
                    champ.setAttribute("style", "outline: solid 2px green !important");
                    champ.nextElementSibling.innerText = "";
                    champ.setCustomValidity('');
                }
                //si input plus petit que 7 character
                if (champ.value.length < 7) {
                    champ.setCustomValidity('Ce champ doit contenir sept caractères minimum');
                    champ.setAttribute("style", "outline: solid 2px red !important");
                    champ.nextElementSibling.innerText = "Ce champ doit contenir sept caractères minimum";
                }
                //sinon message d'erreur
                else if (!reg.test(champ.value)) {
                    champ.setAttribute("style", "outline: solid 2px red !important");
                    champ.setCustomValidity('Respectez le format Numero Nom de voie');
                    champ.nextElementSibling.innerHTML = 'Respectez le format Numero Nom de voie  <br>  exemple : 42 rue du stade ';
                }
            }
            if (champ.id === "city") {
                if (champ.value.length < 1) {
                    champ.setAttribute("style", "outline: solid 2px red !important");
                    champ.setCustomValidity('Ce champ doit contenir au moins un caractère');
                    champ.nextElementSibling.innerText = "Ce champ doit contenir au moins un caractère";
                }
                else if (/\d/.test(champ.value)) {
                    champ.setAttribute("style", "outline: solid 2px red !important");
                    champ.setCustomValidity('Ce champ ne doit contenir aucun chiffre');
                    champ.nextElementSibling.innerText = "Ce champ ne doit contenir aucun chiffre";
                }
                //sinon pas de message d'erreur
                else {
                    champ.setAttribute("style", "outline: solid 2px green !important");
                    champ.nextElementSibling.innerText = "";
                    champ.setCustomValidity('');
                }
            }
        })
    });
}

//verification de la validité de tous les champs
function formValid() {
    let champs = document.querySelectorAll(".cart__order__form__question input");
    let compteur = 0;
    champs.forEach(champ => {
        if (champ.validity.valid) {
            compteur++;
        }
    });
    if (compteur == 5) {
        return true;
    }
    else {
        return false;
    }
}

//fonction pour le bouton commander
function postCart() {
    document.querySelector("#order").addEventListener('click', function (e) {
        e.preventDefault();

        let products = [];
        let prenom = document.querySelector("#firstName");
        let nom = document.querySelector("#lastName");
        let address = document.querySelector("#address");
        let city = document.querySelector("#city");
        let email = document.querySelector("#email");

        //creation de l'objet contact
        const contact = {
            firstName: prenom.value,
            lastName: nom.value,
            address: address.value,
            city: city.value,
            email: email.value
        };

        let items = document.querySelectorAll(".cart__item");
        //let quantites = document.querySelectorAll(".itemQuantity");
        for (let i = 0; i < items.length; i++) {
            //creation de l'array products
            // products.push({ id: items[i].dataset.id, color: items[i].dataset.color, quantity: quantites[i].value });
            products.push(items[i].dataset.id);
        }

        if (products.length >= 1) {
            //verif du form
            if (!formValid()) {
                alert("Erreur de formulaire : veillez à bien remplir les champs, sans fautes, avant de commander !");
            }
            else {
                //creation de l'objet à envoyer au server
                const dataToSend = {
                    contact,
                    products
                };

                //creation de l'init pour le fetch
                const monInit = {
                    method: 'POST',
                    body: JSON.stringify(dataToSend),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                //creation de la requete pour le fetch
                let maRequete = new Request(`http://localhost:3000/api/products/order/`, monInit);

                //appel du fetch et envoie des data
                fetch(maRequete, monInit)
                    .then(response => response.json())
                    .then(data => {
                        //vidange du local storage
                        localStorage.clear();
                        //recupération de l'id dans les données en réponse
                        localStorage.setItem('orderId', data.orderId);
                        //redirection
                        document.location.href = 'confirmation.html?id=' + data.orderId;
                    });
            }
        }
        else if (products.length == 0) {
            e.preventDefault();
            alert("Panier vide ! Commande impossible");
            window.location.href = "./index.html";
        }
    });
}

//lancer la fonction principale
getProducts();
//fonction pour verifier le formulaire
formVerif();
//bouton commander
postCart();


//fonctions facultatives
//enlever les styles du bouton panier, le notabene et afficher les 0
function displayEmpty (){
    document.querySelector("#titre").innerText = "Votre panier est vide";
    document.querySelector("#totalQuantity").innerText = 0;
    document.querySelector("#totalPrice").innerText = 0;
    document.querySelector(".cart__price").lastChild.innerText = ""; 

    let panierLogo = document.querySelector("#cartLogo");
        panierLogo.classList.remove("panierLogo");
        panierLogo.innerHTML = `Panier`;
}
//ajout d'un style au bouton panier si qqchose dans le panier
function checkCartAndDisplayLogo() {
    if (window.localStorage.length > 0) {
        let panierLogo = document.querySelector("#cartLogo");
        panierLogo.classList.add("panierLogo");
        panierLogo.innerHTML = `Panier <i class="fa-solid fa-cart-shopping">`;
    }
}
checkCartAndDisplayLogo();