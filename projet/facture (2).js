let totalPersonnes = 0;   //on stock indépendaments les totaux de personnes et de véhicules
let totalVehicules = 0;

// Gestionnaire d'événement pour le formulaire
document.getElementById("formReservation").addEventListener("submit", function(e) {
    e.preventDefault(); // On empêche le rechargement de la page
    const idSaisi = document.getElementById("id_res").value;
    if (idSaisi) {
        demarrer(idSaisi); // On lance le chargement avec l'ID saisi
    }
});

async function afficherFactureInfos(id) {
  try {
    const response = await fetch(`https://can.iutrs.unistra.fr/api/reservation/${id}`);   //on récupère les infos de base de la réservation
    if (!response.ok) throw new Error("Réservation non trouvée");
    const data = await response.json();

    document.getElementById("noReserv").innerHTML  = "Réservation n° " + data.id;                 //on affiche le numéro de reservation
    document.getElementById("nomReserv").innerHTML = data.nom;                                    //on affiche le nom de la reservation
    document.getElementById("Trav").innerHTML      = data.portDepart + " → " + data.portArrivee;  //on affiche le port de départ et d'arrivée
    document.getElementById("dat").innerHTML       = data.date;                                   //on affiche la date ou la réservation a été faite
    document.getElementById("dateDepart").innerHTML = data.date + " à " + data.heure;             //on affiche la date de la traversée et l'heure
    document.getElementById("Boat").innerHTML      = data.bateau;                                 //on récupère le nom du bateau
    
    return data.portArrivee;
  } catch (error) {
    console.error("Erreur Infos :", error);   //si ca ne fonctionne pas, on envoi un message d'erreur dans la console
    return "";
  }
}

//fonction qui va lire le fichier JSON local
async function chargerReservationLocale(id) {   //on lit le JSON fourni dans l'énoncé
  try {
    // Note: On suppose ici que le fichier suit le nommage reservationID.json
    const response = await fetch(`reservation${id}.json`);
    const json = await response.json();
    return json[0];                             //le tableau ne contient qu'un objet
  } catch (e) {
    alert("Fichier local introuvable, utilisation des données API uniquement."); // renvoie une erreur
    return null;
  }
}

async function afficherFacturePassagers(id, destination) {
  try {
    const reservationLocale = await chargerReservationLocale(id);   //on récupère passagers + véhicules du fichier
    if (!reservationLocale) return;
    const passagers = reservationLocale.passagers || [];

    // Tarifs par défaut (Tarif Groix)
    let tAdulte  = 18.75;
    let tJeune   = 13.80;
    let tEnfant  = 11.25;
    let tAnimal  = 3.35;

    // On change les tarifs si c'est Belle-Ile (Le Palais)
    if (destination === "Le Palais") {
      tAdulte = 18.80;
      tJeune  = 14.10;
      tEnfant = 11.65;
    }

    // Calcul des quantités à partir des codes catégories du JSON
    let qA  = 0;  //adultes 26+
    let qJ  = 0;  //jeunes 18-25
    let qE  = 0;  //enfants 4-17 
    let qB  = 0;  //bébés
    let qAn = 0;  //animaux

    //on parcourt tous les passagers pour compter par type
    passagers.forEach(p => {
      switch (p.codeCategorie) {
        case "adu26p":   //Adulte de 26 ans et plus
          qA++;
          break;
        case "jeu1825":  //Jeune de 18 à 25 ans inclus
          qJ++;
          break;
        case "enf417":   //Enfant de 4 à 17 ans inclus
          qE++;
          break;
        case "bebm4":    //Bébé moins de 4 ans inclus
          qB++;
          break;
        case "ancomp":   //Animaux accompagnés
          qAn++;
          break;
      }
    });

    // Calcul des totaux (prix ligne) pour chaque catégorie
    let totA  = qA  * tAdulte;
    let totJ  = qJ  * tJeune;
    let totE  = qE  * tEnfant;
    let totAn = qAn * tAnimal;

    // Affichage des prix unitaires et totaux
    document.getElementById("QtePers1").innerHTML      = qA;
    document.getElementById("PrixUnitPers1").innerHTML = tAdulte.toFixed(2) + " €";
    document.getElementById("TotPers1").innerHTML      = totA.toFixed(2) + " €";

    document.getElementById("QtePers2").innerHTML      = qJ;
    document.getElementById("PrixUnitPers2").innerHTML = tJeune.toFixed(2) + " €";
    document.getElementById("TotPers2").innerHTML      = totJ.toFixed(2) + " €";

    document.getElementById("QtePers3").innerHTML      = qE;
    document.getElementById("PrixUnitPers3").innerHTML = tEnfant.toFixed(2) + " €";
    document.getElementById("TotPers3").innerHTML      = totE.toFixed(2) + " €";

    document.getElementById("QtePers4").innerHTML      = qB;
    document.getElementById("PrixUnitPers4").innerHTML = "Free";
    document.getElementById("TotPers4").innerHTML      = "0 €";

    document.getElementById("QtePers5").innerHTML      = qAn;
    document.getElementById("PrixUnitPers5").innerHTML = tAnimal.toFixed(2) + " €";
    document.getElementById("TotPers5").innerHTML      = totAn.toFixed(2) + " €";

    totalPersonnes = totA + totJ + totE + totAn;
    document.getElementById("STPers").innerHTML =
      "Sous total personnes : " + totalPersonnes.toFixed(2) + " €";

    actualiserTotalFinal();
  } catch (error) {
    console.error("Erreur Passagers :", error);   //si il y a une erreur, on le dit dans la console
  }
}

