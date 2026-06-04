def get_rule_based_solution(error_type: str):
    rules = {
        "SyntaxError": {
            "explanation": "There is a syntax mistake in your code.",
            "suggestion": "Check for missing brackets, quotes, or colons."
        },

        "IndentationError": {
            "explanation": "Python found incorrect indentation.",
            "suggestion": "Make sure spaces/tabs are properly aligned."
        },

        "ImportError": {
            "explanation": "Python could not import the module.",
            "suggestion": "Check module name or install missing package."
        },

        "ModuleNotFoundError": {
            "explanation": "Required module is missing.",
            "suggestion": "Install package using pip."
        },

        "TypeError": {
            "explanation": "Operation performed on incompatible data type.",
            "suggestion": "Check variable types before operation."
        },
        
        "RuntimeWarning": {
            "explanation": "Async function may not be awaited properly.",
            "suggestion": "Use await when calling async functions."
        }
    }

    return rules.get(
        error_type,
        {
            "explanation": "Unknown error occurred.",
            "suggestion": "Check traceback carefully."
        }
    )