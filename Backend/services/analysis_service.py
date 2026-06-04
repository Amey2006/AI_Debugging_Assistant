from analyzers.parser import parse_error
from analyzers.classifier import classify_error
from analyzers.rules import get_rule_based_solution


def analyze_error(code: str, error_message: str):

    parsed = parse_error(error_message)

    error_type = parsed["error_type"]

    category = classify_error(error_type)

    rule_data = get_rule_based_solution(error_type)

    return {
        "error_type": error_type,
        "category": category,
        "explanation": rule_data["explanation"],
        "suggestion": rule_data["suggestion"],
        "line_number": parsed["line_number"]
    }