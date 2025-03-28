class CalculateError(Exception):
    """Custom exception for calculation errors in solvers."""
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)