"""
projects/segaso-app/scripts/ensamblar_video.py
Python script to assemble the 45-second promotional video using FFmpeg and Kokoro audio.
"""
import os
import subprocess

VIDEO_DIR = r"C:\PROYECTOS\Mis_Proyectos\Asistente_Personal\projects\segaso-app\videos"
OUT_DIR = r"C:\Users\dev\Desktop\Segaso\04_VIDEO_PROMOCIONAL"
os.makedirs(OUT_DIR, exist_ok=True)

TEMP_DIR = os.path.join(VIDEO_DIR, "temp_clips")
os.makedirs(TEMP_DIR, exist_ok=True)

# 1. Definir los 5 cortes
cuts = [
    {
        "src": os.path.join(VIDEO_DIR, "video_4.mp4"),
        "ss": "00:00:00",
        "t": "8",
        "out": os.path.join(TEMP_DIR, "c1.mp4")
    },
    {
        "src": os.path.join(VIDEO_DIR, "video_2.mp4"),
        "ss": "00:00:03",
        "t": "11",
        "out": os.path.join(TEMP_DIR, "c2.mp4")
    },
    {
        "src": os.path.join(VIDEO_DIR, "video_3.mp4"),
        "ss": "00:00:00",
        "t": "10",
        "out": os.path.join(TEMP_DIR, "c3.mp4")
    },
    {
        "src": os.path.join(VIDEO_DIR, "video_1.mp4"),
        "ss": "00:00:00",
        "t": "9",
        "out": os.path.join(TEMP_DIR, "c4.mp4")
    },
    {
        "src": os.path.join(VIDEO_DIR, "video_4.mp4"),
        "ss": "00:00:15",
        "t": "8",
        "out": os.path.join(TEMP_DIR, "c5.mp4")
    }
]

print("🎬 Normalizando y recortando los 5 clips a 1080x1920...")
for i, cut in enumerate(cuts, 1):
    cmd = [
        "ffmpeg", "-y",
        "-ss", cut["ss"],
        "-t", cut["t"],
        "-i", cut["src"],
        "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30",
        "-c:v", "libx264", "-preset", "fast", "-crf", "22", "-pix_fmt", "yuv420p",
        "-an",
        cut["out"]
    ]
    subprocess.run(cmd, check=True)
    print(f"  ✓ Clip {i} listo.")

# 2. Concat demuxer
concat_txt = os.path.join(TEMP_DIR, "concat.txt")
with open(concat_txt, "w") as f:
    for cut in cuts:
        f.write(f"file '{cut['out'].replace(os.sep, '/')}'\n")

concatenated_video = os.path.join(TEMP_DIR, "concatenated.mp4")
print("🎞️ Concatenando video...")
subprocess.run([
    "ffmpeg", "-y",
    "-f", "concat", "-safe", "0",
    "-i", concat_txt,
    "-c", "copy",
    concatenated_video
], check=True)

# 3. Mezclar con la locución en off
audio_src = os.path.join(VIDEO_DIR, "locucion_segaso.wav")
final_output = os.path.join(OUT_DIR, "VIDEO_PROMOCIONAL_SEGASO.mp4")

print("🔊 Mezclando audio neuronal y generando video final...")
subprocess.run([
    "ffmpeg", "-y",
    "-i", concatenated_video,
    "-i", audio_src,
    "-c:v", "copy",
    "-c:a", "aac", "-b:a", "192k",
    "-shortest",
    final_output
], check=True)

print("🎉 Video promocional completado con éxito:", final_output)

# 4. Guardar archivo con el guion
guion_file = os.path.join(OUT_DIR, "GUION_AUDIO_Y_LOCUCION.txt")
guion_content = """========================================================================
GUION PUBLICITARIO OFICIAL — SEGASO CHORIZOS S.A.S. (46 SEGUNDOS)
========================================================================

FORMATO: Video Vertical 9:16 (1080x1920 px) para Reels, TikTok y Presentación
DURACIÓN: 45.76 segundos (Cumple requerimiento de <= 60s)
VOZ IA: Locución Neuronal en Español (Dora / Bella)
ARCHIVOS ORIGINALES: Footage real de Harold García y Planta en Envigado

ESTRUCTURA ESCENA POR ESCENA:
------------------------------------------------------------------------
[00:00 - 00:08] PLANO 1: Harold García con sombrero aguadeño y arepas al cuello.
AUDIO: "¿Cansado de los chorizos industriales llenos de harinas y almidones? En Envigado tenemos algo auténtico para ti."

[00:08 - 00:19] PLANO 2: Filas de chorizos artesanales colgados en curación natural.
AUDIO: "Somos Segaso Chorizos, ganadores de Antójate de Antioquia. Elaborados con cien por ciento carne de cerdo magro, totalmente libres de gluten y empacados al vacío con sesenta días de frescura."

[00:19 - 00:29] PLANO 3: Carnes jugosas en la parrilla y servidas en caliente.
AUDIO: "Nueve referencias gourmet para disfrutar en familia, o el mejor servicio de Asados al Barril para tus eventos."

[00:29 - 00:38] PLANO 4: Plato servido con chicharrón crocante y patacones dorados.
AUDIO: "Pide fácil por WhatsApp con diez por ciento de descuento usando el cupón SEGASO diez."

[00:38 - 00:46] PLANO 5: Harold sonriendo y despidiéndose con energía paisa.
AUDIO: "Segaso: chorizos de tradición artesanal. ¡Pide los tuyos hoy mismo!"

========================================================================
"""

with open(guion_file, "w", encoding="utf-8") as f:
    f.write(guion_content)

print("📝 Guion guardado en:", guion_file)
