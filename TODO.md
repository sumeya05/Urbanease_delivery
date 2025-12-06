# TODO: Rectify Pydantic BaseSettings Import Error

## Steps to Complete:

- [ ] Update import in backend/app/config.py: Change `from pydantic import BaseSettings` to `from pydantic_settings import BaseSettings`
- [ ] Add `pydantic-settings` to backend/requirements.txt
- [ ] Install updated dependencies: Run `pip install -r requirements.txt` in backend directory
- [ ] Test the server: Run `cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload` to verify the error is resolved
