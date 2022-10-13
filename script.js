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
  let ul = document.getElementById("listPokemon");
  let li = document.createElement("li");
  //déclaration d'un p
  let p = document.createElement("p");
  //déclaration d'un h1
  let h1 = document.createElement("h1");
  //déclaration d'une image avec sa balise
  let sprite = `<img src="${data.sprite}">`;
  //Récupère le nom du pokemon
  h1.innerText = `${data.slug}`;
  li.append(h1);
  //Ajoute les li dans le ul
  ul.append(li);
  //Récupère le sprite du pokemon
  p.innerHTML = sprite;
  //Ajoute un attribut au $$
  p.setAttribute("onclick", `agrandirImage(${numeroPokemon})`);
  li.append(p);
  //Ajoute les li dans le ul
  ul.append(li);

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
            pokeball.setAttribute("src", "pokeballPleine.png");
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
