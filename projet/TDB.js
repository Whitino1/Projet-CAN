async function actualiserTableauDeBord() {
    const date = inputDate.value;               //on récupère la date
    const liaison = selectLiaison.value;        //on récupère le numéro de la liaison

    if (date === "" || liaison === "") {
        return;     //s'il n'y a rien on n'affiche rien
    }

    corpsTableau.innerHTML = "";

    try {
        const response = await fetch("https://can.iutrs.unistra.fr/api/liaison/" + liaison + "/remplissage/" + date);  //on récupère les données de remplissage de la liaison a la date donnée

        if (!response.ok) {
            throw new Error("Erreur API : " + response.status);     //si ca ne marchee pas, on affiche une erreur
        }

        const data = await response.json();     //on récupère les données dans data

        for (let i = 0; i < data.length; i++) {
            const ligne = document.createElement("tr");         //pour chaque élément, on crée une ligne tr

            const colHeure = document.createElement("td");      //on crée une case pour l'heure
            colHeure.textContent = data[i].heure;               //dans la case créée on met l'heure
            ligne.appendChild(colHeure);                        //puis on ajoute la case a la ligne

            // Passagers
            const colPass = document.createElement("td");       //on crée une case pour les passagers

            let nbP = data[i].nbReservationPassagers;           //on stocke le nombre de passager
            if (nbP == null) {                                  //si la valeur est null on remplace par 0
                nbP = 0;
            }

            let capP = data[i].capacitePassagers;               //on stocke le nombre de place dispo
            if (capP == null) {                                 //si la valeur est null on remplace par 0
                capP = 0;
            }

            let tauxP = 0;                                      
            if (capP > 0) {
                tauxP = Math.round((nbP / capP) * 100);         //on calcul le taux de remplissage de passagers
            }

            colPass.textContent = tauxP + " %";                 //et on ajoute % derrière
            ligne.appendChild(colPass);                         //on ajoute la case a la ligne

            // Véhicules
            const colVehic = document.createElement("td");      //on crée une case véhicule

            let nbV = data[i].nbReservationVoitures;            //on stocke le nombre de véhicules enregistrés
            if (nbV == null) {                                  //si la valeur est null on remplace par 0
                nbV = 0;
            }

            let capV = data[i].capaciteVoitures;                //on stock la capacité du bateaux
            if (capV == null) {                                 //si la valeur est null on remplace par 0
                capV = 0;
            }

            let tauxV = 0;
            if (capV > 0) {
                tauxV = Math.round((nbV / capV) * 100);         //on calcul le taux de remplissage des vehicules
            }

            colVehic.textContent = tauxV + " %";                //et on ajoute % derrière
            ligne.appendChild(colVehic);                        //on ajoute la case a la ligne

            corpsTableau.appendChild(ligne);                    //on ajoute la ligne créée au tableau
        }
    } catch (error) {
        console.error(error);      //si jamais il y a une erreur on affiche qu'il y a une erreur dans la console
    }
}
actualiserTableauDeBord();

