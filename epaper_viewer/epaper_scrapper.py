import requests
from bs4 import BeautifulSoup

def get_pdf_link(url):
    headers = {"User-Agent": "Mozilla/5.0"}
    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, 'html.parser')
    link = soup.find("a", href=lambda href: href and href.endswith(".pdf"))
    return link['href'] if link else None

def get_all_epapers():
    return {
        "hindu": {
            "name": "The Hindu",
            "url": "https://epapertoday.in/the-hindu-newspaper-pdf-download/",
            "image": "/static/logos/hindu.png"
        },
        "lokmat": {
            "name": "Lokmat",
            "url": "https://epapertoday.in/lokmat-newspaper-pdf-download/",
            "image": "/static/logos/lokmat.png"
        },
        "divya_marathi": {
            "name": "Divya Marathi",
            "url": "https://epapertoday.in/divya-marathi-newspaper-pdf-download/",
            "image": "/static/logos/divya-marathi.png"
        },
        "indian_express": {
            "name": "Indian Express",
            "url": "https://epapertoday.in/the-indian-express-newspaper-pdf-download/",
            "image": "/static/logos/indian-express.png"
        },
    }
