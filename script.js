//import React from 'react';
//import swal from '@sweetalert/with-react';
let datas = [];
let nbPokemon = 1;
let numeroPokemon = 0;
//Fonction permettant de récupérer la saisie pour un nom
//Et d'aller chercher dans l'API via son nom
function saisiePokemon(){

  let nomPokemon = document.getElementById("pokemon").value;
  fetch(`https://pokebuildapi.fr/api/v1/pokemon/${nomPokemon}`).then(response => response.json()).then(data => research(data));

}

//Fonction pour afficher sur la page
function research(data){
  
  let divListCard = document.getElementById("listCard");
  let divCard = document.createElement("div");
  divCard.setAttribute("class", "card");
  divCard.setAttribute("style", "width: 15rem;");
  let divCardBody = document.createElement("div");
  divCardBody.setAttribute("class", "card-body");
  //déclaration d'un p
  let p = document.createElement("p");
  p.setAttribute("class", "card-text");
  //déclaration d'un h5
  let h5 = document.createElement("h5");
  h5.setAttribute("class", "card-title");
  //déclaration d'une image avec sa balise
  let sprite = `<img src="${data.sprite}">`;
  let pIMg = document.createElement("p");
  pIMg.setAttribute("onclick", `agrandirImage(${numeroPokemon})`);
  pIMg.setAttribute("class", "card-img-top");
  pIMg.innerHTML = sprite;
  //Récupère le nom du pokemon
  h5.innerText = `${data.slug}`;
  divCardBody.append(h5);
  //Ajoute les li dans le ul
  divCard.append(pIMg);
  divCard.append(divCardBody);
  divCardBody.append(p);
  //Ajoute les li dans le ul
  divCard.append(divCardBody);

  divListCard.append(divCard);

  datas.push(data);
  numeroPokemon++;

}

function agrandirImage(numeroPokemon){
  
  swal(`Un ${datas[numeroPokemon].slug} sauvage apparaît, voulez-vous l'attrapez ?`, {
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
          if(nbPokemon < 7){
            swal("Bravo !", `${datas[numeroPokemon].slug} a été attrapé!`,
            icon= "pokeballFermeture.gif"
            );
            let pokeball = document.getElementById(`pokeball${nbPokemon}`);
            pokeball.setAttribute("src", "pokeballPleine.svg");
            pokeball.setAttribute("onclick", `infoPokemon(${numeroPokemon})`);
            nbPokemon++
          }else{
            swal("Impossible d'attraper ce pokémon, aucun emplacement de libre", "warning");
          }          
          break;
      
        default:
          swal("Vous avez réussir à fuir");
      }
    });
}

function infoPokemon(numeroPokemon){
  var span = document.createElement("span");
  span.innerHTML=
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
    title :` Infos sur ${datas[numeroPokemon].slug}`,
    icon : `${datas[numeroPokemon].image}`,
    content: span,   
  });
}
