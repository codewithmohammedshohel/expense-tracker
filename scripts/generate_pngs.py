import zlib
import struct
import os

def create_png(width, height, color_rgb):
    """Generates a valid uncompressed PNG image with a stylish emblem pattern."""
    raw_data = bytearray()
    r, g, b = color_rgb
    for y in range(height):
        raw_data.append(0)  # filter type 0 (None)
        for x in range(width):
            # Create a stylized squircle with gradient effect
            dx = abs(x - width / 2) / (width / 2)
            dy = abs(y - height / 2) / (height / 2)
            dist = (dx**4 + dy**4)**0.25
            
            # Corner radius
            if dist > 0.95:
                # Transparent outside squircle
                raw_data.extend([0, 0, 0, 0])
            elif dist > 0.90:
                # Border glow
                raw_data.extend([16, 185, 129, 255])
            else:
                # Center wallet/diamond emblem
                cx = abs(x - width / 2)
                cy = abs(y - height / 2)
                if (cx + cy) < (width * 0.22):
                    # Emerald diamond center
                    raw_data.extend([52, 211, 153, 255])
                elif (cx + cy) < (width * 0.28):
                    # Dark inner border
                    raw_data.extend([6, 78, 59, 255])
                else:
                    # Dark green background
                    raw_data.extend([r, g, b, 255])

    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw_data), 9)

    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')

os.makedirs('public', exist_ok=True)

# Generate 192x192
with open('public/pwa-192x192.png', 'wb') as f:
    f.write(create_png(192, 192, (5, 46, 22)))

# Generate 512x512
with open('public/pwa-512x512.png', 'wb') as f:
    f.write(create_png(512, 512, (5, 46, 22)))

# Generate 512x512 maskable (full bleed)
with open('public/pwa-maskable-512x512.png', 'wb') as f:
    f.write(create_png(512, 512, (5, 46, 22)))

# Generate 180x180 apple touch icon
with open('public/apple-touch-icon.png', 'wb') as f:
    f.write(create_png(180, 180, (5, 46, 22)))

# Favicon
with open('public/favicon.ico', 'wb') as f:
    f.write(create_png(64, 64, (5, 46, 22)))

print("PNG icons generated successfully!")
