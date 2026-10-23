async function afficherStatistiques() {

    const liaisons = [                                          //on crée une liste contenant les liaisons et les codes de passager et de vehicule en fonction des liaisons
        { id: 1, ca: "ca-l1", pass: "pass-l1", veh: "veh-l1" },  
        { id: 2, ca: "ca-l2", pass: "pass-l2", veh: "veh-l2" },
        { id: 3, ca: "ca-l3", pass: "pass-l3", veh: "veh-l3" },
        { id: 4, ca: "ca-l4", pass: "pass-l4", veh: "veh-l4" }
    ];

    let totalCA = 0;

    for (const liaison of liaisons) {

        try {
            const reponse = await fetch(
                `https://can.iutrs.unistra.fr/api/liaison/${liaison.id}/chiffreAffaire`     // on récupère le CA d'une liaison spécifique
            );      

            if (!reponse.ok) {
                console.error("Erreur réseau :", reponse.status);       //si on arrive pas a recuperer le CA, le message "erreur réseau" s'affiche dans la console
                return;
            }

            const data = await reponse.json();          //on récupère dans data ce qu'on avait demandé plus haut dans reponse

            const ca = Math.round(data.passagers.chiffreAffaire + data.vehicules.chiffreAffaire);       // on calcule le CA total avec l'argent des passager et des véhicules
            totalCA += ca;          //on ajoute ceci au CA total

            document.getElementById(liaison.ca).innerHTML = ca + " €";      //on affiche le ca qu'on vient de calculé
            document.getElementById(liaison.pass).innerHTML = data.passagers.nombre;        //on affiche le nombre de passager
            document.getElementById(liaison.veh).innerHTML = data.vehicules.quantite;       //on affiche la qte de véhicules

        } catch (error) {
            console.error("Erreur lors du chargement de la liaison", liaison.id, ":", error);   // si jamais un e  liaison n'aboutit pas, on affiche dans la console qu'il y a une erreur avec la liaison en question
        }
    }

    document.getElementById("ca-global").innerHTML = Math.round(totalCA) + " €";        //on affiche le CA total sur toutes les liaison
}

afficherStatistiques();