async function afficherFactureVehicule(id) {
  try {
    const reservationLocale = await chargerReservationLocale(id);   //on récupère les info de la réservation pour avoir tous les véhicules
    if (!reservationLocale) return;
    const vehicules = reservationLocale.vehicules || [];

    totalVehicules = 0;  //on réinitialise le total véhicules

    const tbody = document.getElementById("tbodyVehicules");  //initialisation de tbody
    if (tbody) {
      // On garde l'en-tête mais on vide les données précédentes
      tbody.innerHTML = `<tr><th>Catégorie</th><th>Quantité</th><th>Prix unitaire</th><th>Prix ligne</th></tr>`;

      for (let i = 0; i < vehicules.length; i++) {
        let v = vehicules[i];
        let qteVehicule = v.quantite || 0;

        // même principe : on va chercher le tarif unitaire pour ce code de véhicule
        const responsePrix = await fetch(`https://can.iutrs.unistra.fr/api/reservation/${id}/vehicule/${i + 1}`);
        const dataPrix = await responsePrix.json();
        let prixUnitVehicule = dataPrix.prix || 0;

        let totalLigneVehicule = prixUnitVehicule * qteVehicule;

        const tr = document.createElement("tr");  //on crée une nouvelle ligne
        tr.innerHTML =
          "<td>" + v.codeCategorie + "</td>" +
          "<td>" + qteVehicule + "</td>" +
          "<td>" + prixUnitVehicule.toFixed(2) + " €</td>" +
          "<td>" + totalLigneVehicule.toFixed(2) + " €</td>";

        tbody.appendChild(tr);  //on ajoute la ligne au tableau
        totalVehicules += totalLigneVehicule;
      }
    }

    document.getElementById("STVehi").innerHTML =
      "Sous total véhicules : " + totalVehicules.toFixed(2) + " €";

    actualiserTotalFinal();
  } catch (error) {
    console.error("Erreur Véhicules :", error);   //si il y a une erreur, on le dit dans la console
  }
}

function actualiserTotalFinal() {
  let resultatFinal = totalPersonnes + totalVehicules;      //on calcule le total final
  document.getElementById("totalFinal").innerHTML =         //on afiiche le total final
    "Prix total : " + resultatFinal.toFixed(2) + " €";
}

async function demarrer(id) {                     //on lance le tout pour l'afficher
  const destination = await afficherFactureInfos(id);
  await afficherFacturePassagers(id, destination);
  await afficherFactureVehicule(id);
}
