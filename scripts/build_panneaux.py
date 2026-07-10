# -*- coding: utf-8 -*-
"""
Construit le catalogue des panneaux (dataset) a partir du PDF `courses/liste_panneaux.pdf`
et des images deja extraites dans `images_extraites/`.

Pour chaque page ciblee :
  - on recupere les images dans le MEME ordre que scripts/extract_img.py
    (page.get_images(full=True) -> pageX_img{idx}.jpeg)
  - on les trie en ordre de lecture (lignes haut->bas, colonnes gauche->droite)
  - on associe a chaque panneau son label (code, nom, categorie) lu visuellement
  - on copie le crop vers my-autoecole/public/panneaux/<id>.jpeg
  - on ecrit my-autoecole/src/data/panneaux.json

Chaque entree de label est un tuple :
    (code, nom, categorie)                -> id = code
    (code, nom, categorie, id)            -> id explicite (doublons de code)
"""
import json
import os
import shutil
import pymupdf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = os.path.join(ROOT, "courses", "liste_panneaux.pdf")
SRC_IMGS = os.path.join(ROOT, "images_extraites")
OUT_IMGS = os.path.join(ROOT, "my-autoecole", "public", "panneaux")
OUT_JSON = os.path.join(ROOT, "my-autoecole", "src", "data", "panneaux.json")

# Libelles lisibles des categories
CATEGORIES = {
    "danger":          "Panneau de danger",
    "intersection":    "Intersection et priorite",
    "interdiction":    "Interdiction",
    "obligation":      "Obligation",
    "zone":            "Entree de zone",
    "fin":             "Fin de prescription / sortie de zone",
    "indication":      "Indication",
    "services":        "Services (CE)",
    "localisation":    "Localisation et bornes",
    "direction":       "Signalisation directionnelle",
    "balise":          "Balise",
    "passage_niveau":  "Passage a niveau",
    "temporaire":      "Signalisation temporaire / chantier",
}

# Labels en ORDRE DE LECTURE pour chaque page ciblee.
D = "danger"; IX = "intersection"; IN = "interdiction"; OB = "obligation"
ZO = "zone"; FN = "fin"; ID = "indication"; SV = "services"; LO = "localisation"
DR = "direction"; BA = "balise"; PN = "passage_niveau"; TP = "temporaire"

