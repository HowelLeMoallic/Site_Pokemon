//import React from 'react';
//import swal from '@sweetalert/with-react';
let datas = [];
let nbPokemon = 1;
let numeroPokemon = 0;
//Fonction permettant de récupérer la saisie pour un nom
//Et d'aller chercher dans l'API via son nom
function saisiePokemon() {

  fetch(`https://pokebuildapi.fr/api/v1/pokemon/`).then(response => response.json()).then(data => research(data));

}


function autoSuggestion(elem) {

  let input = elem.value;

  let list = document.querySelector(".suggestions");

  // Si le texte est vide, alors on arrète la la fonction, et on cache la liste
  if (!input) {
    list.style.display = "none";
    return;
  }

  // variable qui indiquera le nombre de suggestions correspondantes	
  let suggestions = 0;
  // On créer une variable qui contiendra toute les suggestions qui seront affichées
  frag = document.createDocumentFragment();
  
  for (var i = 0, c = datas.length + 1; i < c; i++) {
    // le code qui va venir après
    console.log(input);
  }

  // Si il y a des suggestions qui peuvent être affichées
  if (suggestions) {
    // On vide le contenu de la liste
    list.innerHTML = "";
    // On lui ajoute les différentes suggestions
    list.appendChild(frag);
    // On affiche la liste
    list.style.display = "block";
  } // Sinon s'il n'y en a pas
  else {
    // On cache la liste
    list.style.display = "none";
  }

}
//Fonction pour afficher sur la page
function research(data) {

  //Récupère le champ de saisie de pokemon
  let nomPokemon = document.getElementById("pokemon").value.trim().toLowerCase();
  //Parcours des éléments du tableau 
  for (const element of data) {
    //Si le nom correspond à l'élément 
    if(nomPokemon == element.name.toLowerCase()){
      //Déclarations
      let divListCard = document.getElementById("listCard");
      let divCard = document.createElement("div");
      let divCardBody = document.createElement("div");
      //Ajout d'attributs
      divCard.setAttribute("class", "card");
      divCard.setAttribute("style", "width: 15rem;");
      divCardBody.setAttribute("class", "card-body");
      //déclaration d'un p
      let p = document.createElement("p");
      p.setAttribute("class", "card-text");
      //déclaration d'un h5
      let h5 = document.createElement("h5");
      h5.setAttribute("class", "card-title");
      //déclaration d'une image avec sa balise
      let sprite = `<img src="${element.sprite}">`;
      let pIMg = document.createElement("p");
      pIMg.setAttribute("onclick", `agrandirImage(${numeroPokemon})`);
      pIMg.setAttribute("class", "card-img-top");
      pIMg.innerHTML = sprite;
      //Récupère le nom du pokemon et stocke dans un h5
      h5.innerText = `${element.slug}`;
      divCardBody.append(h5);
      //Ajoute le pImg dans la divCard
      divCard.append(pIMg);
      //Ajoute le divCardBody dans la divCard
      divCard.append(divCardBody);
      //Ajoute le p dans la divCardBody
      divCardBody.append(p);
      //Ajoute le divCardBody dans le divCard
      divCard.append(divCardBody);
      //Ajoute le divCard dans le divListCard
      divListCard.append(divCard);
      //Ajoute l'élément dans le tableau datas
      datas.push(element);
      numeroPokemon++;
      return;
    }
    
  }
 
}

function agrandirImage(numeroPokemon) {
  //Affiche une pop up avec le nom du pokemon
  swal(`Un ${datas[numeroPokemon].slug} sauvage apparaît, voulez-vous l'attrapez ?`, {
    //Image
    icon: `${datas[numeroPokemon].image}`,
    buttons: {
      cancel: "Fuir !",
      catch: {
        text: "Lancer une Pokéball ",
        value: "Attrapé",
      },

    },
  })
    .then((value) => {
      switch (value) {

        case "Attrapé":
          if (nbPokemon < 7) {
            swal("Bravo !", `${datas[numeroPokemon].slug} a été attrapé!`,
              icon = "pokeballFermeture.gif"
            );
            let pokeball = document.getElementById(`pokeball${nbPokemon}`);
            pokeball.setAttribute("src", "pokeballPleine.svg");
            pokeball.setAttribute("onclick", `infoPokemon(${numeroPokemon})`);
            nbPokemon++
          } else {
            swal("Impossible d'attraper ce pokémon, aucun emplacement de libre", "warning");
          }
          break;

        default:
          swal("Vous avez réussir à fuir");
      }
    });
}

function infoPokemon(numeroPokemon) {
  var span = document.createElement("span");
  span.innerHTML =
    `PV : ${datas[numeroPokemon].stats.HP} HP 
    <br> 
    Attaque : ${datas[numeroPokemon].stats.attack}
    <br>
    Défense : ${datas[numeroPokemon].stats.defense}
    <br>
    Attaque Spécial : ${datas[numeroPokemon].stats.special_attack}
    <br>
    Défense Spécial : ${datas[numeroPokemon].stats.special_defense}
    <br>
    Vitesse : ${datas[numeroPokemon].stats.speed}
    `;
  swal({
    //Titre
    title: ` Infos sur ${datas[numeroPokemon].slug}`,
    icon: `${datas[numeroPokemon].image}`,
    //$$
    content: span,
  });
}


window.onload = saisiePokemon();