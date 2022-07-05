//methode 01 : url slice
// const urlId = window.location.search;
// commande = urlId.slice(4)

//methode 2 : search param
const searchCommandId = (new URL(document.location).searchParams);
const commande = searchCommandId.get('id')


//affichage dans le html
const numeroCommande = document.querySelector("#orderId");
numeroCommande.innerText = commande;

//vidange du local storage
localStorage.clear(); 