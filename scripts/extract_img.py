import fitz  # PyMuPDF
import os

def extraire_images_pdf(chemin_pdf, dossier_sortie="images_extraites"):
    os.makedirs(dossier_sortie, exist_ok=True)
    doc = fitz.open(chemin_pdf)
    compteur = 0

    for num_page in range(len(doc)):
        page = doc[num_page]
        images = page.get_images(full=True)

        for index_img, img in enumerate(images):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            extension = base_image["ext"]  # jpg, png, etc.

            compteur += 1
            nom_fichier = f"page{num_page+1}_img{index_img+1}.{extension}"
            chemin_fichier = os.path.join(dossier_sortie, nom_fichier)

            with open(chemin_fichier, "wb") as f:
                f.write(image_bytes)

    doc.close()
    print(f"{compteur} image(s) extraite(s) dans le dossier '{dossier_sortie}'")

if __name__ == "__main__":
    chemin_pdf = "courses/liste_panneaux.pdf"  # à adapter
    extraire_images_pdf(chemin_pdf)