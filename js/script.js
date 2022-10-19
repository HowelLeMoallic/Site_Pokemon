//Déclarations de variables globales
let datas = [];
let nbPokemon = 1;
let numeroPokemon = 0;
let allPokemon;

//Fonction permettant de récupérer la saisie pour un nom
//Et d'aller chercher dans l'API via son nom
async function saisiePokemon() {
  
  fetch(`https://pokebuildapi.fr/api/v1/pokemon/`).then(response => response.json()).then(data =>{ return allPokemon = data});
  
}

//Fonction pour l'auto-suggestion
function autoSuggestion(elem) {

  let input = document.getElementById("pokemon");
  let txt = elem.value;
  let list = document.querySelector(".suggestions");

  // Si le texte est vide, alors on arrète la la fonction, et on cache la liste
  if (!txt) {
    list.style.display = "none";
    return;
  }

  // variable qui indiquera le nombre de suggestions correspondantes	
  let suggestions = 0;
  // On créer une variable qui contiendra toute les suggestions qui seront affichées
  frag = document.createDocumentFragment();
  
  for (const element in myEnum) {
    if (new RegExp("^" + txt, "i").test(`${myEnum[element]}`)) {
      // On créé l'élément HTML "LI"
      var word = document.createElement("li");
      // On l'ajoute au fragment
      frag.appendChild(word);
      // On lui mets comme contenu le mot clef avec en gras les lettres entrées
      // (grâce à une RegEx et à la fonction replace() ^^ )
      word.innerHTML = `${myEnum[element]}`.replace(new RegExp("^(" + txt + ")", "i"), "<strong>$1</strong>");
      // On ajoute le mot clef à l'élément HTML "LI", pour pouvoir le récupérer plus tard
      word.mot = `${myEnum[element]}`;

      // Lorsque le visiteur clique sur le lien
      word.onmousedown = function () {
      // On re-sélectionne le champ de texte		
      input.focus();
      // On remplace sa valeur par le mot clef
      input.value = this.mot;
      // On cache la liste
      list.style.display = "none";

      // On empêche la dé-sélection du champ
      return false;
      };
      // On indique qu'une suggestion a été ajoutée		
      suggestions++;
    }
  }

  // Si il y a des suggestions qui peuvent être affichées
  if (suggestions) {
    // On vide le contenu de la liste
    list.innerHTML = "";
    // On lui ajoute les différentes suggestions
    list.appendChild(frag);
    // On affiche la liste
    list.style.display = "block";
    //input.append(list);
  } // Sinon s'il n'y en a pas
  else {
    // On cache la liste
    list.style.display = "none";
  }

}

// Quand l'utilisateur dé-sélectionne le champ
// (Quand il clique ailleurs sur la page)
document.getElementById("pokemon").onblur = function(){
  // On cache la liste
  document.querySelector(".suggestions").style.display = "none";	
  
};