PAGES = {
 7: [
    ("A1a", "Virage a droite", D),
    ("A1b", "Virage a gauche", D),
    ("A1c", "Succession de virages dont le premier est a droite", D),
    ("A1d", "Succession de virages dont le premier est a gauche", D),
    ("A2a", "Cassis ou dos-d'ane", D),
    ("A2b", "Ralentisseur de type dos-d'ane", D),
    ("A3", "Chaussee retrecie", D),
    ("A3a", "Chaussee retrecie par la droite", D),
    ("A3b", "Chaussee retrecie par la gauche", D),
    ("A4", "Chaussee particulierement glissante", D),
    ("A6", "Pont mobile", D),
    ("A7", "Passage a niveau muni de barrieres a fonctionnement manuel", D),
    ("A8", "Passage a niveau sans barrieres ni demi-barrieres", D),
    ("A9", "Traversee de voies de tramways", D),
    ("A13a", "Endroit frequente par les enfants", D),
    ("A13b", "Passage pour pietons", D),
    ("A14", "Autres dangers", D),
    ("A15a1", "Passage d'animaux domestiques", D, "A15a1"),
    ("A15a2", "Passage d'animaux domestiques", D, "A15a2"),
    ("A15b", "Passage d'animaux sauvages", D),
    ("A15c", "Passage de cavaliers", D),
    ("A16", "Descente dangereuse", D),
    ("A17", "Annonce de feux tricolores", D),
    ("A18", "Circulation dans les deux sens", D),
    ("A19", "Risque de chute de pierres", D),
    ("A20", "Debouche sur un quai ou une berge", D),
    ("A21", "Debouche de cyclistes venant de droite ou de gauche", D),
 ],
 8: [
    ("A23", "Traversee d'une aire de danger aerien", D),
    ("A24", "Vent lateral", D),
    ("AB1", "Ceder le passage a la ou aux routes situees a droite", IX),
    ("AB2", "Intersection avec une route sans caractere prioritaire", IX),
    ("AB3a", "Cedez le passage a l'intersection (signal de position)", IX),
    ("AB3b", "Cedez le passage a l'intersection (signal avance)", IX),
    ("AB4", "STOP - Arret a l'intersection (signal de position)", IX),
    ("AB5", "Arret a l'intersection (signal avance)", IX),
    ("AB6", "Caractere prioritaire d'une route", IX),
    ("AB7", "Fin du caractere prioritaire d'une route", IX),
    ("AB25", "Carrefour a sens giratoire", IX),
 ],
 9: [
    ("B0", "Circulation interdite a tout vehicule dans les deux sens", IN),
    ("B1", "Sens interdit a tout vehicule", IN),
    ("B2a", "Interdiction de tourner a gauche a la prochaine intersection", IN),
    ("B2b", "Interdiction de tourner a droite a la prochaine intersection", IN),
    ("B2c", "Interdiction de faire demi-tour", IN),
    ("B3", "Interdiction de depasser", IN),
    ("B3a", "Interdiction de depasser pour les vehicules de plus de 3,5 t", IN),
    ("B4", "Arret au poste de douane", IN),
    ("B5a", "Arret au poste de gendarmerie", IN),
    ("B5b", "Arret au poste de police", IN),
    ("B5c", "Arret au poste de peage", IN),
    ("B6a1", "Stationnement interdit", IN),
    ("B6a2", "Stationnement interdit du 1er au 15 du mois", IN),
    ("B6a3", "Stationnement interdit du 16 a la fin du mois", IN, "B6a3"),
    ("B6a3", "Stationnement interdit du 16 a la fin du mois", IN, "B6a3-2"),
    ("B6b1", "Entree de zone a stationnement interdit", ZO),
    ("B6b2", "Entree de zone a stationnement unilateral a alternance semi-mensuelle", ZO),
    ("B6b3", "Entree de zone a stationnement de duree limitee (disque)", ZO),
    ("B6b3-ancien", "Entree de zone a stationnement de duree limitee 1h30 (disque)", ZO, "B6b3-ancien"),
    ("B6b4", "Entree de zone a stationnement payant", ZO),
    ("B6b5", "Entree de zone a stationnement unilateral et duree limitee", ZO),
    ("B6b5-ancien", "Entree de zone a stationnement unilateral et duree limitee 1h30", ZO, "B6b5-ancien"),
    ("B6d", "Arret et stationnement interdits", IN),
    ("B7a", "Acces interdit aux vehicules a moteur sauf cyclomoteurs", IN),
 ],
 10: [
    ("B7b", "Acces interdit a tous les vehicules a moteur", IN),
    ("B8", "Acces interdit aux vehicules de transport de marchandises", IN),
    ("B9a", "Acces interdit aux pietons", IN),
    ("B9b", "Acces interdit aux cycles", IN),
    ("B9c", "Acces interdit aux vehicules a traction animale", IN),
    ("B9d", "Acces interdit aux vehicules agricoles a moteur", IN),
    ("B9e", "Acces interdit aux voitures a bras", IN),
    ("B9f", "Acces interdit aux vehicules de transport en commun de personnes", IN),
    ("B9g", "Acces interdit aux cyclomoteurs", IN),
    ("B9h", "Acces interdit aux motocyclettes", IN),
    ("B9i", "Acces interdit aux vehicules avec caravane ou remorque de plus de 250 kg", IN),
    ("B10a", "Acces interdit aux vehicules trop longs", IN),
    ("B11", "Acces interdit aux vehicules trop larges", IN),
    ("B12", "Acces interdit aux vehicules trop hauts", IN),
    ("B13", "Acces interdit aux vehicules dont le PTAC excede le nombre indique", IN),
    ("B13a", "Acces interdit aux vehicules trop lourds par essieu", IN),
    ("B14", "Limitation de vitesse a 50 km/h", IN, "B14-50"),
    ("B14", "Limitation de vitesse a 130 km/h", IN, "B14-130"),
    ("B14", "Limitation de vitesse a 110 km/h", IN, "B14-110"),
    ("B14", "Limitation de vitesse a 90 km/h", IN, "B14-90"),
    ("B14", "Limitation de vitesse a 70 km/h", IN, "B14-70"),
    ("B14", "Limitation de vitesse a 30 km/h", IN, "B14-30"),
    ("B15", "Cedez le passage a la circulation venant en sens inverse", IN),
    ("B16", "Signaux sonores interdits", IN),
 ],
 11: [
    ("B17", "Interdiction de circuler sans intervalle minimal entre vehicules", IN),
    ("B18a", "Acces interdit aux vehicules transportant des marchandises explosives ou inflammables", IN),
    ("B18b", "Acces interdit aux vehicules transportant des marchandises polluant les eaux", IN),
    ("B18c", "Acces interdit aux vehicules transportant des marchandises dangereuses", IN),
    ("B19", "Autres interdictions (inscription sur le panneau)", IN),
    ("B21-1", "Obligation de tourner a droite avant le panneau", OB, "B21-1"),
    ("B21-2", "Obligation de tourner a gauche avant le panneau", OB, "B21-2"),
    ("B21a1", "Contournement obligatoire par la droite", OB),
    ("B21a2", "Contournement obligatoire par la gauche", OB),
    ("B21b", "Direction obligatoire a la prochaine intersection : tout droit", OB),
    ("B21c1", "Direction obligatoire a la prochaine intersection : a droite", OB),
    ("B21c2", "Direction obligatoire a la prochaine intersection : a gauche", OB),
    ("B21d1", "Directions obligatoires : tout droit ou a droite", OB),
    ("B21d2", "Directions obligatoires : tout droit ou a gauche", OB),
    ("B21e", "Directions obligatoires : a droite ou a gauche", OB),
    ("B22a", "Piste ou bande obligatoire pour cycles", OB),
    ("B22b", "Chemin obligatoire pour pietons", OB),
    ("B22c", "Chemin obligatoire pour cavaliers", OB),
    ("B25", "Vitesse minimale obligatoire", OB),
    ("B26", "Chaines a neige obligatoires sur au moins deux roues motrices", OB),
    ("B27a", "Voie reservee aux vehicules de transport en commun", OB),
    ("B27b", "Voie reservee aux tramways", OB),
    ("B29", "Autres obligations (inscription sur le panneau)", OB),
    ("B30", "Entree de zone a vitesse limitee a 30 km/h", ZO),
 ],
 12: [
    ("B31", "Fin de toutes les interdictions precedemment signalees", FN),
    ("B33", "Fin de limitation de vitesse (70 km/h)", FN, "B33-70"),
    ("B33", "Fin de limitation de vitesse (50 km/h)", FN, "B33-50"),
    ("B33", "Fin de limitation de vitesse (30 km/h)", FN, "B33-30"),
    ("B33", "Fin de limitation de vitesse (90 km/h)", FN, "B33-90"),
    ("B33", "Fin de limitation de vitesse (110 km/h)", FN, "B33-110"),
    ("B34", "Fin d'interdiction de depasser (notifiee par B3)", FN),
    ("B34a", "Fin d'interdiction de depasser (notifiee par B3a)", FN),
    ("B35", "Fin d'interdiction de l'usage de l'avertisseur sonore", FN),
    ("B39", "Fin d'interdiction (inscription sur le panneau)", FN),
    ("B40", "Fin de piste ou bande obligatoire pour cycles", FN),
    ("B41", "Fin de chemin obligatoire pour pietons", FN),
    ("B42", "Fin de chemin obligatoire pour cavaliers", FN),
    ("B43", "Fin de vitesse minimale obligatoire", FN),
    ("B44", "Fin d'obligation de l'usage des chaines a neige", FN),
    ("B45", "Fin de voie reservee aux vehicules de transport en commun", FN),
    ("B49", "Fin d'obligation (inscription sur le panneau)", FN),
    ("B50a", "Sortie de zone a stationnement interdit", FN),
    ("B50b", "Sortie de zone a stationnement unilateral a alternance semi-mensuelle", FN),
    ("B50c", "Sortie de zone a stationnement de duree limitee (disque)", FN),
    ("B50c-ancien", "Sortie de zone a stationnement de duree limitee 1h30 (disque)", FN, "B50c-ancien"),
    ("B50d", "Sortie de zone a stationnement payant", FN),
    ("B50e", "Sortie de zone a stationnement unilateral et duree limitee", FN),
    ("B50e-ancien", "Sortie de zone a stationnement unilateral et duree limitee 1h30", FN, "B50e-ancien"),
    ("B51", "Sortie de zone a vitesse limitee a 30 km/h", FN),
    ("B52", "Entree d'une zone de rencontre", ZO),
    ("B53", "Sortie d'une zone de rencontre", FN),
 ],
 13: [
    ("C1a", "Lieu amenage pour le stationnement", ID),
    ("C1b", "Stationnement gratuit a duree limitee (disque)", ID),
    ("C1b-ancien", "Stationnement gratuit a duree limitee 1h30 (disque)", ID, "C1b-ancien"),
    ("C1c", "Lieu amenage pour le stationnement payant", ID),
    ("C3", "Risque d'incendie", ID),
    ("C4a", "Vitesse conseillee", ID),
    ("C4b", "Fin de vitesse conseillee", ID),
    ("C5", "Station de taxis", ID),
    ("C6", "Arret d'autobus", ID),
    ("C8", "Emplacement d'arret d'urgence", ID),
    ("C12", "Circulation a sens unique", ID),
    ("C13a", "Impasse", ID),
    ("C13b", "Presignalisation d'une impasse", ID),
    ("C14", "Praticabilite d'une section de route", ID, "C14-1"),
    ("C14", "Praticabilite d'une section de route", ID, "C14-2"),
    ("C14", "Praticabilite d'une section de route", ID, "C14-3"),
    ("C14", "Praticabilite d'une section de route", ID, "C14-4"),
    ("C18", "Priorite par rapport a la circulation venant en sens inverse", ID),
    ("C20a", "Passage pour pietons", ID),
    ("C20c", "Traversee de tramways", ID),
    ("C23", "Stationnement reglemente pour caravanes et autocaravanes", ID),
    ("B54", "Entree d'aire pietonne", ZO),
    ("B55", "Sortie d'aire pietonne", FN),
 ],
 14: [
    ("C24a", "Conditions particulieres de circulation par voie", ID, "C24a-1"),
    ("C24a", "Conditions particulieres de circulation par voie", ID, "C24a-2"),
    ("C24a", "Conditions particulieres de circulation par voie", ID, "C24a-3"),
    ("C24a", "Conditions particulieres de circulation par voie", ID, "C24a-4"),
    ("C24b", "Voies affectees a l'approche d'une intersection", ID, "C24b-1"),
    ("C24b", "Voies affectees a l'approche d'une intersection", ID, "C24b-2"),
    ("C24c", "Conditions de circulation sur la voie embranchee", ID, "C24c-1"),
    ("C24c", "Conditions de circulation sur la voie embranchee", ID, "C24c-2"),
    ("C25a", "Limites de vitesse aux frontieres (territoire francais)", ID),
    ("C25b", "Rappel des limites de vitesse sur autoroute", ID),
    ("C26a", "Voie de detresse a droite", ID),
    ("C26b", "Voie de detresse a gauche", ID),
    ("C27", "Surelevation de chaussee", ID),
    ("C28", "Reduction du nombre de voies", ID, "C28-1"),
    ("C28", "Reduction du nombre de voies", ID, "C28-2"),
    ("C28", "Reduction du nombre de voies", ID, "C28-3"),
    ("C29a", "Presignalisation d'un creneau de depassement", ID),
    ("C29b", "Creneau de depassement a trois voies (deux voies dans un sens)", ID),
    ("C29c", "Section a trois voies (une voie dans un sens, deux dans l'autre)", ID),
    ("C30", "Fin de creneau de depassement a trois voies", ID),
    ("C50", "Indications diverses", ID),
    ("C62", "Presignalisation d'une borne de retrait de ticket de peage", ID),
    ("C64a", "Paiement aupres d'un peagiste", ID),
    ("C64b", "Paiement par carte bancaire", ID),
 ],
 15: [
    ("C64c", "Paiement automatique par pieces de monnaie", ID),
    ("C64d", "Paiement par abonnement (telepeage)", ID, "C64d-1"),
    ("C64d", "Paiement par abonnement (telepeage)", ID, "C64d-2"),
    ("C107", "Route a acces reglemente", ID),
    ("C108", "Fin de route a acces reglemente", ID),
    ("C111", "Entree d'un tunnel", ID),
    ("C112", "Sortie de tunnel", ID),
    ("C113", "Piste ou bande cyclable conseillee et reservee aux cycles", ID),
    ("C114", "Fin de piste ou bande cyclable conseillee", ID),
    ("C115", "Voie verte (pietons et vehicules non motorises)", ID),
    ("C116", "Fin de voie verte", ID),
    ("C117", "Presignalisation d'un tunnel interdit a certaines marchandises dangereuses", ID, "C117-1"),
    ("C117", "Presignalisation d'un tunnel interdit a certaines marchandises dangereuses", ID, "C117-2"),
    ("C207", "Debut de section d'autoroute", ID),
    ("C208", "Fin de section d'autoroute", ID),
    ("CE1", "Poste de secours", SV),
    ("CE2a", "Poste d'appel d'urgence", SV),
    ("CE2b", "Cabine telephonique publique", SV),
    ("CE3a", "Informations touristiques", SV),
    ("CE3b", "Relais d'information service", SV),
    ("CE4a", "Terrain de camping pour tentes", SV),
 ],
 24: [
    ("E52a", "Borne routiere (reseau national)", LO, "E52a-1"),
    ("E52a", "Borne routiere (reseau national)", LO, "E52a-2"),
    ("E52a", "Borne routiere (reseau national)", LO, "E52a-3"),
    ("E52b", "Borne routiere avec altitude (reseau national)", LO, "E52b-1"),
    ("E52b", "Borne routiere avec altitude (reseau national)", LO, "E52b-2"),
    ("E52c", "Plaquette de reperage hectometrique (national)", LO, "E52c-1"),
    ("E52c", "Plaquette de reperage hectometrique (national)", LO, "E52c-2"),
    ("E53a", "Borne routiere (route departementale)", LO, "E53a-1"),
    ("E53a", "Borne routiere (route departementale)", LO, "E53a-2"),
    ("E53b", "Borne departementale avec altitude", LO, "E53b-1"),
    ("E53b", "Borne departementale avec altitude", LO, "E53b-2"),
    ("E53c", "Plaquette de reperage hectometrique (departementale)", LO, "E53c-1"),
    ("E53c", "Plaquette de reperage hectometrique (departementale)", LO, "E53c-2"),
    ("E54a", "Borne des voies communales", LO),
    ("E54b", "Borne communale avec altitude", LO, "E54b-1"),
    ("E54b", "Borne communale avec altitude", LO, "E54b-2"),
    ("E54c", "Plaquette de reperage hectometrique (communale)", LO),
    ("EB10", "Entree d'agglomeration", LO),
    ("EB20", "Sortie d'agglomeration", LO),
 ],
 29: [
    ("SE2b", "Identification d'un echangeur (sortie a droite)", DR, "SE2b-1"),
    ("SE2b", "Identification d'un echangeur (sortie a droite)", DR, "SE2b-2"),
    ("SE2c", "Identification d'un echangeur (sortie a gauche exceptionnelle)", DR),
    ("SE3", "Bifurcation autoroutiere", DR),
    ("SI1a", "Direction interdite aux vehicules de transport de marchandises", DR),
    ("SI1b", "Direction interdite aux marchandises de plus du PTAC indique", DR),
    ("SI2", "Direction interdite aux cycles", DR),
    ("SI3", "Direction interdite aux transports en commun de personnes", DR),
    ("SI4", "Direction interdite aux cyclomoteurs", DR),
    ("SI5", "Direction interdite aux vehicules trop longs", DR),
    ("SI6", "Direction interdite aux vehicules trop larges", DR),
    ("SI7", "Direction interdite aux vehicules trop hauts", DR),
    ("SI8", "Direction interdite aux vehicules trop lourds (PTAC)", DR),
    ("SI9", "Direction interdite aux vehicules trop lourds par essieu", DR),
    ("SI10", "Direction interdite aux marchandises explosives ou inflammables", DR),
    ("SI11", "Direction interdite aux marchandises polluant les eaux", DR),
    ("SI12", "Direction interdite aux marchandises dangereuses", DR),
    ("SI13", "Direction interdite aux motocyclettes", DR),
    ("SI14", "Direction interdite aux vehicules avec caravane ou remorque de plus de 250 kg", DR),
    ("SC1a", "Direction conseillee aux vehicules de transport de marchandises", DR),
    ("SC1b", "Direction conseillee aux marchandises de plus du PTAC indique", DR),
    ("SC2", "Direction conseillee aux cycles", DR),
    ("SC3", "Direction conseillee aux transports en commun de personnes", DR),
    ("SC4", "Direction conseillee aux cyclomoteurs", DR),
 ],
 33: [
    ("J1", "Balisage des virages", BA),
    ("J1bis", "Balisage des virages (routes frequemment enneigees)", BA),
    ("J3", "Signalisation de position des intersections de routes", BA),
    ("J4", "Balisage de virages (chevrons)", BA, "J4-1"),
    ("J4", "Balisage de virages (chevrons)", BA, "J4-2"),
    ("J5", "Signalisation des tetes d'ilots directionnels (contournement par la droite)", BA),
    ("J6", "Delineateur - balisage des limites de chaussee", BA),
    ("J7", "Manche a air - signalement d'un vent lateral violent", BA),
    ("J10", "Balise pour passage a niveau", BA),
    ("J11", "Renforcement d'un marquage continu permanent", BA),
    ("J12", "Renforcement d'un marquage permanent en divergent", BA),
    ("J13", "Balise de signalisation d'obstacle", BA),
    ("J14a", "Balises de musoir - divergence des voies", BA, "J14a"),
    ("J14b", "Balises de musoir - divergence des voies", BA, "J14b"),
    ("G1", "Position d'un passage a niveau / aire de danger aerien", PN),
    ("G1bis", "Passage a niveau a une voie avec signalisation automatique", PN),
    ("G1a", "Passage a niveau a plusieurs voies sans barriere", PN),
    ("G1a_bis", "Passage a niveau a plusieurs voies avec signalisation automatique", PN),
 ],
 39: [
    ("AK2", "Cassis ou dos d'ane (temporaire)", TP),
    ("AK3", "Chaussee retrecie (temporaire)", TP),
    ("AK4", "Chaussee glissante (temporaire)", TP),
    ("AK5", "Travaux", TP),
    ("AK14", "Autres dangers (temporaire)", TP),
    ("AK17", "Annonce de signaux lumineux reglant la circulation", TP),
    ("AK22", "Projection de gravillons", TP),
    ("AK30", "Bouchon", TP),
    ("AK31", "Accident", TP),
    ("K1", "Fanion - obstacle temporaire de faible importance", TP, "K1"),
    ("K2", "Barrage - signalisation de position (fin de chantier)", TP, "K2-1"),
    ("K2", "Barrage - signalisation de position (chevrons)", TP, "K2-2"),
    ("K5a", "Dispositif conique (cone de chantier)", TP),
    ("K5b", "Piquet de balisage", TP),
    ("K5c", "Balise d'alignement", TP),
    ("K5d", "Balise de guidage", TP),
    ("K8", "Signal de position d'une deviation ou d'un retrecissement", TP, "K8-1"),
    ("K8", "Signal de position d'une deviation ou d'un retrecissement", TP, "K8-2"),
    ("K10", "Signal pour regler manuellement la circulation", TP),
    ("K14", "Ruban de delimitation de chantier", TP),
    ("K15", "Portique - presignalisation de gabarit limite", TP, "K15-1"),
    ("K15", "Portique - presignalisation de gabarit limite", TP, "K15-2"),
    ("K16", "Separateur modulaire de voie", TP),
    ("KC1", "Indication de chantier important ou de situations diverses", TP),
 ],
}


