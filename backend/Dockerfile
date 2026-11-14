FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    fonts-dejavu-core \
    fonts-wqy-zenhei \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Extract standalone TTF from wqy-zenhei.ttc for Unicode CJK PDF generation in fpdf2
RUN python -c "from pathlib import Path; from fontTools.ttLib import TTCollection; p = Path('/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc'); p.exists() and TTCollection(str(p)).fonts[0].save('/usr/share/fonts/truetype/wqy/wqy-zenhei.ttf')"

COPY . .
RUN mkdir -p /app/media

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
