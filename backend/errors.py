class AppError(Exception):
    """Raised anywhere in the backend; main.py turns it into {"error", "code"}."""

    def __init__(self, status: int, code: str, message: str):
        self.status = status
        self.code = code
        self.message = message
        super().__init__(message)
