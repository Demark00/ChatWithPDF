from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.responses import PlainTextResponse
from utils.pdf_extractor import extract_text_from_pdf

app = FastAPI()

# Allow cors for node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    content = await file.read()
    try:
        text = extract_text_from_pdf(content)
        return {"text":text}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    

@app.get("/health")
async def health():
    return PlainTextResponse("OK", status_code=200)