//Fonction pour afficher sur la page
function research() {

  //Récupère le champ de saisie de pokemon
  let nomPokemon = document.getElementById("pokemon").value.trim().toLowerCase();
  //déclaration d'un p
  let p;
  //Parcours des éléments du tableau 
  for (const element of allPokemon) {
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
      p =  document.createElement("p");
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
  //TODO: Message d'erreur en cas d'erreur lors de la saisie du pokemon
  // if(!p){
    
  //   let div = document.getElementById("saisie");
  //   let p = document.createElement("p");
  //   p.innerText = " Nom de pokémon saisie incorrect, veuillez saisir un nom valide";
  //   p.classList.add("error");
  //   div.append(p);

  // }

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
              icon = "img/pokeballFermeture.gif"
            );
            let pokeball = document.getElementById(`pokeball${nbPokemon}`);
            pokeball.setAttribute("src", "img/pokeballPleine.svg");
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

//Enumération pour les noms des pokemon en fr
//Sert pour l'auto-suggestion
const myEnum = {
  POKEMON1 : 'Bulbizarre', 
  POKEMON2 : 'Herbizarre',
  POKEMON3: 'Florizarre',
  POKEMON4: 'Salamèche',
  POKEMON5: 'Reptincel',
  POKEMON6: 'Dracaufeu',
  POKEMON7: 'Carapuce',
  POKEMON8: 'Carabaffe',
  POKEMON9: 'Tortank',
  POKEMON10: 'Chenipan',
  POKEMON11: 'Chrysacier',
  POKEMON12: 'Papilusion',
  POKEMON13: 'Aspicot',
  POKEMON14: 'Coconfort',
  POKEMON15: 'Dardargnan',
  POKEMON16: 'Roucool',
  POKEMON17: 'Roucoups',
  POKEMON18: 'Roucarnage',
  POKEMON19: 'Rattata',
  POKEMON20: 'Rattatac',
  POKEMON21: 'Piafabec',
  POKEMON22: 'Rapasdepic',
  POKEMON23: 'Abo',
  POKEMON24: 'Arbok',
  POKEMON25: 'Pikachu',
  POKEMON26: 'Raichu',
  POKEMON27: 'Sabelette',
  POKEMON28: 'Sablaireau',
  POKEMON29: 'Nidoran♀',
  POKEMON30: 'Nidorina',
  POKEMON31: 'Nidoqueen',
  POKEMON32: 'Nidoran♂',
  POKEMON33: 'Nidorino',
  POKEMON34: 'Nidoking',
  POKEMON35: 'Mélofée',
  POKEMON36: 'Mélodelfe',
  POKEMON37: 'Goupix',
  POKEMON38: 'Feunard',
  POKEMON39: 'Rondoudou',
  POKEMON40: 'Grodoudou',
  POKEMON41: 'Nosferapti',
  POKEMON42: 'Nosferalto',
  POKEMON43: 'Mystherbe',
  POKEMON44: 'Ortide',
  POKEMON45: 'Rafflesia',
  POKEMON46: 'Paras',
  POKEMON47: 'Parasect',
  POKEMON48: 'Mimitoss',
  POKEMON49: 'Aéromite',
  POKEMON50: 'Taupiqueur',
  POKEMON51: 'Triopikeur',
  POKEMON52: 'Miaouss',
  POKEMON53: 'Persian',
  POKEMON54: 'Psykokwak',
  POKEMON55: 'Akwakwak',
  POKEMON56: 'Férosinge',
  POKEMON57: 'Colossinge',
  POKEMON58: 'Caninos',
  POKEMON59: 'Arcanin',
  POKEMON60: 'Ptitard',
  POKEMON61: 'Têtarte',
  POKEMON62: 'Tartard',
  POKEMON63: 'Abra',
  POKEMON64: 'Kadabra',
  POKEMON65: 'Alakazam',
  POKEMON66: 'Machoc',
  POKEMON67: 'Machopeur',
  POKEMON68: 'Mackogneur',
  POKEMON69: 'Chétiflor',
  POKEMON70: 'Boustiflor',
  POKEMON71: 'Empiflor',
  POKEMON72: 'Tentacool',
  POKEMON73: 'Tentacruel',
  POKEMON74: 'Racaillou',
  POKEMON75: 'Gravalanch',
  POKEMON76: 'Grolem',
  POKEMON77: 'Ponyta',
  POKEMON78: 'Galopa',
  POKEMON79: 'Ramoloss',
  POKEMON80: 'Flagadoss',
  POKEMON81: 'Magnéti',
  POKEMON82: 'Magnéton',
  POKEMON83: 'Canarticho',
  POKEMON84: 'Doduo',
  POKEMON85: 'Dodrio',
  POKEMON86: 'Otaria',
  POKEMON87: 'Lamantine',
  POKEMON88: 'Tadmorv',
  POKEMON89: 'Grotadmorv',
  POKEMON90: 'Kokiyas',
  POKEMON91: 'Crustabri',
  POKEMON92: 'Fantominus',
  POKEMON93: 'Spectrum',
  POKEMON94: 'Ectoplasma',
  POKEMON95: 'Onix',
  POKEMON96: 'Soporifik',
  POKEMON97: 'Hypnomade',
  POKEMON98: 'Krabby',
  POKEMON99: 'Krabboss',
  POKEMON100: 'Voltorbe',
  POKEMON101: 'Électrode',
  POKEMON102: 'Noeunoeuf',
  POKEMON103: 'Noadkoko',
  POKEMON104: 'Osselait',
  POKEMON105: 'Ossatueur',
  POKEMON106: 'Kicklee',
  POKEMON107: 'Tygnon',
  POKEMON108: 'Excelangue',
  POKEMON109: 'Smogo',
  POKEMON110: 'Smogogo',
  POKEMON111: 'Rhinocorne',
  POKEMON112: 'Rhinoféros',
  POKEMON113: 'Leveinard',
  POKEMON114: 'Saquedeneu',
  POKEMON115: 'Kangourex',
  POKEMON116: 'Hypotrempe',
  POKEMON117: 'Hypocéan',
  POKEMON118: 'Poissirène',
  POKEMON119: 'Poissoroy',
  POKEMON120: 'Stari',
  POKEMON121: 'Staross',
  POKEMON122: 'M. Mime',
  POKEMON123: 'Insécateur',
  POKEMON124: 'Lippoutou',
  POKEMON125: 'Élektek',
  POKEMON126: 'Magmar',
  POKEMON127: 'Scarabrute',
  POKEMON128: 'Tauros',
  POKEMON129: 'Magicarpe',
  POKEMON130: 'Léviator',
  POKEMON131: 'Lokhlass',
  POKEMON132: 'Métamorph',
  POKEMON133: 'Évoli',
  POKEMON134: 'Aquali',
  POKEMON135: 'Voltali',
  POKEMON136: 'Pyroli',
  POKEMON137: 'Porygon',
  POKEMON138: 'Amonita',
  POKEMON139: 'Amonistar',
  POKEMON140: 'Kabuto',
  POKEMON141: 'Kabutops',
  POKEMON142: 'Ptéra',
  POKEMON143: 'Ronflex',
  POKEMON144: 'Artikodin',
  POKEMON145: 'Électhor',
  POKEMON146: 'Sulfura',
  POKEMON147: 'Minidraco',
  POKEMON148: 'Draco',
  POKEMON149: 'Dracolosse',
  POKEMON150: 'Mewtwo',
  POKEMON151: 'Mew',
  POKEMON152: 'Germignon',
  POKEMON153: 'Macronium',
  POKEMON154: 'Méganium',
  POKEMON155: 'Héricendre',
  POKEMON156: 'Feurisson',
  POKEMON157: 'Typhlosion',
  POKEMON158: 'Kaiminus',
  POKEMON159: 'Crocrodil',
  POKEMON160: 'Aligatueur',
  POKEMON161: 'Fouinette',
  POKEMON162: 'Fouinar',
  POKEMON163: 'Hoothoot',
  POKEMON164: 'Noarfang',
  POKEMON165: 'Coxy',
  POKEMON166: 'Coxyclaque',
  POKEMON167: 'Mimigal',
  POKEMON168: 'Migalos',
  POKEMON169: 'Nostenfer',
  POKEMON170: 'Loupio',
  POKEMON171: 'Lanturn',
  POKEMON172: 'Pichu',
  POKEMON173: 'Mélo',
  POKEMON174: 'Toudoudou',
  POKEMON175: 'Togepi',
  POKEMON176: 'Togetic',
  POKEMON177: 'Natu',
  POKEMON178: 'Xatu',
  POKEMON179: 'Wattouat',
  POKEMON180: 'Lainergie',
  POKEMON181: 'Pharamp',
  POKEMON182: 'Joliflor',
  POKEMON183: 'Marill',
  POKEMON184: 'Azumarill',
  POKEMON185: 'Simularbre',
  POKEMON186: 'Tarpaud',
  POKEMON187: 'Granivol',
  POKEMON188: 'Floravol',
  POKEMON189: 'Cotovol',
  POKEMON190: 'Capumain',
  POKEMON191: 'Tournegrin',
  POKEMON192: 'Héliatronc',
  POKEMON193: 'Yanma',
  POKEMON194: 'Axoloto',
  POKEMON195: 'Maraiste',
  POKEMON196: 'Mentali',
  POKEMON197: 'Noctali',
  POKEMON198: 'Cornèbre',
  POKEMON199: 'Roigada',
  POKEMON200: 'Feuforêve',
  POKEMON201: 'Zarbi',
  POKEMON202: 'Qulbutoké',
  POKEMON203: 'Girafarig',
  POKEMON204: 'Pomdepik',
  POKEMON205: 'Foretress',
  POKEMON206: 'Insolourdo',
  POKEMON207: 'Scorplane',
  POKEMON208: 'Steelix',
  POKEMON209: 'Snubbull',
  POKEMON210: 'Granbull',
  POKEMON211: 'Qwilfish',
  POKEMON212: 'Cizayox',
  POKEMON213: 'Caratroc',
  POKEMON214: 'Scarhino',
  POKEMON215: 'Farfuret',
  POKEMON216: 'Teddiursa',
  POKEMON217: 'Ursaring',
  POKEMON218: 'Limagma',
  POKEMON219: 'Volcaropod',
  POKEMON220: 'Marcacrin',
  POKEMON221: 'Cochignon',
  POKEMON222: 'Corayon',
  POKEMON223: 'Rémoraid',
  POKEMON224: 'Octillery',
  POKEMON225: 'Cadoizo',
  POKEMON226: 'Démanta',
  POKEMON227: 'Airmure',
  POKEMON228: 'Malosse',
  POKEMON229: 'Démolosse',
  POKEMON230: 'Hyporoi',
  POKEMON231: 'Phanpy',
  POKEMON232: 'Donphan',
  POKEMON233: 'Porygon2',
  POKEMON234: 'Cerfrousse',
  POKEMON235: 'Queulorior',
  POKEMON236: 'Debugant',
  POKEMON237: 'Kapoera',
  POKEMON238: 'Lippouti',
  POKEMON239: 'Élekid',
  POKEMON240: 'Magby',
  POKEMON241: 'Écrémeuh',
  POKEMON242: 'Leuphorie',
  POKEMON243: 'Raikou',
  POKEMON244: 'Entei',
  POKEMON245: 'Suicune',
  POKEMON246: 'Embrylex',
  POKEMON247: 'Ymphect',
  POKEMON248: 'Tyranocif',
  POKEMON249: 'Lugia',
  POKEMON250: 'Ho-Oh',
  POKEMON251: 'Celebi',
  POKEMON252: 'Arcko',
  POKEMON253: 'Massko',
  POKEMON254: 'Jungko',
  POKEMON255: 'Poussifeu',
  POKEMON256: 'Galifeu',
  POKEMON257: 'Braségali',
  POKEMON258: 'Gobou',
  POKEMON259: 'Flobio',
  POKEMON260: 'Laggron',
  POKEMON261: 'Medhyèna',
  POKEMON262: 'Grahyèna',
  POKEMON263: 'Zigzaton',
  POKEMON264: 'Linéon',
  POKEMON265: 'Chenipotte',
  POKEMON266: 'Armulys',
  POKEMON267: 'Charmillon',
  POKEMON268: 'Blindalys',
  POKEMON269: 'Papinox',
  POKEMON270: 'Nénupiot',
  POKEMON271: 'Lombre',
  POKEMON272: 'Ludicolo',
  POKEMON273: 'Grainipiot',
  POKEMON274: 'Pifeuil',
  POKEMON275: 'Tengalice',
  POKEMON276: 'Nirondelle',
  POKEMON277: 'Hélédelle',
  POKEMON278: 'Goélise',
  POKEMON279: 'Bekipan',
  POKEMON280: 'Tarsal',
  POKEMON281: 'Kirlia',
  POKEMON282: 'Gardevoir',
  POKEMON283: 'Arakdo',
  POKEMON284: 'Maskadra',
  POKEMON285: 'Balignon',
  POKEMON286: 'Chapignon',
  POKEMON287: 'Parecool',
  POKEMON288: 'Vigoroth',
  POKEMON289: 'Monaflèmit',
  POKEMON290: 'Ningale',
  POKEMON291: 'Ninjask',
  POKEMON292: 'Munja',
  POKEMON293: 'Chuchmur',
  POKEMON294: 'Ramboum',
  POKEMON295: 'Brouhabam',
  POKEMON296: 'Makuhita',
  POKEMON297: 'Hariyama',
  POKEMON298: 'Azurill',
  POKEMON299: 'Tarinor',
  POKEMON300: 'Skitty',
  POKEMON301: 'Delcatty',
  POKEMON302: 'Ténéfix',
  POKEMON303: 'Mysdibule',
  POKEMON304: 'Galekid',
  POKEMON305: 'Galegon',
  POKEMON306: 'Galeking',
  POKEMON307: 'Méditikka',
  POKEMON308: 'Charmina',
  POKEMON309: 'Dynavolt',
  POKEMON310: 'Élecsprint',
  POKEMON311: 'Posipi',
  POKEMON312: 'Négapi',
  POKEMON313: 'Muciole',
  POKEMON314: 'Lumivole',
  POKEMON315: 'Rosélia',
  POKEMON316: 'Gloupti',
  POKEMON317: 'Avaltout',
  POKEMON318: 'Carvanha',
  POKEMON319: 'Sharpedo',
  POKEMON320: 'Wailmer',
  POKEMON321: 'Wailord',
  POKEMON322: 'Chamallot',
  POKEMON323: 'Camérupt',
  POKEMON324: 'Chartor',
  POKEMON325: 'Spoink',
  POKEMON326: 'Groret',
  POKEMON327: 'Spinda',
  POKEMON328: 'Kraknoix',
  POKEMON329: 'Vibraninf',
  POKEMON330: 'Libégon',
  POKEMON331: 'Cacnea',
  POKEMON332: 'Cacturne',
  POKEMON333: 'Tylton',
  POKEMON334: 'Altaria',
  POKEMON335: 'Mangriff',
  POKEMON336: 'Séviper',
  POKEMON337: 'Séléroc',
  POKEMON338: 'Solaroc',
  POKEMON339: 'Barloche',
  POKEMON340: 'Barbicha',
  POKEMON341: 'Écrapince',
  POKEMON342: 'Colhomard',
  POKEMON343: 'Balbuto',
  POKEMON344: 'Kaorine',
  POKEMON345: 'Lilia',
  POKEMON346: 'Vacilys',
  POKEMON347: 'Anorith',
  POKEMON348: 'Armaldo',
  POKEMON349: 'Barpau',
  POKEMON350: 'Milobellus',
  POKEMON351: 'Morphéo',
  POKEMON352: 'Kecleon',
  POKEMON353: 'Polichombr',
  POKEMON354: 'Branette',
  POKEMON355: 'Skelénox',
  POKEMON356: 'Téraclope',
  POKEMON357: 'Tropius',
  POKEMON358: 'Éoko',
  POKEMON359: 'Absol',
  POKEMON360: 'Okéoké',
  POKEMON361: 'Stalgamin',
  POKEMON362: 'Oniglali',
  POKEMON363: 'Obalie',
  POKEMON364: 'Phogleur',
  POKEMON365: 'Kaimorse',
  POKEMON366: 'Coquiperl',
  POKEMON367: 'Serpang',
  POKEMON368: 'Rosabyss',
  POKEMON369: 'Relicanth',
  POKEMON370: 'Lovdisc',
  POKEMON371: 'Draby',
  POKEMON372: 'Drakhaus',
  POKEMON373: 'Drattak',
  POKEMON374: 'Terhal',
  POKEMON375: 'Métang',
  POKEMON376: 'Métalosse',
  POKEMON377: 'Regirock',
  POKEMON378: 'Regice',
  POKEMON379: 'Registeel',
  POKEMON380: 'Latias',
  POKEMON381: 'Latios',
  POKEMON382: 'Kyogre',
  POKEMON383: 'Groudon',
  POKEMON384: 'Rayquaza',
  POKEMON385: 'Jirachi',
  POKEMON386: 'Deoxys',
  POKEMON387: 'Tortipouss',
  POKEMON388: 'Boskara',
  POKEMON389: 'Torterra',
  POKEMON390: 'Ouisticram',
  POKEMON391: 'Chimpenfeu',
  POKEMON392: 'Simiabraz',
  POKEMON393: 'Tiplouf',
  POKEMON394: 'Prinplouf',
  POKEMON395: 'Pingoléon',
  POKEMON396: 'Étourmi',
  POKEMON397: 'Étourvol',
  POKEMON398: 'Étouraptors',
  POKEMON399: 'Keunotor',
  POKEMON400: 'Castorno',
  POKEMON501: 'Crikzik',
  POKEMON502: 'Mélokrik',
  POKEMON503: 'Lixy',
  POKEMON504: 'Luxio',
  POKEMON505: 'Luxray',
  POKEMON506: 'Rozbouton',
  POKEMON507: 'Roserade',
  POKEMON508: 'Kranidos',
  POKEMON509: 'Charkos',
  POKEMON510: 'Dinoclier',
  POKEMON511: 'Bastiodon',
  POKEMON512: 'Cheniti',
  POKEMON513: 'Cheniselle',
  POKEMON514: 'Papilord',
  POKEMON515: 'Apitrini',
  POKEMON516: 'Apireine',
  POKEMON517: 'Pachirisu',
  POKEMON518: 'Mustébouée',
  POKEMON519: 'Mustéflott',
  POKEMON520: 'Ceribou',
  POKEMON521: 'Ceriflor',
  POKEMON522: 'Sancoki',
  POKEMON523: 'Tritosor',
  POKEMON524: 'Capidextre',
  POKEMON525: 'Baudrive',
  POKEMON526: 'Grodrive',
  POKEMON527: 'Laporeille',
  POKEMON528: 'Lockpin',
  POKEMON529: 'Magirêve',
  POKEMON530: 'Corboss',
  POKEMON531: 'Chaglam',
  POKEMON532: 'Chaffreux',
  POKEMON533: 'Korillon',
  POKEMON534: 'Moufouette',
  POKEMON535: 'Moufflair',
  POKEMON536: 'Archéomire',
  POKEMON537: 'Archéodong',
  POKEMON538: 'Manzaï',
  POKEMON539: 'Mime Jr.',
  POKEMON540: 'Ptiravi',
  POKEMON541: 'Pijako',
  POKEMON542: 'Spiritomb',
  POKEMON543: 'Griknot',
  POKEMON544: 'Carmache',
  POKEMON545: 'Carchacrok',
  POKEMON546: 'Goinfrex',
  POKEMON547: 'Riolu',
  POKEMON548: 'Lucario',
  POKEMON549: 'Hippopotas',
  POKEMON550: 'Hippodocus',
  POKEMON551: 'Rapion',
  POKEMON552: 'Drascore',
  POKEMON553: 'Cradopaud',
  POKEMON554: 'Coatox',
  POKEMON555: 'Vortente',
  POKEMON556: 'Écayon',
  POKEMON557: 'Luminéon',
  POKEMON558: 'Babimanta',
  POKEMON559: 'Blizzi',
  POKEMON560: 'Blizzaroi',
  POKEMON561: 'Dimoret',
  POKEMON562: 'Magnézone',
  POKEMON563: 'Coudlangue',
  POKEMON564: 'Rhinastoc',
  POKEMON565: 'Bouldeneu',
  POKEMON566: 'Élekable',
  POKEMON567: 'Maganon',
  POKEMON568: 'Togekiss',
  POKEMON569: 'Yanmega',
  POKEMON570: 'Phyllali',
  POKEMON571: 'Givrali',
  POKEMON572: 'Scorvol',
  POKEMON573: 'Mammochon',
  POKEMON574: 'Porygon-Z',
  POKEMON575: 'Gallame',
  POKEMON576: 'Tarinorme',
  POKEMON577: 'Noctunoir',
  POKEMON578: 'Momartik',
  POKEMON579: 'Motisma',
  POKEMON580: 'Créhelf',
  POKEMON581: 'Créfollet',
  POKEMON582: 'Créfadet',
  POKEMON583: 'Dialga',
  POKEMON584: 'Palkia',
  POKEMON585: 'Heatran',
  POKEMON586: 'Regigigas',
  POKEMON587: 'Giratina',
  POKEMON588: 'Cresselia',
  POKEMON589: 'Phione',
  POKEMON590: 'Manaphy',
  POKEMON591: 'Darkrai',
  POKEMON592: 'Shaymin',
  POKEMON593: 'Arceus',
  POKEMON594: 'Victini',
  POKEMON595: 'Vipélierre',
  POKEMON596: 'Lianaja',
  POKEMON597: 'Majaspic',
  POKEMON598: 'Gruikui',
  POKEMON599: 'Grotichon',
  POKEMON600: 'Roitiflam',
  POKEMON601: 'Moustillon'

}

//Au chargement de la page, fait appel à la fonction saisisePokemon()
window.onload = saisiePokemon();