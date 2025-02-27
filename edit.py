from PIL import Image

img = Image.open("C:/Users/Rahul Verma/Downloads/Untitled design.png")
data = img.load()

x = img.width
y = img.height

for i in range(x):
    for j in range(y):
        if data[i,j] >= (230,230,230,255):
            data[i,j] = (0,0,0,0)

img.save("C:/Users/Rahul Verma/Downloads/Untitled design_edit.png")