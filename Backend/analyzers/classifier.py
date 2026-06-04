# def classify_error(error_type: str):
#     mapping = {
#         "SyntaxError": "syntax",
#         "IndentationError": "indentation",
#         "ImportError": "import",
#         "ModuleNotFoundError": "import",
#         "TypeError": "runtime",
#         "NameError": "runtime",
#         "AttributeError": "runtime",
#         "RuntimeError": "runtime",
#         "RuntimeWarning": "async"
#     }

#     return mapping.get(error_type, "unknown")
def classify_error(error_message: str):

    error_lower = error_message.lower()

    if "no module named" in error_lower:
        return {
            "error_type": "ImportError",
            "category": "dependency"
        }

    elif "syntaxerror" in error_lower:
        return {
            "error_type": "SyntaxError",
            "category": "syntax"
        }

    elif "indentationerror" in error_lower:
        return {
            "error_type": "IndentationError",
            "category": "formatting"
        }

    elif "typeerror" in error_lower:
        return {
            "error_type": "TypeError",
            "category": "type"
        }

    return {
        "error_type": "UnknownError",
        "category": "unknown"
    }