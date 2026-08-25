import os
from bs4 import BeautifulSoup

# Folder containing your built HTML files
folder_path = "/NewPrograms/Github/acasez.github.io/Kastorix"

# Base tag to insert
base_tag = "<base href=\"/Kastorix/\">"

for filename in os.listdir(folder_path):
    if filename.endswith(".html"):
        filepath = os.path.join(folder_path, filename)
        with open(filepath, "r+", encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), "html.parser")
            head = soup.head
            if head and not head.find("base"):
                head.insert(0, BeautifulSoup(base_tag, "html.parser"))
            f.seek(0)
            f.write(str(soup))
            f.truncate()