def reading_order(page):
    """Retourne la liste des indices d'image (1-based, ordre extract_img.py)
    tries en ordre de lecture (lignes puis colonnes)."""
    items = []
    for i, img in enumerate(page.get_images(full=True)):
        xref = img[0]
        # une meme image peut etre placee plusieurs fois (plusieurs rects)
        for r in page.get_image_rects(xref):
            items.append([i + 1, round(r.x0), round(r.y0)])
    items.sort(key=lambda t: t[2])
    rows, cur, last = [], [], None
    for it in items:
        if last is None or it[2] - last <= 25:
            cur.append(it)
        else:
            rows.append(cur); cur = [it]
        last = it[2]
    if cur:
        rows.append(cur)
    order = []
    for row in rows:
        row.sort(key=lambda t: t[1])
        order.extend(idx for idx, _, _ in row)
    return order


def main():
    os.makedirs(OUT_IMGS, exist_ok=True)
    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    doc = pymupdf.open(PDF)
    catalog = []
    seen_ids = set()
    for pageno, labels in PAGES.items():
        order = reading_order(doc[pageno - 1])
        assert len(order) == len(labels), (
            f"page {pageno}: {len(order)} images vs {len(labels)} labels")
        for pos, (idx, label) in enumerate(zip(order, labels)):
            code, name, cat = label[0], label[1], label[2]
            uid = label[3] if len(label) > 3 else code
            assert uid not in seen_ids, f"id duplique: {uid}"
            seen_ids.add(uid)
            src = os.path.join(SRC_IMGS, f"page{pageno}_img{idx}.jpeg")
            dst_name = f"{uid}.jpeg"
            shutil.copyfile(src, os.path.join(OUT_IMGS, dst_name))
            catalog.append({
                "id": uid,
                "code": code,
                "name": name,
                "category": cat,
                "categoryLabel": CATEGORIES[cat],
                "image": f"panneaux/{dst_name}",
                "source": {"page": pageno, "index": idx},
            })
    doc.close()

    payload = {
        "categories": [
            {"key": k, "label": v,
             "count": sum(1 for e in catalog if e["category"] == k)}
            for k, v in CATEGORIES.items()
        ],
        "count": len(catalog),
        "panneaux": catalog,
    }
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"OK: {len(catalog)} panneaux ecrits dans {OUT_JSON}")
    print(f"    images copiees dans {OUT_IMGS}")
    for c in payload["categories"]:
        print(f"    - {c['label']}: {c['count']}")


if __name__ == "__main__":
    main()
