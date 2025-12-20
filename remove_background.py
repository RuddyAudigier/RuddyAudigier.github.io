import os
from PIL import Image

def remove_background(input_path, output_path, tolerance=30):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        # Get the background color from the top-left pixel
        bg_color = img.getpixel((0, 0))
        
        newData = []
        for item in datas:
            # Check if the pixel is close to the background color
            if (abs(item[0] - bg_color[0]) < tolerance and
                abs(item[1] - bg_color[1]) < tolerance and
                abs(item[2] - bg_color[2]) < tolerance):
                newData.append((255, 255, 255, 0))  # Transparent
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Processed: {input_path} -> {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

def main():
    input_dir = "img/logoLangage"
    output_dir = "img/logoLangage/processed"
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for filename in os.listdir(input_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, filename)
            # Ensure output is png
            output_path = os.path.splitext(output_path)[0] + ".png"
            remove_background(input_path, output_path)

if __name__ == "__main__":
    main()
