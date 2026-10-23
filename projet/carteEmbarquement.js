const id_reservation = 54;

async function afficherInfosVoyage() {
    try {
		const reponse = await fetch(`https://can.iutrs.unistra.fr/api/reservation/${id_reservation}`); //on récupère les infos d'une reservation spécifique
		 if (!reponse.ok) {
			alert("La requête n'a pas abouti");     //si on n'arrive pas a récuperer les infos, une boite d'alerte s'affiche en haut disant "La requête n'a pas abouti"
			return;
		}
        const data = await reponse.json(); //on met dans data les resultat de la requete
        
        document.getElementById("GareDepart").innerHTML = data.portDepart;                  // on affiche les infos nécessaire sur la carte d'embarquement tel que le port de depart, d'arrivée, la date, l'heure, le bateau, le numéro de reservation et le nom de la reservation
        document.getElementById("GaredArrivee").innerHTML = data.portArrivee;
        document.getElementById("Date").innerHTML = data.date;
        document.getElementById("HDep").innerHTML = data.heure;
        document.getElementById("Bateau").innerHTML = data.bateau;
        document.getElementById("noReserv").innerHTML = data.id;
        document.getElementById("nomReserv").innerHTML = data.nom;
    } catch (error) {
        console.error("Erreur trajet :", error);        //si jamais on a eu l'erreur plus tot, on affiche dans la console qu'il y a une erreur
    }
}

async function afficherCartePassager() {
    const id_passager = 1;
    try {
        const reponse = await fetch(`https://can.iutrs.unistra.fr/api/reservation/${id_reservation}/passager/${id_passager}`);    //on récupère les infos du passager 1 de notre liaison
		 if (!reponse.ok) {
			alert("La requête n'a pas abouti");  //si on n'arrive pas a récuperer les infos, une boite d'alerte s'affiche en haut disant "La requête n'a pas abouti"
			return;
		}
        const data = await reponse.json();   //on met dans data les resultat de la requete

        document.getElementById("passager_info").innerHTML = `Passager : <br><img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Passager${id_passager}" alt="QR Code">`;   //on affiche le qr code de la carte d'embarquement du passager
        document.getElementById("nom_passager").innerHTML = "Nom : " + data.nom;            //on affiche le nom du passager
        document.getElementById("prenom_passager").innerHTML = "Prénom : " + data.prenom;   //on affiche le prenom du passager
        document.getElementById("cat_passager").innerHTML = "Catégorie : " + data.libelleCategorie;     //on affiche si c'est un enfant, un ado, un animal
        document.getElementById("prix_passager").innerHTML = "Prix : " + data.price + " €";     //on affiche le prix de son billet
    } catch (error) {
        console.error("Erreur passager :", error);  //si jamais on a eu l'erreur plus tot, on affiche dans la console qu'il y a une erreur
    }
}

async function afficherCarteVehicule() {
    const id_vehicule = 1;
    try {
        const reponse = await fetch(`https://can.iutrs.unistra.fr/api/reservation/${id_reservation}/vehicule/${id_vehicule}`); //on récupère les infos du vehicule 1 de notre liaison
        
        if (!reponse.ok) {
			alert("La requête n'a pas abouti"); //si on n'arrive pas a récuperer les infos, une boite d'alerte s'affiche en haut disant "La requête n'a pas abouti"
			return;
		}

        const data = await reponse.json();  //on met dans data les resultat de la requete

        document.getElementById("vehicule_info").innerHTML = `Véhicule : <br><img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Vehicule${id_vehicule}" alt="QR Code">`;   //on affiche le qr code de la carte d'embarquement du véhicule
        document.getElementById("cat_vehicule").innerHTML = "Catégorie : " + data.libelle;      //on affiche si c'est une trotinette, une voiture, un camping car, ...
        document.getElementById("nb_vehicule").innerHTML = "Nombre : 1";                    // on affiche le numéro du véhicule
        document.getElementById("prix_vehicule").innerHTML = "Prix : " + data.prix + " €";  //on afficher le prix a payer pour faire la traversée avec le véhicule
    } catch (error) {
        console.error("Erreur véhicule :", error);       //si jamais on a eu l'erreur plus tot, on affiche dans la console qu'il y a une erreur
    }
}

afficherInfosVoyage();          // cette ligne et les suivantes servent a envoyer les infos a la page html
afficherCartePassager();
afficherCarteVehicule();
